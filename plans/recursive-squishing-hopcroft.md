# 执行块头部固定为执行目的 + 全部完成后合并成单个「任务已完成」

## Context
当前每个执行阶段（需求/大纲/PPT 三条 `process` 消息）各自折叠成一个「任务已完成」，共出现三个，且完成态头部文案从「执行目的」变成了「任务已完成」。用户要求（见 image-28）：

1. **一个任务只有一个「任务已完成」**，不是三个。
2. 三个阶段的折叠头**一直显示各自的执行目的**（如「检索资料并梳理制作需求」），不随运行/完成状态切换成「任务已完成」。
3. **整个任务全部完成后**，这三个执行块合并折叠成**顶部一个**「任务已完成」；夹在中间的 AI 回复文字仍保留在下方。已确认：合并块在第一个执行块位置，点击展开显示三个阶段内容。

全部改动都在 `src/app/App.tsx`。

## 改动

### 1. `ExecutionProcess` 完成态头部改回执行目的
`!running` 分支（约 1151–1162 行）：把折叠头的 `任务已完成` 改成 `{preset.running}`（执行目的），展开区仍是 `preset.goal`(任务目标) + 全部 `actions` 步骤。运行态分支已用 `{preset.running}`，保持不变。这样每个阶段无论运行中/已完成，头部都显示执行目的。

### 2. 新增合并块 `MergedProcess`
新组件，props：`variants: ProcessVariant[]`。
- 折叠头：一行「任务已完成」+ chevron（复用 `TaskIcon type="chevron"`），默认折叠。
- 展开：按顺序遍历每个 variant，取 `PROCESS_PRESETS[variant]`，渲染该阶段一段：执行目的行(`preset.running`) + 任务目标行(`preset.goal`) + 全部 `actions` 步骤（复用现有 `TaskIcon` + label 样式）。阶段之间留间距。
- 纯静态，无打字/加载动画。

### 3. `ChatView` 渲染逻辑：完成后用合并块替换三条 process
在 `ChatView`（约 986 行起）内计算：
- `processIndices = messages` 中所有 `role==="process"` 的下标数组；`firstProcessIndex = processIndices[0]`。
- `processVariants = processIndices.map(i => messages[i].variant ?? "requirement")`。
- `taskComplete = messages.some(m => m.role === "result") && !messages.some(m => m.role === "process" && m.thinking)`（有最终结果且没有任何阶段在运行 = 整个任务完成）。

在 `messages.map` 中（保留现有 `i <= revealed` 顺序揭示门控）：
- `msg.role === "process"` 且 `taskComplete`：
  - `i === firstProcessIndex` → 渲染 `<MergedProcess variants={processVariants} />`；
  - 其它 process 下标 → 渲染 `null`（隐藏，已并入合并块）。
- `msg.role === "process"` 且未完成 → 照旧渲染单个 `ChatMessageRow`（个体执行块，头部为执行目的）。
- 其它角色（user/ai/result）→ 照旧 `ChatMessageRow`。

> 说明：任务全程未完成时（如需求完成、等待用户确认大纲），无 result 消息，`taskComplete` 为 false，各执行块保持独立、头部显示执行目的；最终 PPT 结果出现后才合并。

### 4. 顺序揭示与联动保持不变
上一轮的 `revealed` 顺序打字机、`onGoalDone` 推进、切换历史会话重置为满数量的逻辑全部保留；合并块是静态内容，处于 `taskComplete` 时 `revealed` 已到满，不受影响。

## 验证
预览触发「生成PPT」全流程：
- 执行中：三个阶段各自显示自己的执行目的头（不出现「任务已完成」），运行阶段工具逐条揭示。
- 阶段间等待（未出最终结果）时，已完成阶段仍显示执行目的头、可展开看步骤。
- 最终 PPT 结果出现后：顶部只剩**一个**「任务已完成 ›」，点击展开依次显示三个阶段（执行目的 + 任务目标 + 步骤）；中间的 AI 回复文字仍在下方原位。
- 切换历史会话：完成的对话直接显示合并后的单个「任务已完成」，不重放打字。
