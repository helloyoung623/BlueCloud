import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import svgPaths from "@/imports/默认首页-1/svg-4ly00k0kqz";
import svgPanel from "@/imports/需求确认-1/svg-1yxmq1shfb";
import svgOutline from "@/imports/大纲/svg-fzbroqn38q";
import svgSidebar from "@/imports/历史对话操作项/svg-1dh84d0t2n";
import svgTask from "@/imports/任务执行过程/svg-tkwirjnqmk";
import svgProgress from "@/imports/渐进式ReAct/svg-x4n03n8we0";
import svgSearching from "@/imports/搜索中/svg-pcft5f0tqe";
import svgPptToggle from "@/imports/Container/svg-ky29gei8j7";
import svgPresentation from "@/imports/Ppt-1/svg-b6redky6le";
import imgStyle1 from "@/imports/需求确认-1/29d4a489057188d7298a9a9f8b923d2d9c630925.png";
import imgStyle2 from "@/imports/需求确认-1/f49f63a62b02589f759f36fc0961c6709a8e1bdf.png";
import imgStyle3 from "@/imports/需求确认-1/9b2936619dc23e46dde47ce229cadb09c1b911ab.png";
import imgEmpty from "@/imports/Frame427318236/9e55d93ab34e49b9baf8a7d585a49321a5312a43.png";
import { PptPanel, PptResultMessage } from "./components/ppt-result";
import SendButtonFigma from "@/imports/发送按钮";

// ── types ─────────────────────────────────────────────────────────────────────

type ProcessVariant = "requirement" | "outline" | "ppt";
type ProcessPreset = { goal: string; running: string; actions: { label: string; icon: ToolKind }[] };
type Message = { role: "user" | "ai" | "process" | "result"; text: string; thinking?: boolean; variant?: ProcessVariant; preset?: ProcessPreset };
type PptStage = "idle" | "requirement" | "outline_generating" | "outline" | "ppt_generating" | "preview";

type OutlinePageContent =
  | { type: "text"; text: string }
  | { type: "list"; items: string[] };

type OutlinePage = { id: number; pageLabel: string; title: string; content: OutlinePageContent };

// ── helpers ───────────────────────────────────────────────────────────────────

const isPPTIntent = (t: string) => /ppt|演示|幻灯|slide/i.test(t) || t.includes("PPT");

// build an execution process whose copy reflects the user's actual request
const buildQueryProcess = (query: string): ProcessPreset => {
  const topic = query.length > 24 ? `${query.slice(0, 24)}…` : query;
  return {
    goal: `任务目标：${query}`,
    running: `围绕「${topic}」检索并整理信息`,
    actions: [
      { label: `搜索；检索「${topic}」相关信息`, icon: "search" },
      { label: "读取；加载匹配到的内容", icon: "read" },
      { label: "提取；归纳关键信息", icon: "extract" },
      { label: "分析；梳理结果结构", icon: "analyze" },
      { label: "汇总；整理输出结果", icon: "summarize" },
    ],
  };
};

function mockOutlinePages(): OutlinePage[] {
  return [
    {
      id: 1, pageLabel: "第1页", title: "交互设计简史：从命令行到空间计算",
      content: { type: "text", text: "以一张科技感 hero image 奠定深色未来主义基调，交代主题—交互设计从命令行到空间计算的六十年演进历程。" },
    },
    {
      id: 2, pageLabel: "第2页", title: "六大范式跃迁",
      content: { type: "text", text: "以水平时间线形式呈现交互设计六大范式跃迁（CLI > GUI > Web > Mobile > Voice > Spatial），标注关键年份与代表产品，锚定观众对全局演进框架的认知。" },
    },
    {
      id: 3, pageLabel: "第3页", title: "AI 对交互设计的影响",
      content: { type: "list", items: ["AI Chat", "Agent", "Prompt", "Knowledge Base", "文件解析", "Office 集成"] },
    },
    {
      id: 4, pageLabel: "第4页", title: "空间计算时代的交互范式",
      content: { type: "text", text: "探讨 Apple Vision Pro 等设备带来的新交互维度：眼动追踪、手势识别、空间音频，以及设计师如何在三维空间中重构信息架构。" },
    },
    {
      id: 5, pageLabel: "第5页", title: "设计师的新角色与技能图谱",
      content: { type: "list", items: ["系统思维", "AI 协作能力", "多模态设计", "伦理与可解释性", "跨学科协作"] },
    },
    {
      id: 6, pageLabel: "第6页", title: "总结与展望",
      content: { type: "text", text: "回顾六十年演进脉络，提炼不变的设计本质——以人为中心，并对下一个十年的交互形态作出预判与倡导。" },
    },
  ];
}

// ── gradient AI icon ──────────────────────────────────────────────────────────

function AIIcon({ uid }: { uid: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <g clipPath={`url(#c-${uid})`}>
        <path d={svgPaths.p2b6e3f00} fill={`url(#g-${uid})`} />
      </g>
      <defs>
        <linearGradient id={`g-${uid}`} x1="0.222656" y1="7.99995" x2="15.1949" y2="7.99995" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E63F5" /><stop offset="1" stopColor="#13C2C2" />
        </linearGradient>
        <clipPath id={`c-${uid}`}><rect width="16" height="16" fill="white" /></clipPath>
      </defs>
    </svg>
  );
}

// ── slide-up panel shell ──────────────────────────────────────────────────────

function SlidePanel({ visible, onClose, children, mainOffset = 0 }: {
  visible: boolean; onClose: () => void; children: React.ReactNode; mainOffset?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    } else {
      setAnimIn(false);
      const t = setTimeout(() => setMounted(false), 380);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!mounted) return null;
  return (
    <div
      className="fixed left-1/2 z-50 flex flex-col bg-white rounded-[16px]"
      style={{
        width: 800, maxHeight: 560, bottom: 22,
        left: `calc(50% + ${mainOffset}px)`,
        transform: `translateX(-50%) translateY(${animIn ? "0%" : "120%"})`,
        transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
        boxShadow: "0 0 12px rgba(0,0,0,0.08)", border: "1px solid #e6e6e6",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

// ── countdown hook (cancels on interaction) ───────────────────────────────────

function useCountdown(active: boolean, seconds: number, onDone: () => void) {
  const [count, setCount] = useState(seconds);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (!active) return;
    setCount(seconds);
    setCancelled(false);
  }, [active, seconds]);

  useEffect(() => {
    if (!active || cancelled || count <= 0) {
      if (active && !cancelled && count <= 0) onDone();
      return;
    }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [active, cancelled, count, onDone]);

  const cancel = useCallback(() => setCancelled(true), []);
  return { count, cancelled, cancel };
}

// ── panel close button ────────────────────────────────────────────────────────

function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-[24px] h-[24px] flex items-center justify-center rounded-[4px] hover:bg-[#f7f7f7] shrink-0 cursor-pointer">
      <svg width="11" height="11" viewBox="0 0 10.371 10.371" fill="none">
        <path d={svgPanel.p28244cc0} fill="black" fillOpacity="0.88" />
      </svg>
    </button>
  );
}

// ── panel footer with countdown ───────────────────────────────────────────────

function PanelFooter({ count, cancelled, onConfirm }: { count: number; cancelled: boolean; onConfirm: () => void }) {
  return (
    <div className="shrink-0 px-[16px] py-[16px] flex items-center gap-[16px] bg-[rgba(255,255,255,0.92)] border-t border-[#f2f2f2]">
      <p className="flex-1 text-[14px] leading-[22px]">
        {!cancelled && (
          <><span className="text-[#1e63f5] font-medium">{count}S</span><span className="text-[rgba(0,0,0,0.38)]"> 后自动确认</span></>
        )}
      </p>
      <button onClick={onConfirm} className="bg-[#1e63f5] text-white text-[14px] leading-[22px] font-normal px-[16px] py-[5px] rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity">
        确认
      </button>
    </div>
  );
}

// ── requirement panel ─────────────────────────────────────────────────────────

function OptionItem({ label, selected, onClick, image }: { label: string; selected: boolean; onClick: () => void; image?: string }) {
  return (
    <div onClick={onClick} className="relative rounded-[8px] cursor-pointer flex-1 min-w-0">
      <div aria-hidden className={`absolute inset-0 rounded-[8px] border pointer-events-none ${selected ? "border-[#1e63f5]" : "border-[#e6e6e6]"}`} />
      <div className="flex items-center px-[12px] py-[8px] gap-[10px]">
        <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] whitespace-nowrap">{label}</span>
        {image && <div className="absolute h-[22px] right-[8px] top-[8px] w-[39px] rounded-[4px] overflow-hidden"><img src={image} alt="" className="w-full h-full object-cover" /></div>}
      </div>
    </div>
  );
}

function GridItem({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} className="relative rounded-[8px] cursor-pointer">
      <div aria-hidden className={`absolute inset-0 rounded-[8px] border pointer-events-none ${selected ? "border-[#1e63f5]" : "border-[#e6e6e6]"}`} />
      <div className="px-[12px] py-[8px]">
        <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] whitespace-nowrap">{label}</span>
      </div>
    </div>
  );
}

function RequirementPanel({ visible, onClose, onConfirm, mainOffset = 0 }: {
  visible: boolean; onClose: () => void; onConfirm: () => void; mainOffset?: number;
}) {
  const [style, setStyle] = useState("科技现代");
  const [scenes, setScenes] = useState<string[]>(["商业路演"]);
  const [audience, setAudience] = useState<string[]>(["投资人"]);
  const [pages, setPages] = useState("8～12页");
  const [moreStylesOpen, setMoreStylesOpen] = useState(false);
  const closeMoreStylesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const openMoreStyles = () => {
    if (closeMoreStylesTimer.current) clearTimeout(closeMoreStylesTimer.current);
    setMoreStylesOpen(true);
  };
  const deferCloseMoreStyles = () => {
    if (closeMoreStylesTimer.current) clearTimeout(closeMoreStylesTimer.current);
    closeMoreStylesTimer.current = setTimeout(() => setMoreStylesOpen(false), 180);
  };

  const handleConfirm = useCallback(() => { onConfirm(); }, [onConfirm]);
  const { count, cancelled, cancel } = useCountdown(visible, 30, handleConfirm);

  const toggle = (set: string[], val: string, setter: (v: string[]) => void) =>
    setter(set.includes(val) ? set.filter(x => x !== val) : [...set, val]);

  const handleInteract = () => cancel();

  return (
    <SlidePanel visible={visible} onClose={onClose} mainOffset={mainOffset}>
      {/* header */}
      <div className="shrink-0 px-[16px] pt-[16px] pb-[8px]">
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-medium leading-[24px] text-[rgba(0,0,0,0.88)]">确认制作需求</span>
          <CloseBtn onClick={onClose} />
        </div>
        <p className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.6)] mt-[2px]">确保 AI 生成的方向符合您的预期</p>
      </div>

      {/* body */}
      <div ref={scrollRef} onScroll={handleInteract} onClick={handleInteract} className="flex-1 overflow-y-auto min-h-0 px-[16px] pb-[16px] flex flex-col gap-[16px]">
        {/* 视觉风格 */}
        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-medium leading-[22px] text-[rgba(0,0,0,0.88)]">视觉风格</span>
          <div className="grid grid-cols-3 gap-[12px]">
            <OptionItem label="科技现代" image={imgStyle1} selected={style === "科技现代"} onClick={() => setStyle("科技现代")} />
            <OptionItem label="商务风"   image={imgStyle2} selected={style === "商务风"}   onClick={() => setStyle("商务风")} />
            <OptionItem label="XXX"      image={imgStyle3} selected={style === "XXX"}      onClick={() => setStyle("XXX")} />
            <div
              className="relative col-span-1"
              onMouseEnter={openMoreStyles}
              onMouseLeave={deferCloseMoreStyles}
            >
              <button
                type="button"
                onClick={openMoreStyles}
                className={`relative flex w-full items-center justify-between rounded-[8px] px-[12px] py-[8px] text-left cursor-pointer ${moreStylesOpen ? "bg-[#f7f7f7]" : "bg-white"}`}
              >
                <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)]">更多</span>
                <svg width="10" height="12" viewBox="0 0 5.30321 9.19243" fill="none" className="-scale-x-100"><path d={svgPanel.p5e65780} fill="black" fillOpacity="0.38" /></svg>
                <span aria-hidden className="absolute inset-0 rounded-[8px] border border-[#e6e6e6] pointer-events-none" />
              </button>
              {moreStylesOpen && (
                <div
                  className="absolute left-0 top-[calc(100%+8px)] z-40 w-[192px] rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]"
                  onMouseEnter={openMoreStyles}
                  onMouseLeave={deferCloseMoreStyles}
                >
                  {["简约清新", "创意插画", "深色未来", "复古艺术", "品牌活力", "专业报告"].map(option => (
                    <button
                      key={option}
                      type="button"
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={() => { setStyle(option); setMoreStylesOpen(false); }}
                      className={`flex w-full items-center justify-between rounded-[8px] px-[8px] py-[11px] text-left text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] transition-colors ${style === option ? "" : "hover:bg-[#f7f7f7]"}`}
                    >
                      <span>{option}</span>
                      {style === option && <span aria-hidden className="text-[16px] leading-[16px] text-[#1e63f5]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 演示场景 */}
        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-medium leading-[22px] text-[rgba(0,0,0,0.88)]">演示场景（可多选）</span>
          <div className="flex gap-[12px]">
            {["商业路演", "内部汇报", "其他"].map(s => (
              <OptionItem key={s} label={s} selected={scenes.includes(s)} onClick={() => toggle(scenes, s, setScenes)} />
            ))}
          </div>
        </div>

        {/* 受众对象 */}
        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-medium leading-[22px] text-[rgba(0,0,0,0.88)]">受众对象（可多选）</span>
          <div className="grid grid-cols-3 gap-[12px]">
            {["投资人", "管理层", "客户", "团队成员", "其他"].map(s => (
              <GridItem key={s} label={s} selected={audience.includes(s)} onClick={() => toggle(audience, s, setAudience)} />
            ))}
          </div>
        </div>

        {/* 页数 */}
        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-medium leading-[22px] text-[rgba(0,0,0,0.88)]">页数</span>
          <div className="flex gap-[12px]">
            {["8～12页", "12～16页", "16页以上"].map(s => (
              <OptionItem key={s} label={s} selected={pages === s} onClick={() => setPages(s)} />
            ))}
          </div>
        </div>

        {/* 补充说明 */}
        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-medium leading-[22px] text-[rgba(0,0,0,0.88)]">其他需求</span>
          <div className="relative rounded-[8px] h-[40px]">
            <div aria-hidden className="absolute inset-0 rounded-[8px] border border-[#e6e6e6] pointer-events-none" />
            <input className="w-full h-full px-[12px] text-[14px] leading-[22px] placeholder:text-[rgba(0,0,0,0.26)] bg-transparent outline-none" placeholder="请输入您想强调的关键数据、特定观点或特殊要求…" onFocus={handleInteract} />
          </div>
        </div>
      </div>

      <PanelFooter count={count} cancelled={cancelled} onConfirm={handleConfirm} />
    </SlidePanel>
  );
}

// ── outline panel ─────────────────────────────────────────────────────────────

type PresentationMode = "smart" | "visual";

function VisualizationSubmenu({ onSelect }: { onSelect: (style: string) => void }) {
  const styles = ["智能匹配", "折线图", "柱状图", "饼图"];
  return (
    <div className="absolute right-[calc(100%+8px)] top-0 z-30 w-[168px] rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]">
      {styles.map((style, index) => (
        <button
          key={style}
          type="button"
          onClick={event => { event.stopPropagation(); onSelect(style); }}
          className="flex w-full items-center justify-between rounded-[8px] px-[8px] py-[7px] text-left hover:bg-[#f7f7f7]"
        >
          <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)]">{style}</span>
          {index === 0 && <span className="text-[#1e63f5]">✓</span>}
        </button>
      ))}
    </div>
  );
}

function PresentationMenu({ mode, onChange, onClose }: {
  mode: PresentationMode;
  onChange: (mode: PresentationMode) => void;
  onClose: () => void;
}) {
  const [visualHovered, setVisualHovered] = useState(false);
  return (
    <div className="absolute right-0 top-[30px] z-20 w-[304px] rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]">
      <button
        type="button"
        onClick={event => { event.stopPropagation(); onChange("smart"); onClose(); }}
        className="flex w-full items-start gap-[8px] rounded-[8px] p-[8px] text-left hover:bg-[#f7f7f7]"
      >
        <span className={`mt-[5px] flex size-[16px] shrink-0 items-center justify-center rounded-full border ${mode === "smart" ? "border-[#1e63f5]" : "border-[rgba(0,0,0,0.26)]"}`}>
          {mode === "smart" && <span className="size-[8px] rounded-full bg-[#1e63f5]" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)]">智能呈现</span>
          <span className="block text-[14px] leading-[22px] text-[rgba(0,0,0,0.6)] font-normal">AI 综合内容，自动匹配最佳呈现方式</span>
        </span>
      </button>
      <div className="relative" onMouseEnter={() => setVisualHovered(true)} onMouseLeave={() => setVisualHovered(false)}>
        <button
          type="button"
          onClick={event => { event.stopPropagation(); onChange("visual"); onClose(); }}
          className="flex w-full items-start gap-[8px] rounded-[8px] p-[8px] text-left hover:bg-[#f7f7f7]"
        >
          <span className={`mt-[5px] flex size-[16px] shrink-0 items-center justify-center rounded-full border ${mode === "visual" ? "border-[#1e63f5]" : "border-[rgba(0,0,0,0.26)]"}`}>
            {mode === "visual" && <span className="size-[8px] rounded-full bg-[#1e63f5]" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)]">可视化呈现</span>
            <span className="block max-w-[220px] break-words pr-[8px] text-[14px] leading-[22px] text-[rgba(0,0,0,0.6)] font-normal">把数据、流程和知识概念转成直观图表可视化</span>
          </span>
          <span className="mt-[5px] text-[rgba(0,0,0,0.26)]">›</span>
        </button>
        {visualHovered && <VisualizationSubmenu onSelect={() => { onChange("visual"); onClose(); }} />}
      </div>
    </div>
  );
}

function OutlinePageCard({ page, presentation, onPresentationChange }: {
  page: OutlinePage;
  presentation: PresentationMode;
  onPresentationChange: (mode: PresentationMode) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const showControl = hovered || menuOpen || presentation === "visual";
  const label = presentation === "visual" ? "呈现形式：可视化呈现" : "呈现形式：智能呈现";

  return (
    <div
      className="bg-[#f7f7f7] relative rounded-[8px] shrink-0 w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); if (!menuOpen) setMenuOpen(false); }}
    >
      <div className="flex flex-col gap-[8px] items-start p-[8px]">
        <div className="relative w-full min-h-[20px]">
          <p className="font-['PingFang_SC:Regular' font-normal,sans-serif] leading-[20px] text-[12px] text-[rgba(0,0,0,0.38)] tracking-[0.012px] whitespace-nowrap">{page.pageLabel}</p>
          {showControl && (
            <div className="absolute right-0 top-0 z-10">
              <button
                type="button"
                onClick={event => { event.stopPropagation(); setMenuOpen(value => !value); }}
                className={`flex items-center gap-[8px] rounded-[4px] bg-white px-[8px] py-px text-[14px] leading-[22px] tracking-[0.014px] transition-colors ${presentation === "visual" ? "text-[#1e63f5]" : "text-[rgba(0,0,0,0.88)]"}`}
              >
                {presentation === "visual" && <span className="text-[#1e63f5]">▣</span>}
                <span className="font-normal">{label}</span>
                <svg className="size-[8px]" fill="none" viewBox="0 0 5.82064 4.69468" preserveAspectRatio="none">
                  <path d={svgPresentation.p35e26b00} fill={presentation === "visual" ? "#1E63F5" : "black"} fillOpacity={presentation === "visual" ? "1" : "0.88"} />
                </svg>
              </button>
              {menuOpen && <PresentationMenu mode={presentation} onChange={onPresentationChange} onClose={() => setMenuOpen(false)} />}
            </div>
          )}
        </div>
        <p className="font-medium leading-[24px] text-[16px] text-[rgba(0,0,0,0.88)] w-full">{page.title}</p>
        {page.content.type === "text" ? (
          <p className="leading-[22px] text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-full">{page.content.text}</p>
        ) : (
          <ul className="list-disc leading-[22px] text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-full">
            {page.content.items.map((item, i) => (
              <li key={i} className="ms-[21px]">{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function OutlinePanel({ visible, onClose, onConfirm, mainOffset = 0 }: {
  visible: boolean; onClose: () => void; onConfirm: () => void; mainOffset?: number;
}) {
  const [pages, setPages] = useState<OutlinePage[]>([]);
  const [showAiEdit, setShowAiEdit] = useState(false);
  const [aiEditText, setAiEditText] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [presentations, setPresentations] = useState<Record<number, PresentationMode>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const aiInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible) { setPages(mockOutlinePages()); setShowAiEdit(false); setPresentations({}); }
  }, [visible]);

  const handleConfirm = useCallback(() => onConfirm(), [onConfirm]);
  const { count, cancelled, cancel } = useCountdown(visible && pages.length > 0, 30, handleConfirm);

  const handleAiEditClick = () => {
    cancel();
    setShowAiEdit(true);
    setTimeout(() => aiInputRef.current?.focus(), 50);
  };

  const handleAiSubmit = () => {
    if (!aiEditText.trim()) return;
    cancel();
    setIsRegenerating(true);
    setAiEditText("");
    setShowAiEdit(false);
    setTimeout(() => {
      setPages(mockOutlinePages().map((p, i) => ({
        ...p,
        content: i === 0
          ? { type: "text" as const, text: p.content.type === "text" ? p.content.text + "（已根据您的需求调整）" : p.content.text }
          : p.content,
      })));
      setIsRegenerating(false);
    }, 1500);
  };

  return (
    <SlidePanel visible={visible} onClose={onClose} mainOffset={mainOffset}>
      {/* header — matches Frame4 from design */}
      <div className="shrink-0 bg-[rgba(255,255,255,0.5)] px-[16px] pt-[16px] pb-[12px]">
        <div className="flex items-center justify-between w-full">
          <p className="text-[16px] font-medium leading-[24px] text-[rgba(0,0,0,0.88)] tracking-[0.016px]">PPT大纲</p>
          <CloseBtn onClick={onClose} />
        </div>
        <p className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.6)] tracking-[0.014px] mt-[2px] w-full">AI将依据此大纲生成PPT，请核对</p>
      </div>

      {/* body — scrollable page cards, matches Frame7 */}
      <div ref={scrollRef} onScroll={cancel} onClick={cancel} className="flex-1 overflow-y-auto min-h-0 px-[16px] py-[12px] flex flex-col gap-[12px]">
        {isRegenerating ? (
          <div className="flex items-center justify-center py-[40px] gap-[8px] text-[14px] text-[rgba(0,0,0,0.38)]">
            <span className="animate-spin w-[16px] h-[16px] border-2 border-[#1e63f5] border-t-transparent rounded-full inline-block" />
            AI 正在优化大纲…
          </div>
        ) : (
          pages.map(p => <OutlinePageCard
            key={p.id}
            page={p}
            presentation={presentations[p.id] ?? "smart"}
            onPresentationChange={mode => setPresentations(current => ({ ...current, [p.id]: mode }))}
          />)
        )}
      </div>

      {/* AI edit inline input (shown when AI编辑 clicked) */}
      {showAiEdit && (
        <div className="shrink-0 px-[16px] py-[10px] border-t border-[#f2f2f2] flex items-center gap-[8px] bg-[#fafafa]">
          <svg width="16" height="16" viewBox="0 0 14 14.6644" fill="none" className="shrink-0">
            <path d={svgOutline.p3fbfc4c0} fill="black" fillOpacity="0.6" />
          </svg>
          <input
            ref={aiInputRef}
            value={aiEditText}
            onChange={e => setAiEditText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleAiSubmit(); if (e.key === "Escape") setShowAiEdit(false); }}
            className="flex-1 text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] placeholder:text-[rgba(0,0,0,0.26)] outline-none bg-transparent"
            placeholder="描述你的修改需求，Enter 确认…"
          />
          <button onClick={() => setShowAiEdit(false)}
            className="text-[13px] text-[rgba(0,0,0,0.38)] px-[8px] py-[3px] cursor-pointer hover:text-[rgba(0,0,0,0.6)]">取消</button>
          <button onClick={handleAiSubmit} disabled={!aiEditText.trim()}
            className={`text-[13px] leading-[20px] px-[12px] py-[3px] rounded-[6px] transition-colors cursor-pointer ${aiEditText.trim() ? "bg-[#1e63f5] text-white" : "bg-[#f2f2f2] text-[rgba(0,0,0,0.26)]"}`}
          >生成</button>
        </div>
      )}

      {/* footer — matches Frame6: countdown | AI编辑 | 确认 */}
      <div className="shrink-0 bg-[rgba(255,255,255,0.5)] border-t border-[#f2f2f2]">
        <div className="flex items-center gap-[12px] px-[16px] py-[16px]">
          <p className="flex-1 text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px]">
            {!cancelled && <><span className="text-[#1e63f5] font-normal">{count}S</span><span className="text-[rgba(0,0,0,0.88)]"> 后自动确认</span></>}
          </p>
          {/* AI编辑 button */}
          <button onClick={handleAiEditClick}
            className="relative flex items-center gap-[8px] px-[16px] py-[5px] rounded-[8px] cursor-pointer hover:bg-[#f7f7f7] transition-colors">
            <div aria-hidden className="absolute inset-0 rounded-[8px] border border-[#e6e6e6] pointer-events-none" />
            <svg width="16" height="16" viewBox="0 0 14 14.6644" fill="none" className="shrink-0">
              <path d={svgOutline.p3fbfc4c0} fill="black" fillOpacity="0.88" />
            </svg>
            <span className="text-[14px] leading-[22px] font-normal text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">AI编辑</span>
          </button>
          {/* 确认 button */}
          <button onClick={handleConfirm}
            className="bg-[#1e63f5] text-[rgba(255,255,255,0.98)] text-[14px] font-normal leading-[22px]  tracking-[0.014px] px-[16px] py-[5px] rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity">
            确认
          </button>
        </div>
      </div>
    </SlidePanel>
  );
}

// ── PPT preview ───────────────────────────────────────────────────────────────

// ── sidebar ───────────────────────────────────────────────────────────────────

type HistoryItem = { id: number; title: string; pinned?: boolean; messages: Message[] };

function Sidebar({ history, setHistory, onClose, onNewChat, activeId, onSelect }: {
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  onClose: () => void;
  onNewChat: () => void;
  activeId: number | null;
  onSelect: (id: number) => void;
}) {
  const [hoverId, setHoverId] = useState<number | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [profileHovered, setProfileHovered] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuId(null);
      if (
        profileMenuOpen &&
        !profileMenuRef.current?.contains(e.target as Node) &&
        !profileTriggerRef.current?.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileMenuOpen]);

  return (
    <div className="shrink-0 w-[240px] self-stretch bg-white flex flex-col relative border-r border-[#f2f2f2]">
      {/* head */}
      <div className="shrink-0 h-[120px] relative bg-white">
        <p className="absolute left-[24px] top-[12px] text-[16px] font-medium leading-[24px] text-[rgba(0,0,0,0.88)] tracking-[0.016px] whitespace-nowrap">任务</p>
        {/* sidebar toggle (close) */}
        <button onClick={onClose} aria-label="收起侧边栏" className="absolute left-[196px] top-[8px] rounded-[4px] w-[32px] h-[32px] flex items-center justify-center hover:bg-[#f7f7f7] cursor-pointer">
          <span aria-hidden className="relative size-[20px] overflow-hidden">
            <svg className="absolute inset-[6.25%] size-[87.5%]" viewBox="0 0 17.5 17.5" fill="none" preserveAspectRatio="none">
              <path d={svgSidebar.p2861a580} fill="black" fillOpacity="0.6" />
            </svg>
          </span>
        </button>
        {/* 新任务 button */}
        <button onClick={onNewChat} className="absolute left-1/2 top-[48px] -translate-x-1/2 w-[216px] rounded-[4px] flex items-center justify-center gap-[8px] px-[16px] py-[5px] cursor-pointer hover:bg-[#f7f7f7] transition-colors">
          <div aria-hidden className="absolute inset-0 rounded-[4px] border border-[#e6e6e6] pointer-events-none bg-[#00000000]" />
          <svg width="16" height="15" viewBox="0 0 14.6667 15" fill="none" className="shrink-0">
            <path d={svgSidebar.p2e5a6e00} fill="black" fillOpacity="0.88" />
          </svg>
          <span className="text-[14px] font-normal leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">新任务</span>
        </button>
        {/* 历史记录 label + search */}
        <p className="absolute left-[24px] top-[89px] text-[14px] leading-[22px] text-[rgba(0,0,0,0.38)] tracking-[0.014px] whitespace-nowrap">历史记录</p>
        <button className="absolute left-[200px] top-[88px] w-[24px] h-[24px] flex items-center justify-center rounded-[4px] hover:bg-[#f7f7f7] cursor-pointer">
          <svg width="14" height="14" viewBox="0 0 13.5427 13.5427" fill="none">
            <path d={svgSidebar.p21ae8c80} fill="black" fillOpacity="0.38" />
          </svg>
        </button>
      </div>

      {/* history list */}
      <div className="flex-1 overflow-y-auto min-h-0 px-[12px] py-[4px] flex flex-col gap-[2px]">
        {history.length === 0 ? (
          <div className="flex flex-col items-center pt-[12px]">
            <img src={imgEmpty} alt="" className="w-[120px] h-[120px] object-cover" />
            <p className="text-[14px] font-medium leading-[22px] text-[rgba(0,0,0,0.38)] mt-[12px]">暂无历史对话</p>
            <p className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.38)]">快去输入问题发起新的咨询</p>
          </div>
        ) : (
          history.map(item => {
            const isActive = activeId === item.id;
            const isHover = hoverId === item.id;
            const hasMenu = menuId === item.id;
            return (
              <div key={item.id} className="relative">
                <div
                  role="button"
                  tabIndex={0}
                  onMouseEnter={() => setHoverId(item.id)}
                  onMouseLeave={() => { if (menuId !== item.id) setHoverId(null); }}
                  onClick={() => { onSelect(item.id); setMenuId(null); }}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { onSelect(item.id); setMenuId(null); } }}
                  className={`w-full h-[40px] rounded-[4px] flex items-center pl-[12px] pr-[4px] py-[8px] text-left transition-colors cursor-pointer
                    ${isActive ? "bg-[#f7f7f7]" : isHover ? "bg-[#f2f2f2]" : ""}`}
                >
                  <p className={`flex-1 min-w-0 text-[14px] leading-[22px] tracking-[0.014px] truncate ${isActive ? "font-medium" : ""} text-[rgba(0,0,0,0.88)]`}>{item.title}</p>
                  {item.pinned && !isHover && !hasMenu && (
                    <div className="shrink-0 w-[24px] h-[24px] flex items-center justify-center">
                      <svg width="12" height="13" viewBox="0 0 12 12.6667" fill="none">
                        <path d={svgSidebar.p3170f400} fill="black" fillOpacity="0.26" />
                        <path d="M0 0H12V1.33333H0V0Z" fill="black" fillOpacity="0.26" />
                      </svg>
                    </div>
                  )}
                  {(isHover || hasMenu) && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (hasMenu) { setMenuId(null); return; }
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        setMenuPos({ x: rect.right + 4, y: rect.top });
                        setMenuId(item.id);
                        setHoverId(item.id);
                      }}
                      className="shrink-0 w-[24px] h-[24px] flex items-center justify-center rounded-[4px] hover:bg-[rgba(0,0,0,0.06)] cursor-pointer"
                    >
                      <svg width="3" height="12" viewBox="0 0 2.66667 12" fill="none">
                        <path d={svgSidebar.p19c91c80} fill="black" fillOpacity="0.38" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* context menu — fixed to escape overflow clip */}
      {menuId !== null && (
        <div ref={menuRef} className="fixed z-[200] bg-white rounded-[12px] w-[192px]"
          style={{ left: menuPos.x, top: menuPos.y, boxShadow: "0 0 12px rgba(0,0,0,0.08)", border: "1px solid #f2f2f2" }}>
          <div className="px-[8px] py-[4px] flex flex-col">
            {[
              { label: "置顶此对话", icon: svgSidebar.p3170f400, isPin: true, action: () => { setHistory(h => h.map(i => i.id === menuId ? { ...i, pinned: !i.pinned } : i)); setMenuId(null); } },
              { label: "编辑名称",   icon: svgSidebar.p20221d00, isPin: false, action: () => setMenuId(null) },
              { label: "删除",       icon: svgSidebar.p2ffde100, isPin: false, action: () => { setHistory(h => h.filter(i => i.id !== menuId)); setMenuId(null); } },
            ].map(({ label, icon, isPin, action }) => (
              <button key={label} onClick={action}
                className="flex items-center gap-[8px] px-[8px] py-[11px] rounded-[8px] hover:bg-[#f7f7f7] cursor-pointer w-full text-left">
                {isPin ? (
                  <svg width="16" height="16" viewBox="0 0 12 12.6667" fill="none" className="shrink-0">
                    <path d={icon} fill="black" fillOpacity="0.26" />
                    <path d="M0 0H12V1.33333H0V0Z" fill="black" fillOpacity="0.26" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 13.3333 13.3333" fill="none" className="shrink-0">
                    <path d={icon} fill="black" fillOpacity="0.26" />
                  </svg>
                )}
                <span className="text-[14px] font-normal leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {profileMenuOpen && (
        <div
          ref={profileMenuRef}
          role="menu"
          aria-label="用户菜单"
          className="absolute bottom-[48px] left-[24px] z-[200] w-[192px] overflow-hidden rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]"
        >
          <div className="flex w-full flex-col py-[4px]">
            <button
              type="button"
              role="menuitem"
              onClick={() => setProfileMenuOpen(false)}
              className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left hover:bg-[#f7f7f7]"
            >
              <img src="/assets/d0cd0.svg" alt="" className="shrink-0" />
              <span className="flex-1 whitespace-nowrap font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">
                剩余用量
              </span>
              <span className="font-['TCloudNumber:Regular'] text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)]">90%</span>
              <img src="/assets/c29c9.svg" alt="" className="shrink-0" />
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => setProfileMenuOpen(false)}
              className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left hover:bg-[#f7f7f7]"
            >
              <img src="/assets/7ba18.svg" alt="" className="shrink-0" />
              <span className="whitespace-nowrap font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">记忆</span>
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => setProfileMenuOpen(false)}
              className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left hover:bg-[#f7f7f7]"
            >
              <img src="/assets/89936.svg" alt="" className="shrink-0" />
              <span className="whitespace-nowrap font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">问题反馈</span>
            </button>
            <div className="relative h-px w-full">
              <img src="/assets/11020.svg" alt="" className="absolute left-[-1px] top-0" />
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => setProfileMenuOpen(false)}
              className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left hover:bg-[#f7f7f7]"
            >
              <img src="/assets/9a53a.svg" alt="" className="shrink-0" />
              <span className="whitespace-nowrap font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">退出登录</span>
            </button>
          </div>
        </div>
      )}

      {/* bottom — user info */}
      <div className="shrink-0 flex items-center px-[12px] py-[8px] bg-white">
        <button
          ref={profileTriggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={profileMenuOpen}
          onMouseEnter={() => setProfileHovered(true)}
          onMouseLeave={() => setProfileHovered(false)}
          onClick={() => {
            setMenuId(null);
            setProfileMenuOpen(open => !open);
          }}
          className="flex h-[32px] flex-1 min-w-0 cursor-pointer items-center gap-[8px] rounded-[8px] px-[12px] py-[4px] text-left"
        >
          <div className="relative shrink-0 w-[24px] h-[24px] rounded-full bg-[#dcdcdc] border border-white overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/assets/a2c1b.svg" alt="" />
            </div>
          </div>
          <span className="min-w-0 w-fit grow-0 basis-auto truncate whitespace-nowrap font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">张三李四王麻子</span>
          {(profileHovered || profileMenuOpen) && (
            <img src="/assets/05ead.svg" alt="" className="shrink-0" />
          )}
        </button>
      </div>
    </div>
  );
}

// ── chat input ────────────────────────────────────────────────────────────────

function PptGenerationToggle({ selected, onChange }: { selected: boolean; onChange: (selected: boolean) => void }) {
  const [hovered, setHovered] = useState(false);
  const showClose = selected && hovered;

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={selected ? "取消 PPT 生成" : "启用 PPT 生成"}
      onClick={() => onChange(!selected)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`shrink-0 box-border flex items-center gap-[4px] rounded-full border px-[8px] py-[4px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1e63f5] focus-visible:ring-offset-2 ${
        selected
          ? "border-transparent bg-[#ebf4ff] text-[#1e63f5]"
          : "border-[#f2f2f2] text-[rgba(0,0,0,0.88)] hover:bg-[#f2f2f2]"
      }`}
    >
      <span className="relative size-[16px] shrink-0 overflow-hidden" aria-hidden>
        {showClose ? (
          <svg className="absolute inset-[8.33%]" fill="none" viewBox="0 0 13.3333 13.3333" preserveAspectRatio="none">
            <path d={svgPptToggle.p2186600} fill="#1E63F5" />
          </svg>
        ) : (
          <svg className="absolute left-[2px] top-[1px] h-[13.333px] w-[12px]" fill="none" viewBox="0 0 12 13.3333" preserveAspectRatio="none">
            <path d={svgPaths.p10161080} fill={selected ? "#1E63F5" : "black"} fillOpacity={selected ? "1" : "0.88"} />
          </svg>
        )}
      </span>
      <span className="whitespace-nowrap text-[14px] leading-[22px] tracking-[0.014px] font-normal">PPT生成</span>
    </button>
  );
}

type SendButtonState = "Default" | "激活" | "暂停" | "激活_hover" | "激活_pressed" | "暂停_Hover" | "暂停_pressed" | "loading";

function SendButton({ hasText, agentRunning = false, onSend, onStop }: {
  hasText: boolean;
  agentRunning?: boolean;
  onSend: () => void;
  onStop?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agentRunning) setLoading(false);
  }, [agentRunning]);

  const state: SendButtonState = loading
    ? "loading"
    : agentRunning
      ? (pressed ? "暂停_pressed" : hovered ? "暂停_Hover" : "暂停")
      : hasText
        ? (pressed ? "激活_pressed" : hovered ? "激活_hover" : "激活")
        : "Default";

  const handleClick = () => {
    if (agentRunning) {
      onStop?.();
      return;
    }
    if (!hasText || loading) return;
    setLoading(true);
    onSend();
    window.setTimeout(() => setLoading(false), 560);
  };

  return (
    <div
      role="button"
      tabIndex={agentRunning || hasText ? 0 : -1}
      aria-label={agentRunning ? "暂停生成" : "发送消息"}
      aria-disabled={!agentRunning && !hasText}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onPointerDown={() => { if (agentRunning || hasText) setPressed(true); }}
      onPointerUp={() => setPressed(false)}
      onClick={handleClick}
      onKeyDown={event => {
        if ((event.key === "Enter" || event.key === " ") && (agentRunning || hasText)) {
          event.preventDefault();
          handleClick();
        }
      }}
      className={`ml-auto shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#1e63f5] focus-visible:ring-offset-2 ${agentRunning || hasText ? "cursor-pointer" : "cursor-default"}`}
    >
      <SendButtonFigma propValue={state} />
    </div>
  );
}

function ChatInput({ value, onChange, onSend, pptGeneration, onPptGenerationChange, agentRunning = false, onStop }: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  pptGeneration: boolean;
  onPptGenerationChange: (selected: boolean) => void;
  agentRunning?: boolean;
  onStop?: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasText = value.trim().length > 0;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (hasText) onSend(); }
  };

  return (
    <div className="relative w-full max-h-[328px] rounded-[20px] bg-white" style={{ boxShadow: "0 0 12px rgba(0,0,0,0.08)", border: "1px solid #e6e6e6" }}>
      <div className="px-[12px] pt-[12px] pb-[12px]" onPointerDown={() => textareaRef.current?.focus()}>
        <textarea ref={textareaRef} value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKeyDown}
          placeholder="有问题，尽管问；/调用技能" rows={1} style={{ minHeight: 22, maxHeight: 228 }}
          className="relative z-10 block w-full resize-none bg-transparent text-[14px] font-normal leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] placeholder:text-[rgba(0,0,0,0.26)] outline-none overflow-y-auto"
        />
        <div className="h-[36px]" />
      </div>
      <div className="px-[8px] pb-[8px] flex items-center gap-[8px]">
        <button className="shrink-0 w-[30px] h-[30px] rounded-full border border-[#f2f2f2] flex items-center justify-center hover:bg-[#f7f7f7]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d={svgPaths.p4063380} fill="black" fillOpacity="0.88" /></svg>
        </button>
        <div className="shrink-0 flex items-center gap-[4px] px-[8px] py-[4px] rounded-full border border-[#f2f2f2]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 translate-y-[1px]">
            <path d={svgPaths.p3302ed00} fill="black" fillOpacity="0.88" />
            <path d={svgPaths.p1868fc80} fill="black" fillOpacity="0.88" />
            <path d={svgPaths.p3aa3c200} fill="black" fillOpacity="0.88" />
          </svg>
          <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] whitespace-nowrap">来源</span>
        </div>
        <PptGenerationToggle selected={pptGeneration} onChange={onPptGenerationChange} />
        <SendButton hasText={hasText} agentRunning={agentRunning} onSend={onSend} onStop={onStop} />
      </div>
    </div>
  );
}

// ── header ────────────────────────────────────────────────────────────────────

function ChatHeader({ title, sidebarOpen, onSidebarToggle, onNewChat }: { title?: string; sidebarOpen?: boolean; onSidebarToggle?: () => void; onNewChat?: () => void }) {
  return (
    <div className="relative shrink-0 w-full h-[48px] min-h-[48px] bg-white flex items-center gap-[8px] px-[16px] z-30">
      {!sidebarOpen && (
        <>
          <button className="relative z-10 shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f7f7f7] cursor-pointer" onClick={onSidebarToggle} aria-label="展开侧边栏">
            <span aria-hidden className="relative size-[20px] overflow-hidden">
              <svg className="absolute inset-[6.25%] size-[87.5%]" viewBox="0 0 17.5 17.5" fill="none" preserveAspectRatio="none">
                <path d={svgPaths.p2861a580} fill="black" fillOpacity="0.6" />
              </svg>
            </span>
          </button>
          <button className="relative z-10 shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f7f7f7] cursor-pointer" onClick={onNewChat} aria-label="新建对话">
            <span aria-hidden className="relative size-[20px] overflow-hidden">
              <svg className="absolute left-[8.33%] top-0 h-[93.75%] w-[91.67%]" viewBox="0 0 18.3333 18.75" fill="none" preserveAspectRatio="none">
                <path d={svgPaths.pad1cb00} fill="black" fillOpacity="0.6" />
              </svg>
            </span>
          </button>
        </>
      )}
      {title && <p className="absolute left-0 right-0 text-center text-[14px] font-medium leading-[22px] text-[rgba(0,0,0,0.88)] truncate px-[80px] pointer-events-none">{title}</p>}
      <div className="flex-1" />
    </div>
  );
}

// ── views ─────────────────────────────────────────────────────────────────────

const SUGGESTIONS = ["找出近一周的邮件", "请帮我起草一封给团队的邮件", "总结下智能助手项目邮件"];

function HomeView({ input, onInputChange, onSend, pptGeneration, onPptGenerationChange }: {
  input: string; onInputChange: (v: string) => void; onSend: (text?: string) => void;
  pptGeneration: boolean; onPptGenerationChange: (selected: boolean) => void;
}) {
  return (
    <div className="flex-1 min-h-0 bg-white flex flex-col overflow-hidden">
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      <div className="relative flex-1 min-h-0 px-[24px] max-[560px]:px-0">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-[756px] h-[400px] rounded bg-gradient-to-r from-[#a3ffff] to-[#1e63f5] opacity-10 blur-[100px]" />
        </div>
        <div className="relative mx-auto flex h-full w-full max-w-[800px] flex-col items-center pt-[160px]">
          <div className="shrink-0 flex items-baseline gap-[8px] py-[32px]">
            <span className="text-[46px] font-medium leading-[56px] text-[rgba(0,0,0,0.88)] tracking-[0.046px]">Hi，xxxx</span>
            <span className="w-[16px] h-[4px] bg-[rgba(0,0,0,0.88)] self-end mb-[10px]" style={{ animation: "blink 1s step-end infinite" }} />
          </div>
          <div className="flex-1 flex flex-col items-center w-full">
            <div className="shrink-0 flex items-center gap-[8px] pt-[32px] pb-[20px]">
              <svg width="80" height="1" viewBox="0 0 80 1" fill="none"><path d="M0 0.5H80" stroke="url(#gl)" /><defs><linearGradient id="gl" x1="0" y1="1" x2="80" y2="1" gradientUnits="userSpaceOnUse"><stop stopOpacity="0" /><stop offset="1" stopOpacity="0.3" /></linearGradient></defs></svg>
              <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.38)] whitespace-nowrap">试试这些</span>
              <svg width="80" height="1" viewBox="0 0 80 1" fill="none"><path d="M0 0.5H80" stroke="url(#gr)" /><defs><linearGradient id="gr" x1="0" y1="1" x2="80" y2="1" gradientUnits="userSpaceOnUse"><stop stopOpacity="0.3" /><stop offset="1" stopOpacity="0" /></linearGradient></defs></svg>
            </div>
            <div className="shrink-0 flex flex-wrap items-center justify-center gap-[12px]">
              {SUGGESTIONS.map((s, i) => (
                <button key={s} onClick={() => onSend(s)} className="flex items-center gap-[10px] px-[8px] py-[8px] bg-[#f7f7f7] hover:bg-[#f2f2f2] rounded-[8px] transition-colors cursor-pointer">
                  <AIIcon uid={`s${i}`} />
                  <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] whitespace-nowrap font-normal">{s}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="shrink-0 w-full"><ChatInput value={input} onChange={onInputChange} onSend={onSend} pptGeneration={pptGeneration} onPptGenerationChange={onPptGenerationChange} /></div>
        </div>
      </div>
      <div className="shrink-0 flex items-center justify-center p-[4px]">
        <span className="text-[10px] text-[rgba(0,0,0,0.26)]">内容由AI生成，仅供参考</span>
      </div>
    </div>
  );
}

function ChatMessageRow({ msg, index, advance, onOpenPpt, onRegeneratePpt }: {
  msg: Message; index: number; advance: (i: number) => void;
  onOpenPpt?: () => void; onRegeneratePpt?: () => void;
}) {
  // messages without a running typewriter advance the reveal pointer on mount;
  // process messages advance via onGoalDone once their goal finishes typing
  const autoAdvance = msg.role === "user" || msg.role === "result" || (msg.role === "ai" && Boolean(msg.thinking));
  useEffect(() => { if (autoAdvance) advance(index); }, [autoAdvance, advance, index]);

  if (msg.role === "user") return (
    <div className="flex justify-end">
      <div className="max-w-[85%] bg-[#f7f7f7] px-[12px] py-[8px] rounded-tl-[8px] rounded-br-[8px] rounded-bl-[8px]">
        <p className="text-[16px] leading-[26px] text-[rgba(0,0,0,0.88)] whitespace-pre-wrap break-words">{msg.text}</p>
      </div>
    </div>
  );
  if (msg.role === "process") return (
    <div className="w-full max-w-[768px]"><ExecutionProcess running={Boolean(msg.thinking)} variant={msg.variant ?? "requirement"} preset={msg.preset} onGoalDone={() => advance(index)} /></div>
  );
  if (msg.role === "result") return (
    <div className="w-full max-w-[768px]"><PptResultMessage onOpen={() => onOpenPpt?.()} onRegenerate={onRegeneratePpt} /></div>
  );
  return (
    <div className="w-full max-w-[768px]">
      {msg.thinking ? (
        <div className="flex items-center gap-[6px] py-[4px]">
          {[0, 200, 400].map(d => <span key={d} className="w-[6px] h-[6px] rounded-full bg-[rgba(0,0,0,0.26)] inline-block" style={{ animation: `blink 1s ${d}ms step-end infinite` }} />)}
        </div>
      ) : (
        <p className="text-[16px] leading-[26px] text-[rgba(0,0,0,0.88)] whitespace-pre-wrap"><Typewriter text={msg.text ?? ""} onDone={() => advance(index)} /></p>
      )}
    </div>
  );
}

function ChatView({ conversationId, messages, input, onInputChange, onSend, showInput = true, onOpenPpt, onRegeneratePpt, pptGeneration, onPptGenerationChange, agentRunning, onStop }: {
  conversationId: number | null;
  messages: Message[]; input: string; onInputChange: (v: string) => void; onSend: () => void; showInput?: boolean;
  onOpenPpt?: () => void; onRegeneratePpt?: () => void;
  pptGeneration: boolean; onPptGenerationChange: (selected: boolean) => void;
  agentRunning: boolean; onStop: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  // reveal messages one at a time: the next message renders only after the
  // current one has finished its typewriter / entrance
  const [revealed, setRevealed] = useState(0);
  const advance = useCallback((i: number) => setRevealed(r => Math.max(r, i + 1)), []);
  // switching conversations shows history in full without replaying typewriters
  const msgCount = messages.length;
  useEffect(() => { setRevealed(msgCount); }, [conversationId]); // eslint-disable-line react-hooks/exhaustive-deps

  // once the whole task finishes, the three stage blocks merge into one collapsed
  // "任务已完成" rendered at the position of the first process message
  const processIndices = messages.map((m, i) => (m.role === "process" ? i : -1)).filter(i => i >= 0);
  const firstProcessIndex = processIndices[0];
  const processPresets = processIndices.map(i => messages[i].preset ?? PROCESS_PRESETS[messages[i].variant ?? "requirement"]);
  const taskComplete = messages.some(m => m.role === "result") && !messages.some(m => m.role === "process" && m.thinking);
  return (
    <div className="flex-1 min-h-0 bg-white flex flex-col">
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto">
        <div className="min-h-full px-[24px] pt-[16px] max-[560px]:px-0">
          <div className="mx-auto w-full max-w-[800px]">
            <div className="flex flex-col gap-[32px] p-[16px]">
              {messages.map((msg, i) => {
                if (i > revealed) return null;
                if (msg.role === "process" && taskComplete) {
                  return i === firstProcessIndex ? <MergedProcess key={i} presets={processPresets} /> : null;
                }
                return <ChatMessageRow key={i} msg={msg} index={i} advance={advance} onOpenPpt={onOpenPpt} onRegeneratePpt={onRegeneratePpt} />;
              })}
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden={!showInput} className={`shrink-0 px-[24px] max-[560px]:px-0 transition-opacity duration-200 ${showInput ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="mx-auto w-full max-w-[800px]">
          <ChatInput value={input} onChange={onInputChange} onSend={onSend} pptGeneration={pptGeneration} onPptGenerationChange={onPptGenerationChange} agentRunning={agentRunning} onStop={onStop} />
        </div>
      </div>
      <div className="shrink-0 flex items-center justify-center p-[4px]">
        <span className="text-[10px] text-[rgba(0,0,0,0.26)]">内容由AI生成，仅供参考</span>
      </div>
    </div>
  );
}

// ── root ──────────────────────────────────────────────────────────────────────

type ToolKind = "search" | "read" | "extract" | "analyze" | "generate" | "check" | "summarize" | "execute" | "fail" | "chevron";
function TaskIcon({ type, expanded = false }: { type: ToolKind; expanded?: boolean }) {
  const wrap = (content: React.ReactNode) => <span className="relative size-[16px] shrink-0 overflow-hidden">{content}</span>;
  if (type === "search") return wrap(<svg className="absolute inset-[4.16%_7.02%_7.02%_8.33%]" viewBox="0 0 13.543 14.2102" fill="none" preserveAspectRatio="none"><path d={svgProgress.p3b5d3c00} fill="black" fillOpacity="0.38"/><path d={svgProgress.p313b1700} fill="black" fillOpacity="0.38"/></svg>);
  if (type === "read") return wrap(<svg className="absolute left-[1.33px] top-[1.33px] size-[13.333px]" viewBox="0 0 13.3333 13.3333" fill="none" preserveAspectRatio="none"><path d={svgProgress.p27585af0} fill="black" fillOpacity="0.38"/><path d={svgProgress.p10b3d540} fill="black" fillOpacity="0.38"/><path d={svgProgress.p376ce200} fill="black" fillOpacity="0.38"/></svg>);
  if (type === "extract") return wrap(<><svg className="absolute inset-[8.33%_16.67%_12.5%_8.33%]" viewBox="0 0 12 12.667" fill="none" preserveAspectRatio="none"><path d={svgProgress.p31938000} fill="black" fillOpacity="0.38"/></svg><svg className="absolute inset-[63.33%_12.5%_9.17%_58.33%]" viewBox="0 0 4.66667 4.39974" fill="none" preserveAspectRatio="none"><path d={svgProgress.p1528fd00} fill="black" fillOpacity="0.38"/></svg></>);
  if (type === "analyze") return wrap(<svg className="absolute inset-[12.5%_8.33%_8.33%]" viewBox="0 0 13.3334 12.6667" fill="none" preserveAspectRatio="none"><path d={svgProgress.p39797f00} fill="black" fillOpacity="0.38"/><path d={svgProgress.p3d6ffbf0} fill="black" fillOpacity="0.38"/></svg>);
  if (type === "generate") return wrap(<svg className="absolute inset-[8.33%_12.5%]" viewBox="0 0 12 13.3333" fill="none" preserveAspectRatio="none"><path d={svgProgress.p21d54700} fill="black" fillOpacity="0.38"/></svg>);
  if (type === "check") return wrap(<svg className="absolute left-[1.67px] top-px h-[14.243px] w-[12.667px]" viewBox="0 0 12.6667 14.2427" fill="none" preserveAspectRatio="none">{[svgProgress.p2e680a00,svgProgress.pce82500,svgProgress.p2a4faf00,svgProgress.p2dfb8000,svgProgress.p375f7200,svgProgress.p14ac9ef0].map((d,i)=><path key={i} d={d} fill="black" fillOpacity="0.38"/>)}</svg>);
  if (type === "summarize") return wrap(<svg className="absolute left-0 top-1/2 h-[11.314px] w-[15.98px] -translate-y-1/2" viewBox="0 0 15.9804 11.3137" fill="none" preserveAspectRatio="none"><path d={svgProgress.p1305b900} fill="black" fillOpacity="0.38"/><path d={svgProgress.p3d125080} fill="black" fillOpacity="0.38"/><path d={svgProgress.p3fde1480} fill="black" fillOpacity="0.38"/></svg>);
  if (type === "execute") return wrap(<svg className="absolute inset-[12.5%_9.65%_4.14%_4.17%]" viewBox="0 0 13.7892 13.3381" fill="none" preserveAspectRatio="none"><path d={svgProgress.p2a822e00} fill="black" fillOpacity="0.38"/></svg>);
  if (type === "fail") return wrap(<svg className="absolute inset-[17.59%]" viewBox="0 0 10.371 10.371" fill="none" preserveAspectRatio="none"><path d={svgProgress.p16dcd200} fill="#FC5926"/></svg>);
  return expanded ? <span className="relative block h-[22px] w-[16px] shrink-0"><svg className="absolute inset-[33.8%_23.48%_33.79%_23.48%]" viewBox="0 0 8.48533 5.18533" fill="none" preserveAspectRatio="none"><path d={svgProgress.p33898580} fill="black" fillOpacity="0.38"/></svg></span> : <span className="relative block h-[22px] w-[16px] shrink-0"><svg className="absolute inset-[23.48%_33.8%_23.48%_33.79%]" viewBox="0 0 5.18533 8.48533" fill="none" preserveAspectRatio="none"><path d={svgProgress.p13a1fe00} fill="black" fillOpacity="0.38"/></svg></span>;
}

function ToolLoading({ text }: { text: string }) {
  return <span className="tool-loading inline-block text-[14px] leading-[22px]">
    <style>{`
      .tool-loading{
        color: transparent;
        background-image:
          radial-gradient(closest-side circle at 50% 50%, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.88) 45%, rgba(0,0,0,0.28) 100%),
          linear-gradient(rgba(0,0,0,0.28), rgba(0,0,0,0.28));
        background-size: 64px 100%, 100% 100%;
        background-repeat: no-repeat, no-repeat;
        background-position: -64px 0, 0 0;
        -webkit-background-clip: text;
        background-clip: text;
        animation: toolScan 1.8s linear infinite;
      }
      @keyframes toolScan{
        from{ background-position: -64px 0, 0 0; }
        to{ background-position: calc(100% + 64px) 0, 0 0; }
      }
    `}</style>
    {text}
  </span>;
}

function Typewriter({ text, speed = 30, className, onDone }: { text: string; speed?: number; className?: string; onDone?: () => void }) {
  const [count, setCount] = useState(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  useEffect(() => {
    setCount(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) {
        window.clearInterval(id);
        onDoneRef.current?.();
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);
  return <span className={className}>{text.slice(0, count)}</span>;
}

const PROCESS_PRESETS: Record<ProcessVariant, { goal: string; running: string; actions: { label: string; icon: ToolKind }[] }> = {
  requirement: {
    goal: "任务目标：生成符合演示场景、受众与风格要求的 PPT",
    running: "检索资料并梳理制作需求",
    actions: [
      { label: "搜索；检索演示主题相关资料", icon: "search" },
      { label: "读取；加载关键信息", icon: "read" },
      { label: "提取；归纳关键内容", icon: "extract" },
      { label: "分析；提炼内容结构", icon: "analyze" },
      { label: "生成；创建 PPT 制作方案", icon: "generate" },
      { label: "校验；检查内容一致性", icon: "check" },
      { label: "汇总；输出需求确认结果", icon: "summarize" },
    ],
  },
  outline: {
    goal: "任务目标：依据已确认的需求，生成完整的 PPT 大纲",
    running: "拆解需求并编排大纲结构",
    actions: [
      { label: "读取；载入已确认的需求", icon: "read" },
      { label: "搜索；补充章节所需素材", icon: "search" },
      { label: "分析；拆解叙事逻辑与层级", icon: "analyze" },
      { label: "提取；筛选每页核心论点", icon: "extract" },
      { label: "生成；编排页面顺序与标题", icon: "generate" },
      { label: "校验；检查大纲完整性", icon: "check" },
      { label: "汇总；输出大纲确认结果", icon: "summarize" },
    ],
  },
  ppt: {
    goal: "任务目标：依据已确认的大纲，生成可预览的 PPT",
    running: "撰写内容并渲染 PPT 页面",
    actions: [
      { label: "读取；载入已确认的大纲", icon: "read" },
      { label: "生成；撰写每页正文内容", icon: "generate" },
      { label: "分析；匹配版式与配图方案", icon: "analyze" },
      { label: "执行；渲染页面与图表", icon: "execute" },
      { label: "校验；检查排版与一致性", icon: "check" },
      { label: "汇总；输出可预览文件", icon: "summarize" },
    ],
  },
};

function ExecutionProcess({ running, variant = "requirement", preset: customPreset, onGoalDone }: { running: boolean; variant?: ProcessVariant; preset?: ProcessPreset; onGoalDone?: () => void }) {
  const preset = customPreset ?? PROCESS_PRESETS[variant];
  const actions = preset.actions;
  const total = actions.length;
  const [expanded, setExpanded] = useState(false);
  const [visibleActions, setVisibleActions] = useState(0);
  // index of the first item in the batch that is currently executing
  const [batchStart, setBatchStart] = useState(0);
  // becomes true once the goal typewriter has finished for the active run
  const [goalTyped, setGoalTyped] = useState(false);
  const stepEndRef = useRef<HTMLDivElement>(null);

  // reset / finalize state whenever the running flag flips
  useEffect(() => {
    if (!running) {
      // execution finished — collapse and show the full step list on demand
      setExpanded(false);
      setVisibleActions(total);
      setBatchStart(total);
      setGoalTyped(false);
      return;
    }
    setExpanded(false);
    setVisibleActions(0);
    setBatchStart(0);
    setGoalTyped(false);
  }, [running, total]);

  // reveal the tools only after the goal typewriter has actually finished
  useEffect(() => {
    if (!running || !goalTyped) return;
    setExpanded(true);
    let shown = 0;
    let revealTimer: number | undefined;
    const revealBatch = () => {
      const batchSize = Math.random() > 0.58 ? 2 : 1;
      const start = shown;
      shown = Math.min(total, shown + batchSize);
      setBatchStart(start);
      setVisibleActions(shown);
      if (shown < total) revealTimer = window.setTimeout(revealBatch, 2000 + Math.floor(Math.random() * 3001));
    };
    revealTimer = window.setTimeout(revealBatch, 320);
    return () => { if (revealTimer) window.clearTimeout(revealTimer); };
  }, [running, goalTyped, total]);

  // keep the newest step in view while the agent is running
  useEffect(() => {
    if (running && visibleActions > 0) {
      stepEndRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [visibleActions, running]);

  if (!running) return (
    <div className="w-full max-w-[768px] flex flex-col gap-[12px]">
      <button onClick={() => setExpanded(v => !v)} className="flex items-center gap-[8px] text-left">
        <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.38)] tracking-[0.014px] whitespace-nowrap font-normal">{preset.running}</span>
        <TaskIcon type="chevron" expanded={expanded} />
      </button>
      {expanded && <div className="flex flex-col gap-[12px]">
        <p className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px]">{preset.goal}</p>
        {actions.map(({ label, icon }) => <div key={label} className="flex items-center gap-[8px] text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px]"><TaskIcon type={icon} /><span>{label}</span></div>)}
      </div>}
    </div>
  );
  return (
    <div className="w-full max-w-[768px] flex flex-col gap-[12px]">
      <p className="text-[14px] leading-[22px] font-normal text-[rgba(0,0,0,0.88)] tracking-[0.014px]"><Typewriter text={preset.goal} onDone={() => { setGoalTyped(true); onGoalDone?.(); }} /></p>
      {goalTyped && (<>
        <button onClick={() => setExpanded(v => !v)} className="flex items-center gap-[8px] text-left">
          <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.38)] tracking-[0.014px] whitespace-nowrap font-normal">{preset.running}</span>
          <TaskIcon type="chevron" expanded={expanded} />
        </button>
        {expanded && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.2, ease: "easeOut" }} className="flex flex-col gap-[12px] overflow-hidden">
          {actions.slice(0, visibleActions).map(({ label, icon }, index) => <motion.div key={label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, ease: "easeOut" }} className="flex items-center gap-[8px] text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px]">
            <TaskIcon type={icon} />
            {index >= batchStart ? <ToolLoading text={`正在${label.split("；")[0]}相关信息`} /> : <span>{label}</span>}
          </motion.div>)}
          <div ref={stepEndRef} aria-hidden className="h-px w-full shrink-0" />
        </motion.div>}
      </>)}
    </div>
  );
}

// once the whole task is done, all stages collapse into a single "任务已完成"
function MergedProcess({ presets }: { presets: ProcessPreset[] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="w-full max-w-[768px] flex flex-col gap-[12px]">
      <button onClick={() => setExpanded(v => !v)} className="flex items-center gap-[8px] text-left">
        <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.38)] tracking-[0.014px] whitespace-nowrap font-normal">任务已完成</span>
        <TaskIcon type="chevron" expanded={expanded} />
      </button>
      {expanded && <div className="flex flex-col gap-[20px]">
        {presets.map((preset, vi) => {
          return (
            <div key={vi} className="flex flex-col gap-[12px]">
              <p className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.38)] tracking-[0.014px] font-normal">{preset.running}</p>
              <p className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px]">{preset.goal}</p>
              {preset.actions.map(({ label, icon }) => <div key={label} className="flex items-center gap-[8px] text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px]"><TaskIcon type={icon} /><span>{label}</span></div>)}
            </div>
          );
        })}
      </div>}
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pptGeneration, setPptGeneration] = useState(false);
  const [stage, setStage] = useState<PptStage>("idle");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const nextHistoryId = useRef(1);
  const activeRunId = useRef(0);

  const resetPptFlow = useCallback(() => setStage("idle"), []);

  // keep the active conversation's transcript in sync with the history list
  useEffect(() => {
    if (activeHistoryId === null) return;
    setHistory(h => h.map(i => (i.id === activeHistoryId ? { ...i, messages } : i)));
  }, [messages, activeHistoryId]);

  // deleting the open conversation returns to the home view
  useEffect(() => {
    if (activeHistoryId !== null && !history.some(i => i.id === activeHistoryId)) {
      setActiveHistoryId(null);
      setMessages([]);
      setStage("idle");
    }
  }, [history, activeHistoryId]);

  const handleSelectHistory = (id: number) => {
    const item = history.find(i => i.id === id);
    if (!item) return;
    setStage("idle");
    setInput("");
    setActiveHistoryId(id);
    setMessages(item.messages);
  };

  const handleSend = (suggestion?: string) => {
    const text = (suggestion ?? input).trim();
    if (!text) return;
    const shouldGeneratePpt = pptGeneration || isPPTIntent(text);
    const runId = ++activeRunId.current;
    setInput("");
    setPptGeneration(false);
    // create a history entry when starting a brand-new conversation
    if (activeHistoryId === null) {
      const id = nextHistoryId.current++;
      setHistory(h => [{ id, title: text.slice(0, 20), messages: [] }, ...h]);
      setActiveHistoryId(id);
    }
    const initialProcess: Message = shouldGeneratePpt
      ? { role: "process", text: "", thinking: true, variant: "requirement" }
      : { role: "process", text: "", thinking: true, variant: "requirement", preset: buildQueryProcess(text) };
    setMessages(prev => [...prev, { role: "user", text }, initialProcess]);

    // AI returns summary first
    setTimeout(() => {
      if (activeRunId.current !== runId) return;
      if (shouldGeneratePpt) {
        setMessages(prev => {
          const next = [...prev];
          const idx = next.findLastIndex(m => m.role === "process" && m.thinking);
          if (idx !== -1) next[idx] = { ...next[idx], thinking: false };
          next.push({ role: "ai", text: "好的，我来帮您生成PPT。需要先确认演示场景、受众、页数和风格，以便提供针对性的内容结构。" });
          return next;
        });
        // panel appears after AI summary is shown
        setTimeout(() => { if (activeRunId.current === runId) setStage("requirement"); }, 400);
      } else {
        setMessages(prev => {
          const next = [...prev];
          const idx = next.findLastIndex(m => m.role === "process" && m.thinking);
          if (idx !== -1) next[idx] = { ...next[idx], thinking: false };
          next.push({ role: "ai", text: "好的，我来帮您处理这个请求。" });
          return next;
        });
      }
    }, 37000);
  };

  const handleRequirementConfirm = () => {
    const runId = ++activeRunId.current;
    setStage("outline_generating");
    setMessages(prev => [...prev, { role: "process", text: "", thinking: true, variant: "outline" }]);
    setTimeout(() => {
      if (activeRunId.current !== runId) return;
      setMessages(prev => {
        const next = [...prev];
        const idx = next.findLastIndex(m => m.role === "process" && m.thinking);
        if (idx !== -1) next[idx] = { ...next[idx], thinking: false };
        next.push({ role: "ai", text: "需求已确认，大纲生成完成，请确认以下结构。" });
        return next;
      });
      setTimeout(() => { if (activeRunId.current === runId) setStage("outline"); }, 400);
    }, 24000);
  };

  const handleOutlineConfirm = () => {
    const runId = ++activeRunId.current;
    setStage("ppt_generating");
    setMessages(prev => [...prev, { role: "process", text: "", thinking: true, variant: "ppt" }]);
    setTimeout(() => {
      if (activeRunId.current !== runId) return;
      setMessages(prev => {
        const next = [...prev];
        const idx = next.findLastIndex(m => m.role === "process" && m.thinking);
        if (idx !== -1) next[idx] = { ...next[idx], thinking: false };
        next.push({ role: "result", text: "" });
        return next;
      });
      setTimeout(() => { if (activeRunId.current === runId) setStage("preview"); }, 400);
    }, 20000);
  };

  const handleStop = () => {
    activeRunId.current += 1;
    setStage("idle");
    setMessages(prev => prev.map(message => message.role === "process" && message.thinking ? { ...message, thinking: false } : message));
  };

  const handleNewChat = () => { activeRunId.current += 1; setMessages([]); setInput(""); setPptGeneration(false); setStage("idle"); setActiveHistoryId(null); };
  const chatTitle = messages.length > 0
    ? messages[0].text.slice(0, 20) + (messages[0].text.length > 20 ? "…" : "")
    : undefined;

  return (
    <div className="w-screen h-screen flex flex-row overflow-hidden">
      {/* sidebar */}
      {sidebarOpen && (
        <Sidebar
          history={history}
          setHistory={setHistory}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          activeId={activeHistoryId}
          onSelect={handleSelectHistory}
        />
      )}
      {/* main content: header always at App level so sidebar can never affect it */}
      <div className="relative z-20 flex-1 min-w-0 min-h-0 flex flex-col bg-white">
        <ChatHeader
          title={chatTitle}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(o => !o)}
          onNewChat={messages.length > 0 ? handleNewChat : undefined}
        />
        {messages.length > 0
          ? <ChatView
              conversationId={activeHistoryId}
              messages={messages}
              input={input}
              onInputChange={setInput}
              onSend={handleSend}
              showInput={stage !== "requirement" && stage !== "outline"}
              onOpenPpt={() => setStage("preview")}
              onRegeneratePpt={handleOutlineConfirm}
              pptGeneration={pptGeneration}
              onPptGenerationChange={setPptGeneration}
              agentRunning={messages.some(message => message.role === "process" && Boolean(message.thinking))}
              onStop={handleStop}
            />
          : <HomeView
              input={input}
              onInputChange={setInput}
              onSend={handleSend}
              pptGeneration={pptGeneration}
              onPptGenerationChange={setPptGeneration}
            />
        }
      </div>
      {/* right-hand PPT viewer, shares the row with the chat column */}
      {stage === "preview" && <PptPanel onClose={() => setStage("idle")} />}
      {/* panels / preview (z-50, fixed) */}
      {/*  these stay here so they overlay regardless of sidebar */}

      <RequirementPanel
        visible={stage === "requirement"}
        onClose={resetPptFlow}
        onConfirm={handleRequirementConfirm}
        mainOffset={sidebarOpen ? 120 : 0}
      />
      <OutlinePanel
        visible={stage === "outline"}
        onClose={resetPptFlow}
        onConfirm={handleOutlineConfirm}
        mainOffset={sidebarOpen ? 120 : 0}
      />
    </div>
  );
}
