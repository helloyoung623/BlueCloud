# 执行过程完全折叠 + 全流程顺序打字机

## Context
两个反馈（针对 `src/app/App.tsx` 的 `ExecutionProcess` 与 `ChatView`）：

1. **完成的执行过程没有真正折叠。** 目前完成态仍常驻显示「任务目标：…」这行（用户说的“工具那一直显示执行意图”），下面只有一个「任务已完成 >」头。用户要整块折叠成**一行**「任务已完成 >」，点击才展开出目标 + 全部工具步骤。
2. **打字机不是顺序的。** 现在多条消息各自独立渲染、可能同时打字，或目标还没打完下面/下一条就出现了。用户要：整个执行流程中，每段文字打字**完全结束后**才出现下一段信息，绝不同时打字、也不提前出现。

用户已确认：折叠那一行显示「任务已完成」。

## 改动（全部在 `src/app/App.tsx`）

### 1. 完成态整块折叠
`ExecutionProcess` 的 `!running` 分支（约 1151–1162 行）：
- 默认 `expanded = false`，只渲染一行按钮「任务已完成」+ chevron。
- 目标文字（`preset.goal`）移到 `{expanded && ...}` 内，和工具步骤一起展开显示——不再常驻。
- 展开区顺序：先 `preset.goal` 一行，再全部 `actions` 步骤行（保持现有 TaskIcon + label 样式）。

### 2. 全流程顺序打字机
核心：一次只让一条消息“进场”，上一条的打字/进场结束后才渲染下一条。

在 `ChatView` 里引入揭示指针：
- 新增 state `revealed`（已完成进场的消息数量），`useState(0)`。
- `messages.map` 只渲染 `i <= revealed` 的消息；`i > revealed` 不渲染。
- 每条消息完成进场时调用 `advance = () => setRevealed(r => Math.max(r, i + 1))`：
  - `ai` 文本消息：`<Typewriter text=... onDone={advance} />`（复用现有 `Typewriter` 的 `onDone`，第 1037 行已支持）。
  - `user`、`result`、以及 `thinking` 占位消息：无打字，挂载即 `advance()`（用 `useEffect`）。
  - `process` 消息：把“本条进场完成”定义为**目标打字完成**即推进下一条（工具执行是长过程，不阻塞后续；后续消息本就由 App 的 timer 在 thinking 翻转后才 push）。让 `ExecutionProcess` 接收 `onGoalDone` 回调，在目标 `Typewriter` 的 `onDone` 里既 `setGoalTyped(true)` 又调用 `onGoalDone`。
- `revealed` 用 `Math.max` 只增不减，历史消息保持已揭示。
- 切换历史会话时把 `revealed` 重置为该会话 `messages.length`（历史消息全部直接显示，不重放打字）——在会话切换的 `useEffect` 中处理。

### 3. 保持目标打字与工具揭示的现有联动
运行态已有 `goalTyped` 门控工具揭示（1126–1142 行），保留不变；目标 `Typewriter` 的 `onDone` 现在同时触发 `onGoalDone` 向上推进 revealed。

## 验证
预览触发「生成PPT」流程，观察：
- 用户气泡 → 第一条 process 目标逐字打完 → 工具逐条揭示 → AI 回复逐字打完 → 下一条 process…… 全程**任一时刻只有一段在打字**，不重叠、不提前。
- 每个完成的执行过程只显示一行「任务已完成 >」，点击展开出「任务目标：…」+ 全部工具步骤，再点收起。
- 切换历史会话时，历史消息直接完整显示，不重新逐字重放。
