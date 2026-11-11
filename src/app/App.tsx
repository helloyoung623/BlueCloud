import { Fragment, forwardRef, useState, useRef, useEffect, useCallback } from "react";
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
import { PptPanel, PptResultMessage } from "./components/ppt-result";
import { ArtifactFileCard, TaskArtifactsButton } from "./components/task-artifacts";
import type { LocatedTaskArtifact, TaskArtifact } from "./components/task-artifacts";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "./components/ui/dialog";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./components/ui/sheet";
import { useIsMobile } from "./components/ui/use-mobile";
import { OperationMenu } from "./components/operation-menu";
import { ProjectInstructionDialog, ProjectMembersDialog, ProjectMemberTag } from "./components/project-settings-dialogs";
import type { ProjectMember } from "./components/project-settings-dialogs";
import { getAvatarInitial } from "./components/avatar-initial";
import { AttachmentTray, MAX_ATTACHMENTS, formatFileSize, getAttachmentExtension, getAttachmentIcon, getAttachmentValidationError } from "./components/attachment-tray";
import type { ChatAttachment } from "./components/attachment-tray";
import { AttachmentPicker } from "./components/attachment-picker";
import type { AttachmentSource } from "./components/attachment-picker";
import { DEMO_PROJECT_FILES, ProjectFilesPanel } from "./components/project-files";
import type { ProjectFiles } from "./components/project-files";
import { Popover, PopoverAnchor } from "./components/ui/popover";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

// ── types ─────────────────────────────────────────────────────────────────────

type ProcessVariant = "requirement" | "outline" | "ppt";
type ProcessPreset = { goal: string; running: string; actions: { label: string; icon: ToolKind }[] };
type Message = {
  role: "user" | "ai" | "process" | "result";
  text: string;
  attachments?: ChatAttachment[];
  thinking?: boolean;
  variant?: ProcessVariant;
  preset?: ProcessPreset;
  artifacts?: TaskArtifact[];
};
type PptStage = "idle" | "requirement" | "outline_generating" | "outline" | "ppt_generating" | "preview";
type PptMode = "标准" | "PowerPoint";
type PptPageCount = "智能匹配" | "5～8页" | "8～12页" | "12～18页";

type OutlinePageContent =
  | { type: "text"; text: string }
  | { type: "list"; items: string[] };

type OutlinePage = { id: number; pageLabel: string; title: string; content: OutlinePageContent };

// ── helpers ───────────────────────────────────────────────────────────────────

const isPPTIntent = (t: string) => /ppt|演示|幻灯|slide/i.test(t) || t.includes("PPT");

// mock files produced by the AI for requests that ask for a document-like output
const buildTaskArtifacts = (text: string): TaskArtifact[] => {
  const extension: TaskArtifact["extension"] | null = /表格|excel|xlsx/i.test(text) ? "xlsx"
    : /word|docx/i.test(text) ? "docx"
      : /代码|网页|html/i.test(text) ? "html"
        : /文档|文件|报告|整理|导出|pdf/i.test(text) ? "pdf"
          : null;
  if (!extension) return [];
  const baseName = text.replace(/[\\/:*?"<>|\s，。！？、；：]/g, "").slice(0, 24) || "整理结果";
  return [{ id: `${Date.now()}-${extension}`, name: `${baseName}.${extension === "html" ? "html" : extension}`, extension, size: "36M" }];
};
const PPT_ARTIFACT_NAME = "信息的分析报告.pptx";

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

function PanelFooter({ count, cancelled, onConfirm, pptMode, onPptModeChange }: {
  count: number;
  cancelled: boolean;
  onConfirm: () => void;
  pptMode: PptMode;
  onPptModeChange: (mode: PptMode) => void;
}) {
  return (
    <div className="shrink-0 px-[16px] py-[16px] flex items-center gap-[16px] bg-[rgba(255,255,255,0.92)] border-t border-[#f2f2f2]">
      <p className="flex-1 text-[14px] leading-[22px]">
        {!cancelled && (
          <><span className="text-[#1e63f5] font-medium">{count}S</span><span className="text-[rgba(0,0,0,0.38)]"> 后自动确认</span></>
        )}
      </p>
      <PptSettingPicker kind="mode" value={pptMode} onChange={onPptModeChange} footer />
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

function RequirementPanel({ visible, onClose, onConfirm, pptMode, onPptModeChange, initialPages, mainOffset = 0 }: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pptMode: PptMode;
  onPptModeChange: (mode: PptMode) => void;
  initialPages: PptPageCount;
  mainOffset?: number;
}) {
  const [style, setStyle] = useState("科技现代");
  const [scenes, setScenes] = useState<string[]>(["商业路演"]);
  const [audience, setAudience] = useState<string[]>(["投资人"]);
  const [pages, setPages] = useState(initialPages === "智能匹配" ? "8～12页" : initialPages);
  const [moreStylesOpen, setMoreStylesOpen] = useState(false);
  const closeMoreStylesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moreStylesTriggerRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) setPages(initialPages === "智能匹配" ? "8～12页" : initialPages);
  }, [initialPages, visible]);

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
                ref={moreStylesTriggerRef}
                onClick={openMoreStyles}
                className={`relative flex w-full items-center justify-between rounded-[8px] px-[12px] py-[8px] text-left cursor-pointer ${moreStylesOpen ? "bg-[#f7f7f7]" : "bg-white"}`}
              >
                <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)]">更多</span>
                <svg width="10" height="12" viewBox="0 0 5.30321 9.19243" fill="none" className="-scale-x-100"><path d={svgPanel.p5e65780} fill="black" fillOpacity="0.38" /></svg>
                <span aria-hidden className="absolute inset-0 rounded-[8px] border border-[#e6e6e6] pointer-events-none" />
              </button>
              {moreStylesOpen && (
                <OperationMenu anchor={moreStylesTriggerRef.current}
                  className="w-[192px] rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]"
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
                </OperationMenu>
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
            {["5～8页", "8～12页", "12～18页"].map(s => (
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

      <PanelFooter count={count} cancelled={cancelled} onConfirm={handleConfirm} pptMode={pptMode} onPptModeChange={onPptModeChange} />
    </SlidePanel>
  );
}

// ── outline panel ─────────────────────────────────────────────────────────────

type PresentationMode = "smart" | "visual";

function VisualizationSubmenu({ onSelect, anchor, onMouseEnter, onMouseLeave }: {
  onSelect: (style: string) => void;
  anchor: HTMLElement | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const styles = ["智能匹配", "折线图", "柱状图", "饼图"];
  return (
    <OperationMenu submenu anchor={anchor} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="w-[168px] rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]">
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
    </OperationMenu>
  );
}

function PresentationMenu({ mode, onChange, onClose, anchor }: {
  anchor: HTMLElement | null;
  mode: PresentationMode;
  onChange: (mode: PresentationMode) => void;
  onClose: () => void;
}) {
  const [visualHovered, setVisualHovered] = useState(false);
  const visualRef = useRef<HTMLDivElement>(null);
  const closeVisualTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openVisualMenu = () => {
    if (closeVisualTimer.current) clearTimeout(closeVisualTimer.current);
    setVisualHovered(true);
  };
  const deferCloseVisualMenu = () => {
    if (closeVisualTimer.current) clearTimeout(closeVisualTimer.current);
    closeVisualTimer.current = setTimeout(() => setVisualHovered(false), 140);
  };
  useEffect(() => () => {
    if (closeVisualTimer.current) clearTimeout(closeVisualTimer.current);
  }, []);
  return (
    <OperationMenu anchor={anchor} className="w-[304px] rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]">
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
      <div ref={visualRef} className="relative" onMouseEnter={openVisualMenu} onMouseLeave={deferCloseVisualMenu}>
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
        {visualHovered && <VisualizationSubmenu anchor={visualRef.current?.querySelector("button") ?? null} onMouseEnter={openVisualMenu} onMouseLeave={deferCloseVisualMenu} onSelect={() => { onChange("visual"); onClose(); }} />}
      </div>
    </OperationMenu>
  );
}

function OutlinePageCard({ page, presentation, onPresentationChange }: {
  page: OutlinePage;
  presentation: PresentationMode;
  onPresentationChange: (mode: PresentationMode) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const presentationTriggerRef = useRef<HTMLButtonElement>(null);
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
                ref={presentationTriggerRef}
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
              {menuOpen && <PresentationMenu anchor={presentationTriggerRef.current} mode={presentation} onChange={onPresentationChange} onClose={() => setMenuOpen(false)} />}
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

// ── memory management ─────────────────────────────────────────────────────────

const initialMemories = [
  {
    title: "关于你",
    editorInlineBoldId: "fge-143",
    content: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  },
  {
    title: "XXXX",
    editorInlineBoldId: "fge-153",
    content: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  },
  {
    title: "XXXX",
    content: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  },
];

function MemoryModal({ onClose }: { onClose: () => void }) {
  const [enabled, setEnabled] = useState(true);
  const [memories, setMemories] = useState(initialMemories);
  const [memoryInput, setMemoryInput] = useState("");
  const [pendingMemory, setPendingMemory] = useState("");
  const [updateStatus, setUpdateStatus] = useState<"idle" | "updating" | "success">("idle");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (updateStatus === "updating") {
      const timer = window.setTimeout(() => {
        setMemories(current => [...current, { title: "XXXX", content: pendingMemory }]);
        setPendingMemory("");
        setUpdateStatus("success");
      }, 3000);
      return () => window.clearTimeout(timer);
    }

    if (updateStatus === "success") {
      const timer = window.setTimeout(() => setUpdateStatus("idle"), 3000);
      return () => window.clearTimeout(timer);
    }
  }, [pendingMemory, updateStatus]);

  const addMemory = (event: React.FormEvent) => {
    event.preventDefault();
    const value = memoryInput.trim();
    if (!value || updateStatus !== "idle") return;
    setPendingMemory(value);
    setMemoryInput("");
    setUpdateStatus("updating");
  };

  return (
    <div className="fixed inset-0 z-[300] overflow-hidden bg-[rgba(0,0,0,0.5)]">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="memory-title"
        className="fixed bottom-0 flex h-[calc(100vh-72px)] max-h-[828px] w-[min(800px,calc(100vw-32px))] -translate-x-1/2 flex-col overflow-hidden rounded-t-[16px] bg-white"
        style={{ left: "calc(50% + min(40px, 3vw))" }}
      >
        <header className="relative h-[76px] shrink-0">
          <h2
            id="memory-title"
            className="absolute left-[24px] top-[26px] font-['PingFang_SC:Medium'] text-[20px] font-semibold leading-[28px] tracking-[0.02px] text-[rgba(0,0,0,0.88)]"
          >
            记忆
          </h2>
          <button
            type="button"
            aria-label="关闭记忆管理"
            onClick={onClose}
            className="absolute right-[24px] top-[24px] flex size-[32px] cursor-pointer items-center justify-center rounded-[4px] hover:bg-[#f7f7f7]"
          >
            <img src="/assets/30367.svg" alt="" />
          </button>
        </header>

        <div className="flex shrink-0 items-center gap-[12px] px-[24px]">
          <div className="min-w-0 flex-1">
            <p className="font-['PingFang_SC:Medium'] text-[16px] font-semibold leading-[24px] tracking-[0.016px] text-[rgba(0,0,0,0.88)]">允许记忆</p>
            <p className="mt-[4px] font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.6)]">
              允许 AI从对话中提取并记住相关上下文，以便在未来对话中提供更连贯、个性化的回应。
            </p>
          </div>
          {enabled && (
            <>
              <button
                type="button"
                onClick={() => setMemories([])}
                className="shrink-0 cursor-pointer rounded-[4px] px-[4px] py-[3px] font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[#fc5926]"
              >
                重置
              </button>
              <button
                type="button"
                className="shrink-0 cursor-pointer rounded-[4px] px-[4px] py-[3px] font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[#1e63f5]"
              >
                导入
              </button>
            </>
          )}
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label="允许记忆"
            onClick={() => setEnabled(value => !value)}
            className="shrink-0 cursor-pointer rounded-full"
          >
            <img src={enabled ? "/assets/07533.svg" : "/assets/29026.svg"} alt="" />
          </button>
        </div>

        {enabled && (
          <>
            <div className="mt-[16px] min-h-0 flex-1 overflow-y-auto px-[24px] pb-[72px]">
              {memories.map((memory, index) => (
                <div key={`${memory.title}-${index}`} className="mb-[24px]">
                  <p className="font-['PingFang_SC:Medium'] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">
                    {memory.editorInlineBoldId ? (
                      <span className="fg-inline-bold font-bold" data-fge-id={memory.editorInlineBoldId}>{memory.title}</span>
                    ) : memory.title}
                  </p>
                  <p className="mt-[12px] break-words font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">
                    {memory.content}
                  </p>
                </div>
              ))}
            </div>
            {updateStatus === "idle" && (
              <form onSubmit={addMemory} className="absolute bottom-0 left-0 flex w-full items-center bg-[rgba(255,255,255,0.01)] p-[16px]">
                <div className="flex h-[40px] flex-1 items-center overflow-hidden rounded-full border border-[#e6e6e6] bg-white pl-[15px] pr-[7px] shadow-[0_0_12px_rgba(0,0,0,0.08)]">
                  <input
                    value={memoryInput}
                    onChange={event => setMemoryInput(event.target.value)}
                    aria-label="添加或删除记忆"
                    placeholder="告诉我记住什么？忘记什么？"
                    className="min-w-0 flex-1 bg-transparent font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)] outline-none placeholder:text-[rgba(0,0,0,0.26)]"
                  />
                  <button
                    type="submit"
                    aria-label="提交记忆"
                    disabled={!memoryInput.trim()}
                    className={`flex size-[24px] shrink-0 items-center justify-center rounded-full ${
                      memoryInput.trim() ? "cursor-pointer bg-[#1e63f5]" : "cursor-default bg-[#f2f2f2]"
                    }`}
                  >
                    <img src={memoryInput.trim() ? "/assets/3b7df.svg" : "/assets/23b2e.svg"} alt="" />
                  </button>
                </div>
              </form>
            )}
            {updateStatus === "updating" && (
              <div
                role="status"
                className="absolute bottom-[32px] left-1/2 flex min-h-[44px] -translate-x-1/2 items-center gap-[8px] rounded-full bg-white py-[8px] pl-[8px] pr-[16px] shadow-[0_0_6px_rgba(0,0,0,0.08)]"
              >
                <img src="/assets/34657.svg" alt="" className="shrink-0 animate-spin" />
                <span className="whitespace-nowrap font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">
                  正在更新记忆
                </span>
              </div>
            )}
          </>
        )}
      </section>
      {updateStatus === "success" && (
        <div
          role="status"
          className="fixed top-[24px] z-[310] flex min-h-[44px] -translate-x-1/2 items-center gap-[8px] rounded-full border border-[#38e38a] bg-white py-[8px] pl-[8px] pr-[16px] shadow-[0_0_6px_rgba(0,0,0,0.08)]"
          style={{ left: "calc(50% + min(40px, 3vw))" }}
        >
          <img src="/assets/00c34.svg" alt="" className="shrink-0" />
          <span className="whitespace-nowrap font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">
            记忆更新成功
          </span>
        </div>
      )}
    </div>
  );
}

// ── sidebar ───────────────────────────────────────────────────────────────────

type HistoryItem = { id: number; title: string; pinned?: boolean; messages: Message[]; projectId?: number; createdAt?: number };
type ProjectItem = { id: number; name: string; instruction: string; pinned?: boolean; members?: ProjectMember[]; files?: ProjectFiles; owner?: string };

function TaskProjectMoveMenu({ projects, projectId, onMove, onCreate }: {
  projects: ProjectItem[];
  projectId?: number;
  onMove: (projectId: number | undefined) => void;
  onCreate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const targets = projects.filter(project => project.id !== projectId);
  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const deferClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={deferClose}>
      <button ref={triggerRef} type="button" role="menuitem" aria-haspopup="menu" aria-expanded={open} onClick={openMenu} onKeyDown={event => {
        if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openMenu();
        }
      }} className={`flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left text-[14px] font-normal leading-[22px] tracking-[0.014px] ${open ? "bg-[#f2f2f2]" : "hover:bg-[#f7f7f7]"}`}>
        <img src="/assets/1d8f2.svg" alt="" className="shrink-0" />
        <span className="min-w-0 flex-1">移动到项目</span>
        <img src="/assets/fb6a4.svg" alt="" className="shrink-0" />
      </button>
      {open && (
        <OperationMenu submenu anchor={triggerRef.current} role="menu" aria-label="移动到项目" onMouseEnter={openMenu} onMouseLeave={deferClose} onPointerDown={event => event.stopPropagation()} onKeyDown={event => {
          if (event.key === "Escape" || event.key === "ArrowLeft") {
            event.stopPropagation();
            setOpen(false);
            triggerRef.current?.focus();
          }
        }} className="w-[232px] overflow-hidden rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]">
          <div className="flex max-h-[480px] flex-col overflow-y-auto py-[4px]">
            {targets.length === 0 ? (
              <div className="px-[8px] py-[11px] text-[14px] leading-[22px] text-[rgba(0,0,0,0.38)]">暂无项目</div>
            ) : targets.map(project => (
              <button key={project.id} type="button" role="menuitem" onClick={() => onMove(project.id)} className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left text-[14px] font-normal leading-[22px] tracking-[0.014px] hover:bg-[#f7f7f7]">
                <img src="/assets/d95df.svg" alt="" className="shrink-0" />
                <span className="min-w-0 flex-1 truncate">{project.name}</span>
              </button>
            ))}
            <div className="relative h-px w-full"><img src="/assets/4b9c6.svg" alt="" className="absolute left-0 top-0" /></div>
            <button type="button" role="menuitem" onClick={onCreate} className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left text-[14px] font-normal leading-[22px] tracking-[0.014px] hover:bg-[#f7f7f7]">
              <img src="/assets/eede2.svg" alt="" className="shrink-0" />新建项目
            </button>
            {projectId !== undefined && (
              <button type="button" role="menuitem" onClick={() => onMove(undefined)} className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left text-[14px] font-normal leading-[22px] tracking-[0.014px] hover:bg-[#f7f7f7]">
                <img src="/assets/6ec2b.svg" alt="" className="shrink-0" />从项目中移出
              </button>
            )}
          </div>
        </OperationMenu>
      )}
    </div>
  );
}

const TaskOperationsMenu = forwardRef<HTMLDivElement, {
  anchor: HTMLElement | null;
  task: HistoryItem;
  projects: ProjectItem[];
  align?: "start" | "end";
  gap?: number;
  onTogglePin: () => void;
  onRename: (title: string) => void;
  onMove: (projectId: number | undefined) => void;
  onCreateProject: () => void;
  onDelete: () => void;
  onClose: () => void;
}>(({ anchor, task, projects, align, gap, onTogglePin, onRename, onMove, onCreateProject, onDelete, onClose }, ref) => {
  const itemClassName = "flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left text-[14px] font-normal leading-[22px] tracking-[0.014px] hover:bg-[#f7f7f7]";
  const labelClassName = "whitespace-nowrap font-['PingFang_SC:Regular'] font-normal text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]";
  return (
    <OperationMenu
      anchor={anchor}
      ref={ref}
      align={align}
      gap={gap}
      role="menu"
      aria-label="任务操作"
      onKeyDown={event => {
        if (event.key !== "Escape") return;
        onClose();
        anchor?.focus();
      }}
      className="w-[192px] overflow-visible rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]"
    >
      <div className="flex flex-col py-[4px]">
        <button type="button" role="menuitem" onClick={() => { onTogglePin(); onClose(); }} className={itemClassName}>
          <img src={task.pinned ? "/assets/67fe6.svg" : "/assets/4363a.svg"} alt="" className="shrink-0" />
          <span className={labelClassName}>{task.pinned ? "取消置顶" : "置顶此对话"}</span>
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            const name = window.prompt("请输入新的任务名称", task.title)?.trim();
            if (name) onRename(name);
            onClose();
          }}
          className={itemClassName}
        >
          <img src="/assets/e2b81.svg" alt="" className="shrink-0" />
          <span className={labelClassName}>重命名</span>
        </button>
        <TaskProjectMoveMenu
          key={task.id}
          projects={projects}
          projectId={task.projectId}
          onMove={projectId => { onMove(projectId); onClose(); }}
          onCreate={() => { onClose(); onCreateProject(); }}
        />
        <button type="button" role="menuitem" onClick={() => { onDelete(); onClose(); }} className={itemClassName}>
          <img src="/assets/5ff6b.svg" alt="" className="shrink-0" />
          <span className={labelClassName}>删除</span>
        </button>
      </div>
    </OperationMenu>
  );
});
TaskOperationsMenu.displayName = "TaskOperationsMenu";

function CreateProjectDialog({ open, onOpenChange, onCreate }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (project: Omit<ProjectItem, "id">) => void;
}) {
  const [name, setName] = useState("");
  const [instruction, setInstruction] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setName("");
      setInstruction("");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onCreate({ name: trimmedName, instruction: instruction.trim() });
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="w-[720px] max-w-[calc(100%-32px)] gap-0 overflow-hidden rounded-[12px] border-0 bg-white p-0 shadow-[0_0_12px_rgba(0,0,0,0.08)] [&>button]:hidden"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex w-full flex-col gap-[4px] px-[24px] py-[16px]">
            <div className="relative h-[24px] w-full">
              <DialogTitle className="font-['PingFang_SC:Medium'] text-[16px] font-medium leading-[24px] tracking-[0.016px] text-[rgba(0,0,0,0.88)]">
                新建项目
              </DialogTitle>
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="关闭新建项目弹窗"
                  className="absolute right-0 top-0 flex size-[24px] cursor-pointer items-center justify-center rounded-[4px] hover:bg-[#f7f7f7]"
                >
                  <img src="/assets/f802d.svg" alt="" />
                </button>
              </DialogClose>
            </div>
          </div>

          <div className="flex w-full flex-col items-start px-[12px] pt-[16px]">
            <label className="flex w-full flex-col gap-[8px] pb-[24px]">
              <span className="pl-[12px] font-['PingFang_SC:Medium'] text-[14px] font-medium leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.6)]">
                项目名称
              </span>
              <div className="px-[12px]">
                <div className="flex h-[32px] w-full items-center gap-[8px] rounded-[8px] border border-[#e6e6e6] px-[12px] focus-within:border-[#1e63f5]">
                  <input
                    autoFocus
                    required
                    maxLength={15}
                    value={name}
                    onChange={event => setName(event.target.value)}
                    placeholder="请输入项目名称"
                    className="min-w-0 flex-1 bg-transparent font-['PingFang_SC:Regular'] text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)] outline-none placeholder:text-[rgba(0,0,0,0.26)]"
                  />
                  <span className="shrink-0 font-['PingFang_SC:Regular'] text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.38)]">
                    {name.length}/15
                  </span>
                </div>
              </div>
            </label>

            <label className="flex w-full flex-col gap-[8px] pb-[24px]">
              <span className="pl-[12px] font-['PingFang_SC:Medium'] text-[14px] font-medium leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.6)]">
                指令
              </span>
              <div className="px-[12px]">
                <div className="relative w-full overflow-hidden rounded-[8px] border border-[#e6e6e6] focus-within:border-[#1e63f5]">
                  <textarea
                    value={instruction}
                    onChange={event => setInstruction(event.target.value)}
                    placeholder="提供当前项目的背景信息和规范，让 AI 的回复更精准、更符合要求。比如：项目目标、团队习惯、风格偏好、输出约束等"
                    className="block h-[96px] w-full resize-none bg-white p-[12px] pb-[28px] font-['PingFang_SC:Regular'] text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)] outline-none placeholder:text-[rgba(0,0,0,0.26)]"
                  />
                  <img src="/assets/166cb.svg" alt="" className="pointer-events-none absolute bottom-[4px] right-[4px]" />
                </div>
              </div>
            </label>
          </div>

          <div className="flex w-full items-center justify-end gap-[24px] border-t border-[#f2f2f2] p-[24px]">
            <DialogClose asChild>
              <button
                type="button"
                className="cursor-pointer rounded-[4px] px-[4px] py-[3px] text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.6)] hover:bg-[#f7f7f7]"
              >
                取消
              </button>
            </DialogClose>
            <button
              type="submit"
              className="cursor-pointer rounded-[4px] bg-[#1e63f5] px-[16px] py-[5px] text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(255,255,255,0.98)] hover:bg-[#1554d1]"
            >
              确定
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Sidebar({ history, setHistory, projects, setProjects, onClose, onNewChat, onOpenProjects, onNewProjectTask, projectListOpen, activeId, activeProjectId, onSelect, onSelectProject, mobile = false }: {
  mobile?: boolean;
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  projects: ProjectItem[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  onClose: () => void;
  onNewChat: () => void;
  onOpenProjects: () => void;
  onNewProjectTask: (projectId: number) => void;
  projectListOpen: boolean;
  activeId: number | null;
  activeProjectId: number | null;
  onSelect: (id: number) => void;
  onSelectProject: (id: number) => void;
}) {
  const [hoverId, setHoverId] = useState<number | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [hoverProjectId, setHoverProjectId] = useState<number | null>(null);
  const [projectMenuId, setProjectMenuId] = useState<number | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [profileHovered, setProfileHovered] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [memoryPanelOpen, setMemoryPanelOpen] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [tasksExpanded, setTasksExpanded] = useState(true);
  const [expandedProjectIds, setExpandedProjectIds] = useState<Set<number>>(() => new Set());
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [pendingTaskMoveId, setPendingTaskMoveId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const memoryRowRef = useRef<HTMLButtonElement>(null);
  const memoryPanelRef = useRef<HTMLDivElement>(null);
  const memoryPanelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const standaloneHistory = history.filter(item => item.projectId === undefined);
  const openMemoryPanel = () => {
    if (memoryPanelTimer.current) clearTimeout(memoryPanelTimer.current);
    setMemoryPanelOpen(true);
  };
  const deferCloseMemoryPanel = () => {
    if (memoryPanelTimer.current) clearTimeout(memoryPanelTimer.current);
    memoryPanelTimer.current = setTimeout(() => setMemoryPanelOpen(false), 140);
  };

  useEffect(() => () => {
    if (memoryPanelTimer.current) clearTimeout(memoryPanelTimer.current);
  }, []);

  useEffect(() => {
    if (!profileMenuOpen) setMemoryPanelOpen(false);
  }, [profileMenuOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuId(null);
        setProjectMenuId(null);
      }
      if (
        profileMenuOpen &&
        !profileMenuRef.current?.contains(e.target as Node) &&
        !memoryPanelRef.current?.contains(e.target as Node) &&
        !profileTriggerRef.current?.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileMenuOpen]);

  useEffect(() => {
    if (activeId === null) return;
    const activeTask = history.find(item => item.id === activeId);
    if (activeTask?.projectId === undefined) return;
    setExpandedProjectIds(current => {
      if (current.has(activeTask.projectId!)) return current;
      return new Set(current).add(activeTask.projectId!);
    });
  }, [activeId, history]);

  const menuTask = menuId === null ? null : history.find(item => item.id === menuId) ?? null;
  const closeContextMenu = () => {
    setMenuId(null);
    setProjectMenuId(null);
  };

  return (
    <div className={`relative w-[240px] shrink-0 self-stretch border-r border-[#f2f2f2] bg-white p-0 flex flex-col items-center${mobile ? " h-full min-h-0" : ""}`}>
      {/* head */}
      <div className="relative h-[256px] w-full shrink-0 bg-white">
        <div className="absolute left-[calc(50%-15.8px)] top-[52px] h-[16px] w-[160.403px] -translate-x-1/2">
          <img alt="世纪互联办公智能体" className="absolute inset-0 block size-full max-w-none" src="/assets/9d907.svg" />
        </div>
        {/* sidebar toggle (close) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="收起侧边栏"
          className="absolute left-[20px] top-[12px] flex size-[24px] cursor-pointer items-start rounded-[4px] p-[4px] hover:bg-[#f7f7f7]"
        >
          <span className="relative h-full min-w-px flex-1">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={mobile ? "/assets/a8ef3.svg" : "/assets/0c886.svg"} />
          </span>
        </button>
        {/* search button */}
        <button
          type="button"
          aria-label="搜索"
          className="absolute left-[52px] top-[12px] flex size-[24px] cursor-pointer items-start rounded-[4px] p-[4px] hover:bg-[#f7f7f7]"
        >
          <span className="relative h-full min-w-px flex-1">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src="/assets/ed737.svg" />
          </span>
        </button>
        {/* 新任务 */}
        <button
          type="button"
          onClick={onNewChat}
          className={`absolute left-[12px] top-[84px] flex h-[40px] w-[216px] cursor-pointer items-center gap-[8px] overflow-clip rounded-[8px] py-[8px] pl-[12px] pr-[4px] transition-colors ${
            !projectListOpen && activeId === null && activeProjectId === null ? "bg-[#f7f7f7]" : "hover:bg-[#f2f2f2]"
          }`}
        >
          <span className="relative size-[16px] shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src="/assets/a4798.svg" />
          </span>
          <span
            className={`min-w-px flex-1 truncate text-left text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)] ${
              !projectListOpen && activeId === null && activeProjectId === null
                ? "font-['PingFang_SC:Medium'] font-semibold"
                : "font-['PingFang_SC:Regular'] font-normal"
            }`}
          >
            新任务
          </span>
        </button>
        {/* 项目 */}
        <button
          type="button"
          onClick={onOpenProjects}
          className={`absolute left-[12px] top-[124px] flex h-[40px] w-[216px] cursor-pointer items-center gap-[8px] overflow-clip rounded-[8px] py-[8px] pl-[12px] pr-[4px] transition-colors ${
            projectListOpen ? "bg-[#f7f7f7]" : "hover:bg-[#f2f2f2]"
          }`}
        >
          <span className="relative size-[16px] shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src="/assets/6bcaa.svg" />
          </span>
          <span className={`min-w-px flex-1 truncate text-left text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)] ${projectListOpen ? "font-['PingFang_SC:Medium'] font-semibold" : "font-['PingFang_SC:Regular'] font-normal"}`}>
            项目
          </span>
        </button>
        {/* 资料库 */}
        <button
          type="button"
          className="absolute left-[12px] top-[164px] flex h-[40px] w-[216px] cursor-pointer items-center gap-[8px] overflow-clip rounded-[8px] py-[8px] pl-[12px] pr-[4px] transition-colors hover:bg-[#f2f2f2]"
        >
          <span className="relative size-[16px] shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src="/assets/f7258.svg" />
          </span>
          <span className="min-w-px flex-1 truncate text-left font-['PingFang_SC:Regular'] text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">
            资料库
          </span>
        </button>
        {/* 会议助手 */}
        <button
          type="button"
          className="absolute left-[12px] top-[204px] flex h-[40px] w-[216px] cursor-pointer items-center gap-[8px] overflow-clip rounded-[8px] py-[8px] pl-[12px] pr-[4px] transition-colors hover:bg-[#f2f2f2]"
        >
          <span className="relative size-[16px] shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src="/assets/bacdf.svg" />
          </span>
          <span className="min-w-px flex-1 truncate text-left font-['PingFang_SC:Regular'] text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">
            会议助手
          </span>
        </button>
      </div>

      {/* projects */}
      {projects.length > 0 && (
      <div className="shrink-0 w-[216px] pb-[16px] flex flex-col items-start">
        <div className="group relative m-0 flex w-full items-center p-0">
          <button
            type="button"
            aria-expanded={projectsExpanded}
            onClick={() => setProjectsExpanded(expanded => !expanded)}
            className="flex w-full cursor-pointer items-center gap-[4px] rounded-[4px] px-[12px] py-[var(--spacing)] pr-[36px] text-left hover:bg-[#f7f7f7]"
          >
            <span className="text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.38)]">项目</span>
            <svg
              aria-hidden
              className={`size-[16px] shrink-0 text-[rgba(0,0,0,0.38)] transition-opacity ${projectsExpanded ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
              viewBox="0 0 16 16"
              fill="none"
            >
              <path d={projectsExpanded ? "M4 6L8 10L12 6" : "M6 4L10 8L6 12"} stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {(!projectsExpanded || projects.length > 0) && (
            <button
              type="button"
              aria-label="新建项目"
              onClick={() => setCreateProjectOpen(true)}
              className="absolute bottom-[7px] left-[188px] right-[4px] top-[3px] flex cursor-pointer items-center justify-center rounded-[4px] hover:bg-[#f7f7f7]"
            >
              <img src="/assets/4fe43.svg" alt="" className="shrink-0" />
            </button>
          )}
        </div>
        {projectsExpanded && projects.length === 0 && (
          <div className="flex w-full flex-col items-start p-[8px]">
            <button
              type="button"
              aria-label="新建项目"
              onClick={() => setCreateProjectOpen(true)}
              className="flex cursor-pointer items-center gap-[8px] rounded-[4px] px-[4px] py-[3px] hover:bg-[#f7f7f7]"
            >
              <img src="/assets/4fe43.svg" alt="" className="shrink-0" />
              <span className="whitespace-nowrap text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">新建项目</span>
            </button>
          </div>
        )}
        {projectsExpanded && projects.length > 0 && (
          <div className="flex w-full flex-col items-start">
            {projects.map(project => {
              const projectTasks = history.filter(item => item.projectId === project.id);
              const isActiveProjectContext = activeProjectId === project.id;
              const isActiveProjectHome = isActiveProjectContext && activeId === null;
              const isProjectExpanded = expandedProjectIds.has(project.id);
              const isProjectHover = hoverProjectId === project.id;
              const hasProjectMenu = projectMenuId === project.id;
              return (
                <div key={project.id} className="w-full">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={isProjectExpanded}
                    onMouseEnter={() => setHoverProjectId(project.id)}
                    onMouseLeave={() => { if (!hasProjectMenu) setHoverProjectId(null); }}
                    onClick={() => {
                      if (projectTasks.length === 0) {
                        onSelectProject(project.id);
                        return;
                      }
                      setExpandedProjectIds(current => {
                        const next = new Set(current);
                        if (next.has(project.id)) next.delete(project.id);
                        else next.add(project.id);
                        return next;
                      });
                    }}
                    onKeyDown={event => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      if (projectTasks.length === 0) onSelectProject(project.id);
                      else {
                        setExpandedProjectIds(current => {
                          const next = new Set(current);
                          if (next.has(project.id)) next.delete(project.id);
                          else next.add(project.id);
                          return next;
                        });
                      }
                    }}
                    className={`flex h-[40px] w-full cursor-pointer items-center gap-[8px] overflow-hidden rounded-[8px] py-[8px] pl-[12px] pr-[4px] text-left transition-colors ${isActiveProjectHome ? "bg-[#f7f7f7]" : isProjectHover ? "bg-[#f2f2f2]" : ""}`}
                  >
                    <img src={isProjectExpanded ? "/assets/bf868.svg" : "/assets/6bcaa.svg"} alt="" className="shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">
                      {project.name}
                    </span>
                    {project.pinned && !isProjectHover && !hasProjectMenu && (
                      <div className="flex size-[24px] shrink-0 items-center justify-center">
                        <svg width="12" height="13" viewBox="0 0 12 12.6667" fill="none">
                          <path d={svgSidebar.p3170f400} fill="black" fillOpacity="0.26" />
                          <path d="M0 0H12V1.33333H0V0Z" fill="black" fillOpacity="0.26" />
                        </svg>
                      </div>
                    )}
                    {(isProjectHover || hasProjectMenu) && (
                      <>
                        <button
                          type="button"
                          aria-label="项目更多操作"
                          onClick={event => {
                            event.stopPropagation();
                            if (hasProjectMenu) {
                              setProjectMenuId(null);
                              return;
                            }
                            setMenuAnchor(event.currentTarget);
                            setMenuId(null);
                            setProjectMenuId(project.id);
                            setHoverProjectId(project.id);
                          }}
                          className="flex size-[24px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] hover:bg-[rgba(0,0,0,0.06)]"
                        >
                          <svg width="3" height="12" viewBox="0 0 2.66667 12" fill="none">
                            <path d={svgSidebar.p19c91c80} fill="black" fillOpacity="0.38" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          aria-label={`在${project.name}中新建任务`}
                          onClick={event => {
                            event.stopPropagation();
                            setProjectMenuId(null);
                            onNewProjectTask(project.id);
                          }}
                          className="flex size-[24px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] hover:bg-[rgba(0,0,0,0.06)]"
                        >
                          <img src="/assets/49891.svg" alt="" />
                        </button>
                      </>
                    )}
                  </div>
                  {isProjectExpanded && projectTasks.map(task => {
                    const isTaskActive = activeId === task.id;
                    const isTaskHover = hoverId === task.id;
                    const hasTaskMenu = menuId === task.id;
                    return (
                      <div
                        key={task.id}
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => setHoverId(task.id)}
                        onMouseLeave={() => { if (!hasTaskMenu) setHoverId(null); }}
                        onClick={() => { onSelect(task.id); setMenuId(null); }}
                        onKeyDown={event => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onSelect(task.id);
                            setMenuId(null);
                          }
                        }}
                        className={`flex h-[40px] w-full cursor-pointer items-center gap-[4px] overflow-hidden rounded-[8px] py-[8px] pl-[36px] pr-[4px] text-left transition-colors ${isTaskActive ? "bg-[#f7f7f7]" : isTaskHover ? "bg-[#f2f2f2]" : ""}`}
                      >
                        <span className={`min-w-0 flex-1 truncate text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)] ${isTaskActive ? "font-medium" : "font-normal"}`}>
                          {task.title}
                        </span>
                        {task.pinned && !isTaskHover && !hasTaskMenu && (
                          <div className="flex size-[24px] shrink-0 items-center justify-center">
                            <svg width="12" height="13" viewBox="0 0 12 12.6667" fill="none">
                              <path d={svgSidebar.p3170f400} fill="black" fillOpacity="0.26" />
                              <path d="M0 0H12V1.33333H0V0Z" fill="black" fillOpacity="0.26" />
                            </svg>
                          </div>
                        )}
                        {(isTaskHover || hasTaskMenu) && (
                          <button
                            type="button"
                            aria-label="任务更多操作"
                            onClick={event => {
                              event.stopPropagation();
                              if (hasTaskMenu) {
                                setMenuId(null);
                                return;
                              }
                              setMenuAnchor(event.currentTarget);
                              setProjectMenuId(null);
                              setMenuId(task.id);
                              setHoverId(task.id);
                            }}
                            className="flex size-[24px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] hover:bg-[rgba(0,0,0,0.06)]"
                          >
                            <svg width="3" height="12" viewBox="0 0 2.66667 12" fill="none">
                              <path d={svgSidebar.p19c91c80} fill="black" fillOpacity="0.38" />
                            </svg>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* tasks */}
      {standaloneHistory.length > 0 && (
      <div className="flex min-h-0 w-[216px] flex-1 flex-col items-start">
        <div className="group relative flex w-full shrink-0 items-center p-0">
          <button
            type="button"
            aria-expanded={tasksExpanded}
            onClick={() => setTasksExpanded(expanded => !expanded)}
            className="flex w-full cursor-pointer items-center gap-[4px] rounded-[4px] px-[12px] py-[var(--spacing)] text-left hover:bg-[#f7f7f7]"
          >
            <span className="text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.38)]">任务</span>
            <svg
              aria-hidden
              className={`size-[16px] shrink-0 text-[rgba(0,0,0,0.38)] transition-opacity ${tasksExpanded ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
              viewBox="0 0 16 16"
              fill="none"
            >
              <path d={tasksExpanded ? "M4 6L8 10L12 6" : "M6 4L10 8L6 12"} stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {tasksExpanded && <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto">
          {standaloneHistory.length === 0 ? (
            <p className="p-[12px] font-['PingFang_SC:Regular'] text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.26)]">暂无任务</p>
          ) : standaloneHistory.map(item => {
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
                    className={`w-full h-[40px] rounded-[8px] flex items-center pl-[12px] pr-[4px] py-[8px] text-left transition-colors cursor-pointer
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
                          setMenuAnchor(e.currentTarget);
                          setProjectMenuId(null);
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
            })}
        </div>}
      </div>
      )}
      {standaloneHistory.length === 0 && <div className="flex-1" />}

      {/* context menu — fixed to escape overflow clip */}
      {projectMenuId !== null && (
        <OperationMenu anchor={menuAnchor} ref={menuRef} className="w-[192px] rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col py-[4px]">
            {[
              {
                label: projects.find(item => item.id === projectMenuId)?.pinned ? "取消置顶" : "置顶此项目",
                icon: svgSidebar.p3170f400,
                action: () => setProjects(items => items.map(item => item.id === projectMenuId ? { ...item, pinned: !item.pinned } : item)),
              },
              { label: "编辑名称", icon: svgSidebar.p20221d00, action: () => undefined },
              {
                label: "删除",
                icon: svgSidebar.p2ffde100,
                action: () => {
                  setProjects(items => items.filter(item => item.id !== projectMenuId));
                  setHistory(items => items.filter(item => item.projectId !== projectMenuId));
                },
              },
            ].map(item => (
              <button key={item.label} type="button" onClick={() => { item.action(); closeContextMenu(); }}
                className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left hover:bg-[#f7f7f7]">
                <svg width="16" height="16" viewBox="0 0 13.3333 13.3333" fill="none" className="shrink-0">
                  <path d={item.icon} fill="black" fillOpacity="0.26" />
                </svg>
                <span className="whitespace-nowrap text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">{item.label}</span>
              </button>
            ))}
          </div>
        </OperationMenu>
      )}

      {menuTask && (
        <TaskOperationsMenu
          ref={menuRef}
          anchor={menuAnchor}
          task={menuTask}
          projects={projects}
          onTogglePin={() => setHistory(items => items.map(item => item.id === menuTask.id ? { ...item, pinned: !item.pinned } : item))}
          onRename={title => setHistory(items => items.map(item => item.id === menuTask.id ? { ...item, title } : item))}
          onMove={projectId => {
            setHistory(items => items.map(item => item.id === menuTask.id ? { ...item, projectId } : item));
            if (projectId !== undefined) setExpandedProjectIds(current => new Set(current).add(projectId));
          }}
          onCreateProject={() => {
            setPendingTaskMoveId(menuTask.id);
            setCreateProjectOpen(true);
          }}
          onDelete={() => setHistory(items => items.filter(item => item.id !== menuTask.id))}
          onClose={closeContextMenu}
        />
      )}

      {profileMenuOpen && (
        <OperationMenu anchor={profileTriggerRef.current}
          ref={profileMenuRef}
          role="menu"
          aria-label="用户菜单"
          className="w-[192px] overflow-hidden rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]"
        >
          <div className="flex w-full flex-col py-[4px]">
            <button
              type="button"
              role="menuitem"
              onClick={() => setProfileMenuOpen(false)}
              className="flex h-[44px] w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] text-left text-[14px] font-normal leading-[22px] tracking-[0.014px] hover:bg-[#f7f7f7]"
            >
              <img src="/assets/d0cd0.svg" alt="" className="size-[16px] shrink-0" />
              <span className="flex min-w-0 flex-1 items-center gap-[4px]">
                <span className="whitespace-nowrap font-['PingFang_SC:Regular'] font-normal text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">剩余用量</span>
                <span className="font-['TCloudNumber:Regular'] font-normal text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)]">90%</span>
              </span>
              <img src="/assets/c29c9.svg" alt="" className="size-[16px] shrink-0" />
            </button>
            <button
              ref={memoryRowRef}
              type="button"
              role="menuitem"
              aria-haspopup="dialog"
              aria-expanded={memoryPanelOpen}
              onMouseEnter={openMemoryPanel}
              onMouseLeave={deferCloseMemoryPanel}
              onFocus={openMemoryPanel}
              onClick={openMemoryPanel}
              className={`flex h-[44px] w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] text-left text-[14px] font-normal leading-[22px] tracking-[0.014px] ${memoryPanelOpen ? "bg-[#f2f2f2]" : "hover:bg-[#f2f2f2]"}`}
            >
              <img src="/assets/7ba18.svg" alt="" className="size-[16px] shrink-0" />
              <span className="min-w-0 flex-1 whitespace-nowrap font-['PingFang_SC:Regular'] font-normal text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">记忆</span>
              <span className="flex shrink-0 items-center gap-[4px]">
                <span className="whitespace-nowrap font-['PingFang_SC:Regular'] font-normal text-[12px] leading-[20px] tracking-[0.012px] text-[rgba(0,0,0,0.6)]">{memoryEnabled ? "已开启" : "已关闭"}</span>
                <img src="/assets/c29c9.svg" alt="" className="size-[16px] shrink-0" />
              </span>
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => setProfileMenuOpen(false)}
              className="flex h-[44px] w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] text-left text-[14px] font-normal leading-[22px] tracking-[0.014px] hover:bg-[#f7f7f7]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden>
                <path d="M13.333 13.333V4.667L12 2H1.333L0 4.669V13.333C0 13.702.298 14 .667 14H12.667C13.035 14 13.333 13.702 13.333 13.333ZM1.333 6H12V12.667H1.333V6ZM2.157 3.333H11.176L11.843 4.667H1.491L2.157 3.333ZM8.667 7.333H4.667V8.667H8.667V7.333Z" transform="translate(1 2)" fill="black" fillOpacity="0.26" />
              </svg>
              <span className="whitespace-nowrap font-['PingFang_SC:Regular'] font-normal text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">归档数据</span>
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => setProfileMenuOpen(false)}
              className="flex h-[44px] w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] text-left text-[14px] font-normal leading-[22px] tracking-[0.014px] hover:bg-[#f7f7f7]"
            >
              <img src="/assets/89936.svg" alt="" className="size-[16px] shrink-0" />
              <span className="whitespace-nowrap font-['PingFang_SC:Regular'] font-normal text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">问题反馈</span>
            </button>
            <div className="mx-[8px] h-px bg-[#f2f2f2]" />
            <button
              type="button"
              role="menuitem"
              onClick={() => setProfileMenuOpen(false)}
              className="flex h-[44px] w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] text-left text-[14px] font-normal leading-[22px] tracking-[0.014px] hover:bg-[#f7f7f7]"
            >
              <img src="/assets/9a53a.svg" alt="" className="size-[16px] shrink-0" />
              <span className="whitespace-nowrap font-['PingFang_SC:Regular'] font-normal text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">退出登录</span>
            </button>
          </div>
        </OperationMenu>
      )}
      {profileMenuOpen && memoryPanelOpen && (
        <OperationMenu
          ref={memoryPanelRef}
          submenu
          anchor={memoryRowRef.current}
          role="dialog"
          aria-label="记忆"
          onMouseEnter={openMemoryPanel}
          onMouseLeave={deferCloseMemoryPanel}
          className="w-[192px] rounded-[12px] bg-white p-[16px] shadow-[0_0_12px_rgba(0,0,0,0.08)]"
        >
          <div className="flex h-[24px] items-center justify-between">
            <img src="/assets/7ba18.svg" alt="" className="size-[24px] shrink-0" />
            <button
              type="button"
              role="switch"
              aria-checked={memoryEnabled}
              aria-label="允许记忆"
              onClick={() => setMemoryEnabled(value => !value)}
              className="flex h-[20px] w-[40px] shrink-0 cursor-pointer items-center"
            >
              <img src={memoryEnabled ? "/assets/07533.svg" : "/assets/29026.svg"} alt="" className="h-[20px] w-[40px]" />
            </button>
          </div>
          <div className="mt-[12px] w-[160px]">
            <p className="font-['PingFang_SC:Medium'] text-[16px] font-semibold leading-[24px] tracking-[0.016px] text-[rgba(0,0,0,0.88)]">允许记忆</p>
            <p className="mt-[4px] font-['PingFang_SC:Regular'] text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.6)]">
              允许 AI从对话中提取并记住相关上下文，以便在未来对话中提供更连贯、个性化的回应。
            </p>
          </div>
        </OperationMenu>
      )}

      {/* bottom — user info */}
      <div className="shrink-0 flex w-full items-center px-[12px] py-[8px] bg-white">
        <button
          ref={profileTriggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={profileMenuOpen}
          onMouseEnter={() => setProfileHovered(true)}
          onMouseLeave={() => setProfileHovered(false)}
          onClick={() => {
            setMenuId(null);
            setProjectMenuId(null);
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
      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={open => {
          setCreateProjectOpen(open);
          if (!open) setPendingTaskMoveId(null);
        }}
        onCreate={project => {
          const id = Date.now();
          setProjects(current => [...current, { ...project, id }]);
          setProjectsExpanded(true);
          if (pendingTaskMoveId !== null) {
            setHistory(items => items.map(item => item.id === pendingTaskMoveId ? { ...item, projectId: id } : item));
            setExpandedProjectIds(current => new Set(current).add(id));
            setPendingTaskMoveId(null);
          } else {
            onSelectProject(id);
          }
        }}
      />
      {memoryOpen && <MemoryModal onClose={() => setMemoryOpen(false)} />}
    </div>
  );
}

// ── chat input ────────────────────────────────────────────────────────────────

function PptGenerationToggle({ selected, onChange, borderless = false }: { selected: boolean; onChange: (selected: boolean) => void; borderless?: boolean }) {
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
      className={`shrink-0 box-border flex items-center gap-[4px] rounded-full px-[8px] py-[4px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1e63f5] focus-visible:ring-offset-2 ${borderless ? "border-0" : "border"} ${
        selected
          ? `${borderless ? "" : "border-transparent"} bg-[#ebf4ff] text-[#1e63f5]`
          : `${borderless ? "" : "border-[#f2f2f2]"} text-[rgba(0,0,0,0.88)] hover:bg-[#f2f2f2]`
      }`}
    >
      <span className="relative size-[16px] shrink-0 overflow-hidden" aria-hidden>
        {showClose ? (
          <svg className="absolute inset-[8.33%]" fill="none" viewBox="0 0 13.3333 13.3333" preserveAspectRatio="none">
            <path d={svgPptToggle.p2186600} fill="#1E63F5" />
          </svg>
        ) : !selected ? (
          <img src="/assets/786f5.svg" alt="" className="absolute inset-0" />
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

type PptSettingPickerProps =
  | { kind: "mode"; value: PptMode; onChange: (value: PptMode) => void; footer?: boolean }
  | { kind: "pages"; value: PptPageCount; onChange: (value: PptPageCount) => void; footer?: false };

function PptSettingPicker(props: PptSettingPickerProps) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const isMode = props.kind === "mode";
  const options = isMode
    ? [
        { value: "标准" as const, description: "快速；适合常规汇报" },
        { value: "PowerPoint" as const, description: "PowerPoint原生文件" },
      ]
    : [
        { value: "智能匹配" as const },
        { value: "5～8页" as const },
        { value: "8～12页" as const },
        { value: "12～18页" as const },
      ];

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  return (
    <div ref={pickerRef} className="relative shrink-0">
      {open && (
        <OperationMenu anchor={pickerRef.current?.querySelector(":scope > button") ?? null} className={`overflow-hidden rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)] ${isMode ? "w-[232px]" : "w-[192px]"}`}>
          <div className="flex max-h-[480px] w-full flex-col overflow-y-auto py-[4px]">
            {!isMode && (
              <p className="px-[8px] text-[12px] font-normal leading-[20px] tracking-[0.012px] text-[rgba(0,0,0,0.38)]">
                生成的PPT页面数量
              </p>
            )}
            {options.map((option, index) => {
              const selected = props.value === option.value;
              return (
                <div key={option.value}>
                  {!isMode && index === 1 && <div className="h-px w-full bg-[#f2f2f2]" />}
                  <button
                    type="button"
                    onClick={() => {
                      if (props.kind === "mode") props.onChange(option.value as PptMode);
                      else props.onChange(option.value as PptPageCount);
                      setOpen(false);
                    }}
                    className="relative flex w-full cursor-pointer items-center justify-between rounded-[8px] p-[8px] text-left hover:bg-[#f7f7f7]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)] ${selected ? "font-medium" : "font-normal"}`}>
                        {option.value}
                      </span>
                      {"description" in option && (
                        <span className="block truncate text-[12px] font-normal leading-[20px] tracking-[0.012px] text-[rgba(0,0,0,0.38)]">
                          {option.description}
                        </span>
                      )}
                    </span>
                    {selected && <img src="/assets/9e503.svg" alt="" className="shrink-0" />}
                  </button>
                </div>
              );
            })}
          </div>
        </OperationMenu>
      )}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
        className={`flex cursor-pointer items-center gap-[4px] rounded-full ${props.footer ? "px-[4px] py-[3px]" : "border border-[#f2f2f2] px-[8px] py-[4px] hover:bg-[#f7f7f7]"}`}
      >
        <img src={props.footer ? "/assets/985b1.svg" : isMode ? "/assets/a80d5.svg" : "/assets/b3301.svg"} alt="" className="shrink-0" />
        <span className="whitespace-nowrap text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">
          {props.value}
        </span>
        {props.footer && <img src="/assets/27bf2.svg" alt="" className="shrink-0" />}
      </button>
    </div>
  );
}

function SendButton({ canSend, agentRunning = false, onSend, onStop }: {
  canSend: boolean;
  agentRunning?: boolean;
  onSend: () => void;
  onStop?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agentRunning) setLoading(false);
  }, [agentRunning]);

  const handleClick = () => {
    if (agentRunning) {
      onStop?.();
      return;
    }
    if (!canSend || loading) return;
    setLoading(true);
    onSend();
    window.setTimeout(() => setLoading(false), 560);
  };

  return (
    <button
      type="button"
      aria-label={agentRunning ? "暂停生成" : "发送消息"}
      aria-disabled={!agentRunning && !canSend}
      disabled={!agentRunning && !canSend}
      onClick={handleClick}
      className={`group ml-auto shrink-0 rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[#1e63f5] focus-visible:ring-offset-2 ${agentRunning || canSend ? "cursor-pointer" : "cursor-default"}`}
    >
      {agentRunning ? (
        <div className="flex size-[30px] items-center justify-center rounded-full bg-[#ebf4ff] group-active:bg-[#99c3ff]">
          <span className="block size-[12px] rounded-[2px] bg-[#1e63f5]" />
        </div>
      ) : loading ? (
        <div className="flex size-[30px] items-center justify-center rounded-full bg-[#1e63f5]">
          <span className="block size-[10px] animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      ) : (
        <div className={`flex size-[30px] items-center justify-center overflow-hidden rounded-full ${canSend ? "bg-[#1e63f5] group-hover:bg-[#4788ff] group-active:bg-[#0e45cf]" : "bg-[#f2f2f2]"}`}>
          <img src={canSend ? "/assets/051ee.svg" : "/assets/9b290.svg"} alt="" />
        </div>
      )}
    </button>
  );
}

function ChatInput({ value, onChange, onSend, attachments, onAddFiles, onRemoveAttachment, hasProject = false, projectFiles, pptGeneration, onPptGenerationChange, pptMode, onPptModeChange, pptPages, onPptPagesChange, agentRunning = false, onStop, placeholder = "有问题，尽管问；/调用技能" }: {
  value: string;
  onChange: (v: string) => void;
  onSend: (text?: string, attachments?: ChatAttachment[]) => void;
  attachments: ChatAttachment[];
  onAddFiles: (files: File[]) => void;
  onRemoveAttachment: (id: string) => void;
  hasProject?: boolean;
  projectFiles?: ProjectFiles;
  pptGeneration: boolean;
  onPptGenerationChange: (selected: boolean) => void;
  pptMode: PptMode;
  onPptModeChange: (mode: PptMode) => void;
  pptPages: PptPageCount;
  onPptPagesChange: (pages: PptPageCount) => void;
  agentRunning?: boolean;
  onStop?: () => void;
  placeholder?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const pptToggleRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const moreTriggerRef = useRef<HTMLButtonElement>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [attachmentSource, setAttachmentSource] = useState<AttachmentSource | null>(null);
  const [settingsCollapsed, setSettingsCollapsed] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const hasText = value.trim().length > 0;
  const canSend = (hasText || attachments.length > 0) && attachments.every(attachment => attachment.status === "ready");

  useEffect(() => {
    if (!hasProject && attachmentSource === "项目资料") setAttachmentSource(null);
  }, [hasProject, attachmentSource]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const resize = () => {
      const maxHeight = Math.min(228, 328 - 24 - (attachments.length ? 64 : 0) - 36 - (toolbarRef.current?.offsetHeight ?? 38) - 2);
      el.style.height = "auto";
      el.style.maxHeight = maxHeight + "px";
      el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
    };
    resize();
    let width = el.clientWidth;
    const observer = new ResizeObserver(() => {
      if (el.clientWidth !== width) {
        width = el.clientWidth;
        resize();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, attachments.length, pptGeneration, settingsCollapsed]);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const toggle = pptToggleRef.current;
    const settings = settingsRef.current;
    if (!toolbar || !toggle || !settings) return;
    const update = () => {
      const available = toolbar.clientWidth - 16 - 30 - 32;
      const required = 30 + 8 + toggle.offsetWidth + (pptGeneration ? 8 + settings.offsetWidth : 0);
      const collapsed = pptGeneration && required > available;
      setSettingsCollapsed(collapsed);
      if (!collapsed) setMoreOpen(false);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(toolbar);
    observer.observe(toggle);
    observer.observe(settings);
    return () => observer.disconnect();
  }, [pptGeneration, pptMode, pptPages]);

  useEffect(() => {
    if (!moreOpen) return;
    const close = (event: MouseEvent) => {
      if (!moreTriggerRef.current?.contains(event.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [moreOpen]);

  useEffect(() => {
    if (!addMenuOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!addMenuRef.current?.contains(event.target as Node)) {
        setAddMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [addMenuOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend(value, attachments);
    }
  };

  return (
    <Popover open={attachmentSource !== null} onOpenChange={open => {
      if (!open) setAttachmentSource(null);
    }}>
    <PopoverAnchor asChild>
    <div className="relative w-full max-h-[328px] rounded-[20px] border border-[#e6e6e6] bg-white shadow-none">
      <div className="px-[12px] pt-[12px] pb-[12px]" onPointerDown={() => textareaRef.current?.focus()}>
        <AttachmentTray attachments={attachments} onRemove={onRemoveAttachment} />
        <textarea ref={textareaRef} value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKeyDown}
          onPaste={event => {
            const files = Array.from(event.clipboardData.items)
              .filter(item => item.kind === "file")
              .map(item => item.getAsFile())
              .filter((file): file is File => file !== null);
            if (files.length) onAddFiles(files);
          }}
          placeholder={placeholder} rows={1} style={{ minHeight: 22, maxHeight: 228 }}
          className="relative z-10 block w-full resize-none bg-transparent text-[14px] font-normal leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] placeholder:text-[rgba(0,0,0,0.26)] outline-none overflow-y-auto"
        />
        <div className="h-[36px]" />
      </div>
      <div ref={toolbarRef} className="px-[8px] pb-[8px] flex items-center gap-[32px]">
        <div className="relative flex min-w-0 items-center gap-[8px]">
        <div ref={addMenuRef} className="relative shrink-0">
          <button
            type="button"
            aria-label="添加内容"
            aria-haspopup="menu"
            aria-expanded={addMenuOpen}
            onClick={() => {
              setAddMenuOpen(open => !open);
              setAttachmentSource(null);
            }}
            className={`flex size-[30px] cursor-pointer items-center justify-center rounded-full border-0 ${addMenuOpen ? "bg-[#f2f2f2]" : "hover:bg-[#f7f7f7]"}`}
            title="添加内容"
          >
            <img src="/assets/afee9.svg" alt="" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".png,.jpg,.jpeg,.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.html,.eml,.msg"
            multiple
            onChange={event => {
              const files = Array.from(event.currentTarget.files ?? []);
              if (files.length) onAddFiles(files);
              event.currentTarget.value = "";
              setAddMenuOpen(false);
            }}
          />
          {addMenuOpen && (
            <OperationMenu anchor={addMenuRef.current?.querySelector(":scope > button") ?? null}
              gap={8}
              role="menu"
              aria-label="添加内容"
              onKeyDown={event => {
                if (event.key === "Escape") {
                  setAddMenuOpen(false);
                  addMenuRef.current?.querySelector("button")?.focus();
                }
              }}
              className="w-[192px] overflow-hidden rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]"
            >
              <div className="flex w-full flex-col py-[4px]">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    fileInputRef.current?.click();
                    setAddMenuOpen(false);
                  }}
                  className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left font-normal hover:bg-[#f2f2f2] focus-visible:bg-[#f2f2f2]"
                >
                  <img src="/assets/f811e.svg" alt="" className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">上传本地文件</span>
                </button>
                {([
                  { label: "从 OneDrive 中添加", icon: "d70fd", source: "OneDrive" },
                  { label: "从 Outlook 中添加", icon: "cc7e9", message: "Outlook 文件添加暂未接入" },
                  { label: "从产物中添加", icon: "ec778", source: "产物" },
                  { label: "从项目资料中添加", icon: "1d8f2", source: "项目资料" },
                  { label: "来源", icon: "29219", message: "来源功能暂未接入" },
                ] satisfies ({ label: string; icon: string } & ({ source: AttachmentSource } | { message: string }))[])
                  .filter(item => item.source !== "项目资料" || hasProject).map(item => (
                  <Fragment key={item.label}>
                    {item.label === "来源" && (
                      <div role="separator" className="relative h-0 w-full">
                        <img src="/assets/11020.svg" alt="" className="absolute -top-[0.5px] left-0 max-w-none" />
                      </div>
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAddMenuOpen(false);
                        if ("source" in item && item.source) {
                          setAttachmentSource(item.source);
                        } else {
                          toast.info(item.message);
                        }
                      }}
                      className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left font-normal hover:bg-[#f2f2f2] focus-visible:bg-[#f2f2f2]"
                    >
                      <img src={`/assets/${item.icon}.svg`} alt="" className="shrink-0" />
                      <span className="min-w-0 flex-1 truncate text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">{item.label}</span>
                      {item.label === "来源" && <img src="/assets/fb6a4.svg" alt="" className="shrink-0" />}
                    </button>
                  </Fragment>
                ))}
              </div>
            </OperationMenu>
          )}
        </div>
        <div ref={pptToggleRef} className="shrink-0">
          <PptGenerationToggle selected={pptGeneration} onChange={onPptGenerationChange} borderless />
        </div>
        <div ref={settingsRef} aria-hidden={!pptGeneration || settingsCollapsed} className={`flex w-max shrink-0 items-center gap-[8px] ${!pptGeneration || settingsCollapsed ? "invisible pointer-events-none absolute left-0 top-0" : ""}`}>
            <PptSettingPicker kind="mode" value={pptMode} onChange={onPptModeChange} />
            <PptSettingPicker kind="pages" value={pptPages} onChange={onPptPagesChange} />
        </div>
        {settingsCollapsed && (
          <button ref={moreTriggerRef} type="button" aria-label="更多设置" aria-haspopup="menu" aria-expanded={moreOpen} onClick={() => setMoreOpen(open => !open)} className="flex size-[30px] shrink-0 items-center justify-center rounded-full hover:bg-[#f7f7f7]">
            <img src="/assets/bbe3b.svg" alt="" />
          </button>
        )}
        {moreOpen && settingsCollapsed && (
          <OperationMenu anchor={moreTriggerRef.current} className="flex flex-col items-start gap-[8px] rounded-[12px] border border-[#f2f2f2] bg-white p-[8px] shadow-[0_0_12px_rgba(0,0,0,0.08)]">
            <PptSettingPicker kind="mode" value={pptMode} onChange={onPptModeChange} />
            <PptSettingPicker kind="pages" value={pptPages} onChange={onPptPagesChange} />
          </OperationMenu>
        )}
        </div>
        <SendButton
          canSend={canSend}
          agentRunning={agentRunning}
          onSend={() => onSend(value, attachments)}
          onStop={onStop}
        />
      </div>
    </div>
    </PopoverAnchor>
    {attachmentSource && (
      <AttachmentPicker
        source={attachmentSource}
        hasProject={hasProject}
        projectFiles={projectFiles}
        onSourceChange={setAttachmentSource}
        attachments={attachments}
        onAddFiles={onAddFiles}
        onRemove={onRemoveAttachment}
        onClose={() => textareaRef.current?.focus()}
      />
    )}
    </Popover>
  );
}

function HomeProjectPicker({ projects, selectedProjectId, onSelectProject, onCreateProject }: {
  projects: ProjectItem[];
  selectedProjectId: number | null;
  onSelectProject: (id: number | null) => void;
  onCreateProject: (project: Omit<ProjectItem, "id">) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const selectedProject = projects.find(project => project.id === selectedProjectId) ?? null;

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [menuOpen]);

  return (
    <>
      <div ref={pickerRef} className="relative w-full px-[16px]">
        {menuOpen && (
          <OperationMenu role="menu" anchor={pickerRef.current?.querySelector("button") ?? null} className="flex w-[232px] flex-col overflow-y-auto rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]">
            <div className="flex max-h-[470px] w-full shrink-0 flex-col overflow-x-hidden overflow-y-auto py-[4px]">
              {projects.length === 0 && (
                <div className="shrink-0 rounded-[8px] px-[8px] py-[11px] text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.38)]">
                  暂无项目
                </div>
              )}
              {projects.map(project => {
                const isSelected = selectedProjectId === project.id;
                return (
                  <button
                    key={project.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={isSelected}
                    onClick={() => {
                      onSelectProject(project.id);
                      setMenuOpen(false);
                    }}
                    className="flex w-full shrink-0 cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left hover:bg-[#f7f7f7]"
                  >
                    <img src="/assets/d95df.svg" alt="" className="shrink-0" />
                    <span className={`min-w-0 flex-1 truncate text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)] ${isSelected ? "font-medium" : "font-normal"}`}>
                      {project.name}
                    </span>
                    {isSelected && <img src="/assets/ecd73.svg" alt="" className="shrink-0" />}
                  </button>
                );
              })}
              <div className="relative h-0 w-full shrink-0">
                <img src="/assets/4b9c6.svg" alt="" className="absolute left-0 top-[-0.5px] max-w-none" />
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setCreateProjectOpen(true);
                }}
                className="flex w-full shrink-0 cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left hover:bg-[#f7f7f7]"
              >
                <img src="/assets/eede2.svg" alt="" className="shrink-0" />
                <span className="text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">新建项目</span>
              </button>
              {selectedProject && <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelectProject(null);
                  setMenuOpen(false);
                }}
                className="flex w-full shrink-0 cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left hover:bg-[#f7f7f7]"
              >
                <img src="/assets/92b7f.svg" alt="" className="shrink-0" />
                <span className="text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">不选择项目</span>
              </button>}
            </div>
          </OperationMenu>
        )}
        <div className="flex h-[40px] w-full items-center overflow-hidden rounded-t-[16px] bg-[#f7f7f7] py-[4px] pl-[8px] pr-[4px]">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(open => !open)}
            className={`flex min-w-0 cursor-pointer items-center gap-[8px] rounded-full px-[8px] py-[4px] transition-colors ${menuOpen ? "bg-[#e6e6e6]" : "hover:bg-[#e6e6e6]"}`}
          >
            <img src={selectedProject ? "/assets/6bcaa.svg" : "/assets/658f1.svg"} alt="" className="shrink-0" />
            <span className={`truncate font-['PingFang_SC:Regular'] text-[14px] font-normal leading-[22px] tracking-[0.014px] ${selectedProject ? "text-[rgba(0,0,0,0.88)]" : "text-[rgba(0,0,0,0.6)]"}`}>
              {selectedProject?.name ?? "选择项目"}
            </span>
          </button>
        </div>
      </div>
      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        onCreate={onCreateProject}
      />
    </>
  );
}

// ── header ────────────────────────────────────────────────────────────────────

function ChatHeader({ title, projectBreadcrumb, projectOverview, actions, sidebarOpen, onSidebarToggle, onNewChat, mobile = false }: {
  mobile?: boolean;
  title?: string;
  projectBreadcrumb?: { projectName: string; taskName: string; onSelectProject: () => void };
  projectOverview?: { name: string; onOpenProjects: () => void };
  actions?: React.ReactNode;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  onNewChat?: () => void;
}) {
  return (
    <div className="relative z-30 flex h-[48px] min-h-[48px] w-full shrink-0 items-center gap-[8px] bg-white px-[16px] py-0">
      {mobile ? (
        <>
          <SheetTrigger asChild>
            <button type="button" aria-label="展开导航" className="relative z-10 flex size-[24px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] p-[4px] hover:bg-[#f7f7f7]">
              <img alt="" src="/assets/81b0c.svg" />
            </button>
          </SheetTrigger>
          <button type="button" onClick={onNewChat} aria-label="新建对话" className="relative z-10 flex size-[24px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] p-[4px] hover:bg-[#f7f7f7]">
            <img alt="" src="/assets/200cc.svg" />
          </button>
        </>
      ) : !sidebarOpen && (
        <>
          <button className="relative z-10 flex size-[24px] shrink-0 cursor-pointer items-start rounded-[4px] p-[4px] hover:bg-[#f7f7f7]" onClick={onSidebarToggle} aria-label="展开侧边栏">
            <span aria-hidden className="relative size-[16px] shrink-0">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src="/assets/0c886.svg" />
            </span>
          </button>
          <button className="relative z-10 flex size-[24px] shrink-0 cursor-pointer items-start rounded-[4px] p-[4px] hover:bg-[#f7f7f7]" onClick={onNewChat} aria-label="新建对话">
            <span aria-hidden className="relative size-[16px] shrink-0">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src="/assets/a4798.svg" />
            </span>
          </button>
        </>
      )}
      {projectOverview ? (
        <div className={`absolute top-1/2 right-[88px] flex -translate-y-1/2 items-center gap-[8px] overflow-hidden ${sidebarOpen ? "left-[16px]" : "left-[96px]"}`}>
          <button type="button" onClick={projectOverview.onOpenProjects} className="shrink-0 cursor-pointer bg-transparent p-0 text-[14px] font-normal leading-[22px] text-[rgba(0,0,0,0.38)] hover:text-[rgba(0,0,0,0.88)]">项目</button>
          <span className="text-[12px] text-[rgba(0,0,0,0.26)]">/</span>
          <span className="truncate text-[14px] font-normal leading-[22px]">{projectOverview.name}</span>
        </div>
      ) : projectBreadcrumb ? (
        <div className={`absolute top-1/2 right-[88px] flex -translate-y-1/2 items-center gap-[8px] overflow-hidden ${sidebarOpen ? "left-[16px]" : "left-[96px]"}`}>
          <button type="button" onClick={projectBreadcrumb.onSelectProject} className="max-w-[240px] min-w-0 shrink cursor-pointer truncate rounded-[4px] font-['PingFang_SC:Regular'] text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.38)] hover:text-[rgba(0,0,0,0.88)] focus-visible:outline-2 focus-visible:outline-[#1e63f5]">
            {projectBreadcrumb.projectName}
          </button>
          <span className="shrink-0 font-['PingFang_SC:Regular'] text-[12px] font-normal leading-[20px] tracking-[0.012px] text-[rgba(0,0,0,0.26)]">/</span>
          <span className="max-w-[320px] min-w-0 shrink truncate font-['PingFang_SC:Regular'] text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">
            {projectBreadcrumb.taskName}
          </span>
        </div>
      ) : title ? (
        <p className="pointer-events-none absolute left-0 right-0 truncate px-[80px] text-center text-[14px] font-medium leading-[22px] text-[rgba(0,0,0,0.88)]">{title}</p>
      ) : null}
      <div className="flex-1" />
      {actions}
    </div>
  );
}

function TaskHeaderActions({ task, projects, artifacts, setHistory, setProjects, onLocateArtifact }: {
  task: HistoryItem;
  projects: ProjectItem[];
  artifacts: LocatedTaskArtifact[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  setProjects: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  onLocateArtifact: (artifact: LocatedTaskArtifact) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) return;
      if (triggerRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return;
      if (event.target instanceof Element && event.target.closest("[data-operation-menu]")) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

  const updateTask = (updates: Partial<HistoryItem>) => setHistory(items => items.map(item => item.id === task.id ? { ...item, ...updates } : item));

  return (
    <div className="relative z-10 flex shrink-0 items-center gap-[8px]">
      <TaskArtifactsButton
        artifacts={artifacts}
        onLocate={onLocateArtifact}
        onDownload={artifact => toast.success(`本地示例：开始下载${artifact.name}`)}
      />
      <button
        ref={triggerRef}
        type="button"
        aria-label="任务操作"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(open => !open)}
        className={`flex size-[24px] shrink-0 cursor-pointer items-start rounded-[4px] p-[4px] hover:bg-[#f7f7f7] ${menuOpen ? "bg-[#f7f7f7]" : ""}`}
      >
        <span aria-hidden className="relative size-[16px] shrink-0">
          <img alt="" className="absolute inset-0 block size-full max-w-none" src="/assets/bbe3b.svg" />
        </span>
      </button>
      {menuOpen && (
        <TaskOperationsMenu
          ref={menuRef}
          anchor={triggerRef.current}
          align="end"
          gap={4}
          task={task}
          projects={projects}
          onTogglePin={() => updateTask({ pinned: !task.pinned })}
          onRename={title => updateTask({ title })}
          onMove={projectId => updateTask({ projectId })}
          onCreateProject={() => setCreateProjectOpen(true)}
          onDelete={() => setHistory(items => items.filter(item => item.id !== task.id))}
          onClose={() => setMenuOpen(false)}
        />
      )}
      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        onCreate={project => {
          const id = Date.now();
          setProjects(current => [...current, { ...project, id }]);
          updateTask({ projectId: id });
        }}
      />
    </div>
  );
}

// ── views ─────────────────────────────────────────────────────────────────────

const SUGGESTIONS = ["找出近一周的邮件", "请帮我起草一封给团队的邮件", "总结下智能助手项目邮件"];

function HomeView({ input, onInputChange, onSend, attachments, onAddFiles, onRemoveAttachment, pptGeneration, onPptGenerationChange, pptMode, onPptModeChange, pptPages, onPptPagesChange, projects, selectedProjectId, onSelectProject, onCreateProject }: {
  input: string;
  onInputChange: (v: string) => void;
  onSend: (text?: string, attachments?: ChatAttachment[]) => void;
  attachments: ChatAttachment[];
  onAddFiles: (files: File[]) => void;
  onRemoveAttachment: (id: string) => void;
  pptGeneration: boolean; onPptGenerationChange: (selected: boolean) => void;
  pptMode: PptMode; onPptModeChange: (mode: PptMode) => void;
  pptPages: PptPageCount; onPptPagesChange: (pages: PptPageCount) => void;
  projects: ProjectItem[];
  selectedProjectId: number | null;
  onSelectProject: (id: number | null) => void;
  onCreateProject: (project: Omit<ProjectItem, "id">) => void;
}) {
  const selectedProject = projects.find(project => project.id === selectedProjectId);
  return (
    <div className="flex-1 min-h-0 bg-white flex flex-col overflow-hidden">
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      <div className="conversation-gutter relative flex-1 min-h-0">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-[756px] h-[400px] rounded bg-gradient-to-r from-[#a3ffff] to-[#1e63f5] opacity-10 blur-[100px]" />
        </div>
        <div className="conversation-content relative mx-auto flex h-full w-full flex-col items-center pt-[160px]">
          <div className="shrink-0 flex items-baseline gap-[8px] pb-[16px]">
            <span className="text-[46px] font-semibold leading-[56px] text-[rgba(0,0,0,0.88)] tracking-[0.046px]">Hi，xxxx</span>
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
          <div className="shrink-0 w-full shadow-none">
            <HomeProjectPicker
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={onSelectProject}
              onCreateProject={onCreateProject}
            />
            <ChatInput
              value={input}
              hasProject={Boolean(selectedProject)}
              projectFiles={selectedProject ? selectedProject.files ?? DEMO_PROJECT_FILES : undefined}
              onChange={onInputChange}
              onSend={onSend}
              attachments={attachments}
              onAddFiles={onAddFiles}
              onRemoveAttachment={onRemoveAttachment}
              pptGeneration={pptGeneration}
              onPptGenerationChange={onPptGenerationChange}
              pptMode={pptMode}
              onPptModeChange={onPptModeChange}
              pptPages={pptPages}
              onPptPagesChange={onPptPagesChange}
            />
          </div>
        </div>
      </div>
      <div className="flex h-[22px] shrink-0 items-center justify-center p-[4px] opacity-0">
        <span className="text-[10px] text-[rgba(0,0,0,0.26)]">内容由AI生成，仅供参考</span>
      </div>
    </div>
  );
}

const TRANSFER_MEMBERS = ["吴易奚", "吴易奚", "吴易奚", "吴易奚", "孙雨薇"];

function ProjectCard({ project, onOpen, onRename, onArchive, onDelete, onTransfer, menuOnly = false }: {
  project: ProjectItem;
  onOpen: () => void;
  onRename: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onTransfer?: (member: string) => void;
  menuOnly?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const closeTransferTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transferTriggerRef = useRef<HTMLButtonElement>(null);
  const members = TRANSFER_MEMBERS.filter(member => member.includes(memberSearch.trim()));

  useEffect(() => () => {
    if (closeTransferTimer.current) clearTimeout(closeTransferTimer.current);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!cardRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
        setTransferOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [menuOpen]);

  const openTransfer = () => {
    if (closeTransferTimer.current) clearTimeout(closeTransferTimer.current);
    setTransferOpen(true);
  };
  const deferCloseTransfer = () => {
    closeTransferTimer.current = setTimeout(() => setTransferOpen(false), 140);
  };
  const closeMenus = () => {
    setMenuOpen(false);
    setTransferOpen(false);
  };

  const menuItems = [
    { label: "重命名", icon: "/assets/e2b81.svg", action: onRename },
    { label: "归档", icon: "/assets/ae0d0.svg", action: onArchive },
    { label: "删除", icon: "/assets/5ff6b.svg", action: onDelete },
  ];

  return (
    <div ref={cardRef} className="relative min-w-0">
      {menuOnly ? (
        <button type="button" aria-label="项目操作" aria-haspopup="menu" aria-expanded={menuOpen} onClick={event => {
          setMenuAnchor(event.currentTarget);
          setMenuOpen(open => !open);
          setTransferOpen(false);
        }} className="flex size-[24px] cursor-pointer items-center justify-center rounded-[4px] hover:bg-[#f7f7f7]">
          <img src="/assets/f8bb9.svg" alt="" />
        </button>
      ) : <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen();
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`flex h-[74px] w-full cursor-pointer items-center gap-[12px] overflow-hidden rounded-[12px] border border-[#e6e6e6] p-[12px] text-left transition-colors ${
          hovered || menuOpen ? "bg-[#e6e6e6]" : "bg-white"
        }`}
      >
        <div className="flex size-[48px] shrink-0 items-center justify-center rounded-[8px] bg-[#f7f7f7]">
          <img src="/assets/0fc4d.svg" alt="" className="shrink-0" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center font-['PingFang_SC:Regular']">
          <p className="w-full truncate text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">
            {project.name}
          </p>
          <p className="w-full truncate text-[12px] font-normal leading-[20px] tracking-[0.012px] text-[rgba(0,0,0,0.38)]">
            {project.instruction || "暂无描述"}
          </p>
        </div>
        {(hovered || menuOpen) && (
          <button
            type="button"
            aria-label={`${project.name}更多操作`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={event => {
              event.stopPropagation();
              setMenuAnchor(event.currentTarget);
              setMenuOpen(open => !open);
              setTransferOpen(false);
            }}
            className="flex size-[24px] shrink-0 cursor-pointer items-start rounded-[4px] p-[4px] hover:bg-[rgba(0,0,0,0.06)]"
          >
            <img src="/assets/bbe3b.svg" alt="" className="shrink-0" />
          </button>
        )}
      </div>}

      {menuOpen && (
        <OperationMenu anchor={menuAnchor}
          role="menu"
          aria-label="项目操作"
          gap={menuOnly ? 8 : 0}
          onKeyDown={event => {
            if (event.key === "Escape") { closeMenus(); menuAnchor?.focus(); }
          }}
          className="w-[192px] overflow-visible rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]"
        >
          <div className="flex w-full flex-col py-[4px]">
            <button
              type="button"
              role="menuitem"
              onClick={() => { onRename(); closeMenus(); }}
              className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left hover:bg-[#f7f7f7]"
            >
              <img src="/assets/e2b81.svg" alt="" className="shrink-0" />
              <span className="font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">重命名</span>
            </button>
            <div className="relative" onMouseEnter={openTransfer} onMouseLeave={deferCloseTransfer}>
              <button
                type="button"
                role="menuitem"
                aria-haspopup="menu"
                aria-expanded={transferOpen}
                ref={transferTriggerRef}
                onClick={openTransfer}
                className={`flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left ${transferOpen ? "bg-[#f7f7f7]" : "hover:bg-[#f7f7f7]"}`}
              >
                <img src="/assets/65325.svg" alt="" className="shrink-0" />
                <span className="min-w-0 flex-1 font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">移交项目</span>
                <img src="/assets/fb6a4.svg" alt="" className="shrink-0" />
              </button>
              {transferOpen && (
                <OperationMenu submenu anchor={transferTriggerRef.current}
                  role="menu"
                  onMouseEnter={openTransfer}
                  onMouseLeave={deferCloseTransfer}
                  className="w-[224px] overflow-hidden rounded-[8px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.08)]"
                >
                  <div className="bg-white px-[16px] py-[4px]">
                    <label className="flex h-[32px] items-center gap-[8px] border-b border-[#1e63f5]">
                      <img src="/assets/16710.svg" alt="" className="shrink-0" />
                      <input
                        autoFocus
                        value={memberSearch}
                        onChange={event => setMemberSearch(event.target.value)}
                        placeholder="搜索"
                        className="min-w-0 flex-1 bg-transparent font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)] outline-none placeholder:text-[rgba(0,0,0,0.26)]"
                      />
                    </label>
                  </div>
                  <div className="max-h-[240px] overflow-y-auto px-[8px]">
                    {members.map((member, index) => (
                      <button
                        key={`${member}-${index}`}
                        type="button"
                        role="menuitem"
                        onClick={() => { onTransfer?.(member); closeMenus(); }}
                        className="flex w-[192px] cursor-pointer items-center rounded-[8px] px-[8px] py-[10px] hover:bg-[#f7f7f7]"
                      >
                        <span className="flex h-[24px] max-w-[144px] items-center gap-[4px] rounded-[16px] bg-[#f7f7f7] pl-[2px] pr-[8px]">
                          <span className="flex size-[20px] shrink-0 items-center justify-center rounded-full bg-[#1e63f5] font-['PingFang_SC:Regular'] text-[12px] leading-[20px] tracking-[0.012px] text-[rgba(255,255,255,0.98)]">
                            {getAvatarInitial(member)}
                          </span>
                          <span className="truncate font-['PingFang_SC:Regular'] text-[12px] leading-[20px] tracking-[0.012px] text-[rgba(0,0,0,0.6)]">
                            {member}
                          </span>
                        </span>
                      </button>
                    ))}
                    {members.length === 0 && <p className="px-[8px] py-[10px] text-[14px] text-[rgba(0,0,0,0.38)]">没有匹配的成员</p>}
                  </div>
                </OperationMenu>
              )}
            </div>
            {menuItems.slice(1).map(item => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => { item.action(); closeMenus(); }}
                className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left hover:bg-[#f7f7f7]"
              >
                <img src={item.icon} alt="" className="shrink-0" />
                <span className="font-['PingFang_SC:Regular'] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">{item.label}</span>
              </button>
            ))}
          </div>
        </OperationMenu>
      )}
    </div>
  );
}

function ProjectHeaderActions({ project, onRename, onTransfer, onArchive, onDelete, panelOpen, onTogglePanel }: {
  project: ProjectItem;
  onRename: (name: string) => void;
  onTransfer: (member: string) => void;
  onArchive: () => void;
  onDelete: () => void;
  panelOpen: boolean;
  onTogglePanel: () => void;
}) {
  const [name, setName] = useState<string | null>(null);
  return (
    <div className="relative flex shrink-0 items-center gap-[8px]">
      <ProjectCard project={project} menuOnly onOpen={() => {}} onRename={() => setName(project.name)} onTransfer={onTransfer} onArchive={onArchive} onDelete={onDelete} />
      <button type="button" aria-label={panelOpen ? "收起右侧边栏" : "展开右侧边栏"} aria-expanded={panelOpen} aria-controls="project-configuration" onClick={onTogglePanel} className="flex size-[24px] cursor-pointer items-center justify-center rounded-[4px] hover:bg-[#f7f7f7]">
        <img src="/assets/a8ef3.svg" alt="" />
      </button>
      <Dialog open={name !== null} onOpenChange={open => { if (!open) setName(null); }}>
        <DialogContent aria-describedby={undefined} className="w-[400px] max-w-[calc(100vw-32px)] rounded-[16px] p-[24px]">
          <DialogTitle>重命名项目</DialogTitle>
          <form onSubmit={event => { event.preventDefault(); if (name?.trim()) { onRename(name.trim()); setName(null); } }} className="flex flex-col gap-[16px]">
            <label className="flex flex-col gap-[8px] text-[14px] font-normal">
              项目名称
              <input autoFocus maxLength={15} value={name ?? ""} onChange={event => setName(event.target.value)} className="h-[40px] rounded-[8px] border border-[#e6e6e6] px-[12px] outline-none focus:border-[#1e63f5]" />
            </label>
            <div className="flex justify-end gap-[8px]">
              <button type="button" onClick={() => setName(null)} className="cursor-pointer rounded-[8px] border border-[#e6e6e6] px-[16px] py-[8px] text-[14px] font-normal">取消</button>
              <button type="submit" disabled={!name?.trim()} className="cursor-pointer rounded-[8px] bg-[#1e63f5] px-[16px] py-[8px] text-[14px] font-normal text-white disabled:opacity-40">确定</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectListView({ projects, onCreateProject, onSelectProject, onRenameProject, onArchiveProject, onDeleteProject }: {
  projects: ProjectItem[];
  onCreateProject: (project: Omit<ProjectItem, "id">) => void;
  onSelectProject: (id: number) => void;
  onRenameProject: (id: number, name: string) => void;
  onArchiveProject: (id: number) => void;
  onDeleteProject: (id: number) => void;
}) {
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  return (
    <>
      <main className="relative min-h-0 flex-1 overflow-y-auto bg-white px-[24px]">
        <div className="mx-auto flex min-h-full w-full max-w-[960px] flex-col">
          <header className="flex shrink-0 items-center gap-[12px] pb-[32px] pl-0 pr-0 pt-0">
            <h1 className="min-w-0 flex-1 font-['PingFang_SC:Medium'] text-[20px] font-medium leading-[28px] tracking-[0.02px] text-[rgba(0,0,0,0.88)]">
              项目
            </h1>
            <button
              type="button"
              onClick={() => setCreateProjectOpen(true)}
              className="flex shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-hidden rounded-[4px] bg-[#1e63f5] px-[16px] py-[5px] hover:bg-[#1554d1]"
            >
              <img src="/assets/c136c.svg" alt="" className="shrink-0" />
              <span className="whitespace-nowrap font-['PingFang_SC:Regular'] text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(255,255,255,0.98)]">
                新建项目
              </span>
            </button>
          </header>

          {projects.length === 0 ? (
            <div className="flex flex-1 items-center justify-center pb-[260px]">
              <div className="flex w-[320px] flex-col items-center justify-end">
                <div className="mb-[-80px] size-[320px] shrink-0 overflow-hidden">
                  <img src="/assets/8dc56.png" alt="" className="size-[320px] max-w-none object-cover" />
                </div>
                <div className="flex w-full flex-col items-center justify-center gap-[4px] pb-[32px]">
                  <p className="whitespace-nowrap font-['PingFang_SC:Medium'] text-[14px] font-medium leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.38)]">
                    暂无项目
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-[16px] overflow-visible pb-[24px] max-[900px]:grid-cols-2 max-[620px]:grid-cols-1">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={() => onSelectProject(project.id)}
                  onRename={() => {
                    const name = window.prompt("请输入新的项目名称", project.name)?.trim();
                    if (name) onRenameProject(project.id, name);
                  }}
                  onArchive={() => onArchiveProject(project.id)}
                  onDelete={() => onDeleteProject(project.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        onCreate={onCreateProject}
      />
    </>
  );
}

function ProjectHomeView({ project, projects, tasks, onSelectTask, onUpdateTask, onDeleteTask, onCreateProject, inputProps, onUpdateProject, configurationOpen }: {
  project: ProjectItem;
  configurationOpen: boolean;
  projects: ProjectItem[];
  tasks: HistoryItem[];
  onSelectTask: (id: number) => void;
  onUpdateTask: (id: number, updates: Partial<Pick<HistoryItem, "title" | "pinned" | "projectId">>) => void;
  onDeleteTask: (id: number) => void;
  onCreateProject: (project: Omit<ProjectItem, "id">) => number;
  inputProps: React.ComponentProps<typeof ChatInput>;
  onUpdateProject: (updates: Pick<ProjectItem, "instruction"> | Pick<ProjectItem, "members"> | Pick<ProjectItem, "files">) => void;
}) {
  const [instructionOpen, setInstructionOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [tab, setTab] = useState<"任务" | "来源" | "产物">("任务");
  const [taskMenu, setTaskMenu] = useState<{ id: number; anchor: HTMLButtonElement } | null>(null);
  const [renamingTask, setRenamingTask] = useState<{ id: number; title: string } | null>(null);
  const [pendingTaskMoveId, setPendingTaskMoveId] = useState<number | null>(null);
  const taskMenuRef = useRef<HTMLDivElement>(null);
  const menuTask = tasks.find(task => task.id === taskMenu?.id);
  const orderedTasks = [...tasks].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || (b.createdAt ?? b.id) - (a.createdAt ?? a.id));

  useEffect(() => {
    if (!taskMenu) return;
    const close = (event: PointerEvent) => {
      if (event.target instanceof Node && !taskMenu.anchor.contains(event.target) && !taskMenuRef.current?.contains(event.target)) setTaskMenu(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [taskMenu]);

  return (
    <div className="flex min-h-0 flex-1 items-start gap-[16px] bg-white px-[16px]">
      <div className="flex h-full min-w-0 flex-1 flex-col items-center">
        <div className="relative flex min-h-0 w-full flex-1 flex-col">
          <div className="flex h-[48px] shrink-0 items-center gap-[12px]">
            <div className="flex size-[48px] shrink-0 items-center justify-center rounded-[8px] bg-[#f7f7f7]">
              <img src="/assets/e5ea3.svg" alt="" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-bold leading-[24px] tracking-[0.016px] text-[rgba(0,0,0,0.88)]">{project.name}</p>
              <p className="truncate text-[12px] font-normal leading-[20px] tracking-[0.012px] text-[rgba(0,0,0,0.38)]">描述</p>
            </div>
          </div>
          <div role="tablist" aria-label="项目内容" className="flex h-[48px] shrink-0 items-end gap-[24px] border-b border-[#e6e6e6]">
            {(["任务", "来源", "产物"] as const).map(item => (
              <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => { setTab(item); setTaskMenu(null); }} className={`flex h-[48px] cursor-pointer items-center border-b-2 text-[16px] leading-[24px] tracking-[0.016px] ${tab === item ? "border-[#1e63f5] font-medium text-[#1e63f5]" : "border-transparent font-normal text-[rgba(0,0,0,0.6)]"}`}>{item}</button>
            ))}
          </div>
          <div role="tabpanel" aria-label={tab} className={`min-h-0 flex-1 ${tab === "任务" ? "-mx-[8px] overflow-y-auto pt-[12px]" : "flex flex-col"}`}>
            {tab !== "任务" ? (
              <ProjectFilesPanel key={tab} kind={tab === "来源" ? "sources" : "artifacts"} files={project.files ?? DEMO_PROJECT_FILES} onChange={files => onUpdateProject({ files })} />
            ) : orderedTasks.length > 0 ? (
              <div className="flex flex-col gap-[8px]">
                {orderedTasks.map(task => (
                  <div key={task.id} data-project-task={task.id} className={`group flex min-h-[40px] shrink-0 items-center gap-[12px] rounded-[8px] px-[8px] py-[8px] hover:bg-[#f2f2f2] focus-within:bg-[#f2f2f2] ${taskMenu?.id === task.id ? "bg-[#f2f2f2]" : ""}`}>
                    <button type="button" onClick={() => onSelectTask(task.id)} className="flex min-w-0 flex-1 cursor-pointer items-center gap-[12px] bg-transparent p-0 text-left text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">
                      <span className="truncate">{task.title}</span>
                      {task.pinned && <img src="/assets/896b2.svg" alt="已置顶" className="shrink-0" />}
                    </button>
                    <div className="relative flex h-[24px] min-w-[24px] shrink-0 items-center justify-end">
                      <time className={`text-[14px] font-normal leading-[22px] text-[rgba(0,0,0,0.26)] group-hover:invisible group-focus-within:invisible max-sm:hidden ${taskMenu?.id === task.id ? "invisible" : ""}`}>
                        {task.createdAt ? new Date(task.createdAt).toLocaleString("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : ""}
                      </time>
                      <button type="button" aria-label={`任务操作 ${task.title}`} aria-haspopup="menu" aria-expanded={taskMenu?.id === task.id} onClick={event => setTaskMenu(taskMenu?.id === task.id ? null : { id: task.id, anchor: event.currentTarget })} className={`absolute right-0 flex size-[24px] cursor-pointer items-center justify-center rounded-[4px] hover:bg-[#e6e6e6] group-hover:visible group-focus-within:visible [@media(hover:none)]:visible ${taskMenu?.id === task.id ? "visible" : "invisible"}`}>
                        <img src="/assets/bfc6f.svg" alt="" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[240px] flex-col items-center justify-center py-[24px] text-[14px] leading-[22px] text-[rgba(0,0,0,0.38)]">
                <img src="/assets/b7105.png" alt="" className="size-[180px] object-cover" />
                <p className="font-medium">暂无项目任务</p>
                <p>快去输入问题发起新的咨询</p>
              </div>
            )}
          </div>
          {tab === "任务" && <div className="mx-auto w-full max-w-[800px] shrink-0 px-[16px] pt-[16px] max-sm:px-0">
            <ChatInput {...inputProps} placeholder={`在“${project.name}”中开始对话`} />
          </div>}
        </div>
        <div className="h-[20px] shrink-0 p-[4px] opacity-0">
          <span className="text-[10px] text-[rgba(0,0,0,0.26)]">内容由AI生成，仅供参考</span>
        </div>
      </div>

      {configurationOpen && <div id="project-configuration" className="w-[320px] shrink-0 overflow-hidden rounded-[12px] border border-[#e6e6e6] max-[1000px]:hidden">
        <div className="relative flex flex-col gap-[8px] border-b border-[#e6e6e6] p-[16px]">
          <p className="text-[14px] font-bold leading-[24px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">指令</p>
          <button type="button" aria-label="编辑指令" onClick={() => setInstructionOpen(true)} className="absolute right-[16px] top-[16px] flex size-[24px] cursor-pointer items-center justify-center rounded-[4px] hover:bg-[#f7f7f7]">
            <img src="/assets/49891.svg" alt="" />
          </button>
          <p className="break-words whitespace-pre-wrap text-[12px] font-normal leading-[20px] tracking-[0.012px] text-[rgba(0,0,0,0.88)]">
            {project.instruction || "设定项目背景与规范，让 AI 与你高效协作"}
          </p>
        </div>
        <div className="relative flex flex-col gap-[8px] p-[16px]">
          <p className="text-[14px] font-bold leading-[24px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">成员</p>
          <button type="button" aria-label="添加成员" onClick={() => setMembersOpen(true)} className="absolute right-[16px] top-[16px] flex size-[24px] cursor-pointer items-center justify-center rounded-[4px] hover:bg-[#f7f7f7]">
            <img src="/assets/49891.svg" alt="" />
          </button>
          {project.members?.length ? (
            <div className="flex items-center py-[4px]">
              {project.members.slice(0, 8).map(member => (
                <span key={member.id} title={member.name} className="-mr-[8px] flex size-[24px] shrink-0 items-center justify-center rounded-full border border-white text-[12px] font-normal text-white" style={{ backgroundColor: member.color }}>{getAvatarInitial(member.name)}</span>
              ))}
              {project.members.length > 8 && <span className="ml-[8px] rounded-full border border-[#ebf4ff] px-[4px] text-[12px] text-[#1e63f5]">+{project.members.length - 8}</span>}
            </div>
          ) : <p className="font-['PingFang_SC:Regular'] text-[12px] font-normal leading-[20px] tracking-[0.012px] text-[rgba(0,0,0,0.38)]">协作者</p>}
        </div>
      </div>}
        {menuTask && taskMenu && (
          <OperationMenu ref={taskMenuRef} anchor={taskMenu.anchor} gap={4} role="menu" aria-label="项目任务操作" onKeyDown={event => {
            if (event.key === "Escape") { taskMenu.anchor.focus(); setTaskMenu(null); }
          }} className="w-[192px] rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col py-[4px]">
            {[
              { label: menuTask.pinned ? "取消置顶" : "置顶此对话", icon: menuTask.pinned ? "67fe6" : "4363a", action: () => onUpdateTask(menuTask.id, { pinned: !menuTask.pinned }) },
              { label: "重命名", icon: "e2b81", action: () => setRenamingTask({ id: menuTask.id, title: menuTask.title }) },
            ].map(item => (
              <button key={item.label} type="button" role="menuitem" onClick={() => { item.action(); setTaskMenu(null); }} className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left text-[14px] font-normal leading-[22px] hover:bg-[#f7f7f7]">
                <img src={`/assets/${item.icon}.svg`} alt="" className="shrink-0" />{item.label}
              </button>
            ))}
            <TaskProjectMoveMenu
              key={menuTask.id}
              projects={projects}
              projectId={menuTask.projectId}
              onMove={projectId => {
                onUpdateTask(menuTask.id, { projectId });
                setTaskMenu(null);
              }}
              onCreate={() => {
                setPendingTaskMoveId(menuTask.id);
                setTaskMenu(null);
              }}
            />
            <button type="button" role="menuitem" onClick={() => { onDeleteTask(menuTask.id); setTaskMenu(null); }} className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left text-[14px] font-normal leading-[22px] hover:bg-[#f7f7f7]">
              <img src="/assets/5ff6b.svg" alt="" className="shrink-0" />删除
            </button>
            </div>
          </OperationMenu>
        )}
        <CreateProjectDialog
          open={pendingTaskMoveId !== null}
          onOpenChange={open => { if (!open) setPendingTaskMoveId(null); }}
          onCreate={newProject => {
            const projectId = onCreateProject(newProject);
            if (pendingTaskMoveId !== null) onUpdateTask(pendingTaskMoveId, { projectId });
            setPendingTaskMoveId(null);
          }}
        />
        <Dialog open={renamingTask !== null} onOpenChange={open => { if (!open) setRenamingTask(null); }}>
          <DialogContent aria-describedby={undefined} className="w-[400px] max-w-[calc(100vw-32px)] rounded-[16px] p-[24px]">
            <DialogTitle>重命名任务</DialogTitle>
            <form onSubmit={event => {
              event.preventDefault();
              if (!renamingTask?.title.trim()) return;
              onUpdateTask(renamingTask.id, { title: renamingTask.title.trim() });
              setRenamingTask(null);
            }} className="flex flex-col gap-[16px]">
              <label className="flex flex-col gap-[8px] text-[14px] font-normal">
                任务名称
                <input autoFocus value={renamingTask?.title ?? ""} onChange={event => setRenamingTask(current => current ? { ...current, title: event.target.value } : null)} className="h-[40px] rounded-[8px] border border-[#e6e6e6] px-[12px] outline-none focus:border-[#1e63f5]" />
              </label>
              <div className="flex justify-end gap-[8px]">
                <button type="button" onClick={() => setRenamingTask(null)} className="cursor-pointer rounded-[8px] border border-[#e6e6e6] px-[16px] py-[8px] text-[14px] font-normal">取消</button>
                <button type="submit" disabled={!renamingTask?.title.trim()} className="cursor-pointer rounded-[8px] bg-[#1e63f5] px-[16px] py-[8px] text-[14px] font-normal text-white disabled:cursor-not-allowed disabled:opacity-40">确定</button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        {instructionOpen && <ProjectInstructionDialog instruction={project.instruction} onClose={() => setInstructionOpen(false)} onSave={instruction => { onUpdateProject({ instruction }); setInstructionOpen(false); }} />}
        {membersOpen && <ProjectMembersDialog members={project.members ?? []} onClose={() => setMembersOpen(false)} onSave={members => { onUpdateProject({ members }); setMembersOpen(false); }} />}
    </div>
  );
}

function ChatMessageRow({ msg, index, advance, onOpenPpt, onRegeneratePpt, onDownloadArtifact }: {
  msg: Message; index: number; advance: (i: number) => void;
  onOpenPpt?: () => void; onRegeneratePpt?: () => void;
  onDownloadArtifact: (artifact: TaskArtifact) => void;
}) {
  // messages without a running typewriter advance the reveal pointer on mount;
  // process messages advance via onGoalDone once their goal finishes typing
  const autoAdvance = msg.role === "user" || msg.role === "result" || (msg.role === "ai" && Boolean(msg.thinking));
  useEffect(() => { if (autoAdvance) advance(index); }, [autoAdvance, advance, index]);

  if (msg.role === "user") return (
    <div className="flex justify-end">
      <div className="user-message min-w-0 bg-[#f7f7f7] px-[12px] py-[8px] rounded-tl-[8px] rounded-br-[8px] rounded-bl-[8px]">
        {msg.text && <p className="text-[16px] leading-[26px] text-[rgba(0,0,0,0.88)] whitespace-pre-wrap break-words">{msg.text}</p>}
        {msg.attachments && msg.attachments.length > 0 && (
          <div className={`flex flex-wrap gap-[8px] ${msg.text ? "mt-[8px]" : ""}`}>
            {msg.attachments.map(attachment => (
              attachment.image ? (
                <img
                  key={attachment.id}
                  src={attachment.previewUrl}
                  alt={attachment.name}
                  title={attachment.name}
                  className="size-[56px] rounded-[8px] object-cover"
                />
              ) : (
                <div key={attachment.id} className="flex h-[56px] w-[200px] min-w-0 items-center gap-[8px] rounded-[8px] bg-white px-[8px]">
                  <img src={getAttachmentIcon(attachment.extension)} alt="" width="32" height="32" className="shrink-0" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[14px] leading-[22px]">{attachment.name}</span>
                    <span className="text-[12px] leading-[20px] text-[rgba(0,0,0,0.38)]">{attachment.extension.toUpperCase()} · {formatFileSize(attachment.size)}</span>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
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
        <div className="flex w-full flex-col gap-[12px]">
          <p className="text-[16px] leading-[26px] text-[rgba(0,0,0,0.88)] whitespace-pre-wrap"><Typewriter text={msg.text ?? ""} onDone={() => advance(index)} /></p>
          {msg.artifacts && msg.artifacts.length > 0 && (
            <div className="artifact-grid grid w-full gap-[12px]">
              {msg.artifacts.map(artifact => <ArtifactFileCard key={artifact.id} artifact={artifact} onDownload={onDownloadArtifact} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChatView({ conversationId, messages, input, onInputChange, onSend, attachments, onAddFiles, onRemoveAttachment, hasProject, projectFiles, showInput = true, onOpenPpt, onRegeneratePpt, pptGeneration, onPptGenerationChange, pptMode, onPptModeChange, pptPages, onPptPagesChange, agentRunning, onStop }: {
  conversationId: number | null;
  messages: Message[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: (text?: string, attachments?: ChatAttachment[]) => void;
  attachments: ChatAttachment[];
  onAddFiles: (files: File[]) => void;
  onRemoveAttachment: (id: string) => void;
  hasProject: boolean;
  projectFiles?: ProjectFiles;
  showInput?: boolean;
  onOpenPpt?: () => void; onRegeneratePpt?: () => void;
  pptGeneration: boolean; onPptGenerationChange: (selected: boolean) => void;
  pptMode: PptMode; onPptModeChange: (mode: PptMode) => void;
  pptPages: PptPageCount; onPptPagesChange: (pages: PptPageCount) => void;
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
        <div className="conversation-gutter min-h-full pt-[16px]">
          <div className="conversation-content mx-auto w-full">
            <div className="conversation-messages flex flex-col gap-[32px] py-[16px]">
              {messages.map((msg, i) => {
                if (i > revealed) return null;
                if (msg.role === "process" && taskComplete) {
                  return i === firstProcessIndex ? <MergedProcess key={i} presets={processPresets} /> : null;
                }
                return (
                  <div key={i} data-message-index={i} className="flex w-full flex-col">
                    <ChatMessageRow msg={msg} index={i} advance={advance} onOpenPpt={onOpenPpt} onRegeneratePpt={onRegeneratePpt} onDownloadArtifact={artifact => toast.success(`本地示例：开始下载${artifact.name}`)} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden={!showInput} className={`conversation-gutter shrink-0 transition-opacity duration-200 ${showInput ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="conversation-content mx-auto w-full">
            <ChatInput
              value={input}
              hasProject={hasProject}
              projectFiles={projectFiles}
              onChange={onInputChange}
              onSend={onSend}
              attachments={attachments}
              onAddFiles={onAddFiles}
              onRemoveAttachment={onRemoveAttachment}
              pptGeneration={pptGeneration}
              onPptGenerationChange={onPptGenerationChange}
              pptMode={pptMode}
              onPptModeChange={onPptModeChange}
              pptPages={pptPages}
              onPptPagesChange={onPptPagesChange}
              agentRunning={agentRunning}
              onStop={onStop}
            />
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
  const isMobile = useIsMobile(800);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pptGeneration, setPptGeneration] = useState(false);
  const [pptMode, setPptMode] = useState<PptMode>("PowerPoint");
  const [pptPages, setPptPages] = useState<PptPageCount>("智能匹配");
  const [stage, setStage] = useState<PptStage>("idle");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projectConfigurationOpen, setProjectConfigurationOpen] = useState(true);
  const [projectListOpen, setProjectListOpen] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<number | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const nextHistoryId = useRef(1);
  const activeRunId = useRef(0);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const attachmentsRef = useRef<ChatAttachment[]>([]);
  const uploadTimers = useRef(new Map<string, number>());
  const [dragActive, setDragActive] = useState(false);
  const dragDepth = useRef(0);

  const replaceAttachments = useCallback((next: ChatAttachment[]) => {
    attachmentsRef.current = next;
    setAttachments(next);
  }, []);

  const clearDraftAttachments = useCallback((revokePreviews: boolean) => {
    uploadTimers.current.forEach(timer => window.clearTimeout(timer));
    uploadTimers.current.clear();
    if (revokePreviews) {
      attachmentsRef.current.forEach(attachment => {
        if (attachment.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
      });
    }
    replaceAttachments([]);
  }, [replaceAttachments]);

  const handleRemoveAttachment = useCallback((id: string) => {
    const timer = uploadTimers.current.get(id);
    if (timer) window.clearTimeout(timer);
    uploadTimers.current.delete(id);
    const attachment = attachmentsRef.current.find(item => item.id === id);
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
    replaceAttachments(attachmentsRef.current.filter(item => item.id !== id));
  }, [replaceAttachments]);

  const handleAddFiles = useCallback((files: File[]) => {
    const accepted: File[] = [];
    let unsupportedCount = 0;
    let oversizedCount = 0;
    let emptyCount = 0;
    let overLimitCount = 0;

    files.forEach(file => {
      const validationError = getAttachmentValidationError(file);
      if (validationError === "format") {
        unsupportedCount += 1;
      } else if (validationError === "size") {
        oversizedCount += 1;
      } else if (validationError === "empty") {
        emptyCount += 1;
      } else if (attachmentsRef.current.length + accepted.length >= MAX_ATTACHMENTS) {
        overLimitCount += 1;
      } else {
        accepted.push(file);
      }
    });

    if (unsupportedCount) toast.error(`${unsupportedCount} 个文件的格式不支持`);
    if (oversizedCount) toast.error(`${oversizedCount} 个文件超过大小限制`);
    if (emptyCount) toast.error(`${emptyCount} 个空文件无法上传`);
    if (overLimitCount) toast.error(`最多上传 ${MAX_ATTACHMENTS} 个文件`);

    const added = accepted.map((file, index): ChatAttachment => {
      const extension = getAttachmentExtension(file.name);
      const image = ["png", "jpg", "jpeg"].includes(extension);
      return {
        id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
        file,
        name: file.name,
        size: file.size,
        extension,
        image,
        ...(image ? { previewUrl: URL.createObjectURL(file) } : {}),
        status: "uploading",
      };
    });

    if (!added.length) return;
    replaceAttachments([...attachmentsRef.current, ...added]);

    added.forEach(attachment => {
      const markProcessing = window.setTimeout(() => {
        uploadTimers.current.delete(attachment.id);
        replaceAttachments(attachmentsRef.current.map(item => (
          item.id === attachment.id ? { ...item, status: "processing" } : item
        )));
        const markReady = window.setTimeout(() => {
          uploadTimers.current.delete(attachment.id);
          replaceAttachments(attachmentsRef.current.map(item => (
            item.id === attachment.id ? { ...item, status: "ready" } : item
          )));
        }, 500);
        uploadTimers.current.set(attachment.id, markReady);
      }, 500);
      uploadTimers.current.set(attachment.id, markProcessing);
    });
  }, [replaceAttachments]);

  useEffect(() => () => {
    uploadTimers.current.forEach(timer => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    if (!isMobile) setMobileNavigationOpen(false);
  }, [isMobile]);

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

  useEffect(() => {
    if (selectedProjectId !== null && !projects.some(project => project.id === selectedProjectId)) {
      setSelectedProjectId(null);
    }
  }, [projects, selectedProjectId]);

  const activeTaskProjectId = history.find(item => item.id === activeHistoryId)?.projectId;
  useEffect(() => {
    if (activeHistoryId === null || !history.some(item => item.id === activeHistoryId)) return;
    setActiveProjectId(activeTaskProjectId ?? null);
  }, [activeHistoryId, activeTaskProjectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectHistory = (id: number) => {
    const item = history.find(i => i.id === id);
    if (!item) return;
    setMobileNavigationOpen(false);
    setStage("idle");
    setProjectListOpen(false);
    clearDraftAttachments(true);
    setInput("");
    setActiveHistoryId(id);
    setActiveProjectId(item.projectId ?? null);
    setSelectedProjectId(null);
    setMessages(item.messages);
  };

  const handleSelectProject = (id: number) => {
    setMobileNavigationOpen(false);
    activeRunId.current += 1;
    setMessages([]);
    clearDraftAttachments(true);
    setInput("");
    setPptGeneration(false);
    setStage("idle");
    setProjectListOpen(false);
    setActiveHistoryId(null);
    setActiveProjectId(id);
    setSelectedProjectId(null);
  };

  const handleSend = (suggestion?: string, sentAttachments: ChatAttachment[] = []) => {
    const text = (suggestion ?? input).trim();
    if (!text && !sentAttachments.length) return;
    if (sentAttachments.some(attachment => attachment.status !== "ready")) return;
    const targetProjectId = activeProjectId ?? selectedProjectId;
    const shouldGeneratePpt = pptGeneration || isPPTIntent(text);
    const runId = ++activeRunId.current;
    setInput("");
    clearDraftAttachments(false);
    setPptGeneration(false);
    const historyTitle = text || sentAttachments[0]?.name || "附件会话";
    // create a history entry when starting a brand-new conversation
    if (activeHistoryId === null) {
      const id = nextHistoryId.current++;
      setHistory(h => [{ id, title: historyTitle.slice(0, 20), createdAt: Date.now(), messages: [], ...(targetProjectId !== null ? { projectId: targetProjectId } : {}) }, ...h]);
      setActiveHistoryId(id);
      setActiveProjectId(targetProjectId);
    }
    setSelectedProjectId(null);
    const processText = text || "处理上传的文件";
    const initialProcess: Message = shouldGeneratePpt
      ? { role: "process", text: "", thinking: true, variant: "requirement" }
      : { role: "process", text: "", thinking: true, variant: "requirement", preset: buildQueryProcess(processText) };
    setMessages(prev => [...prev, { role: "user", text, attachments: sentAttachments }, initialProcess]);

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
          const artifacts = buildTaskArtifacts(processText);
          next.push(artifacts.length ? { role: "ai", text: "帮您整理好了", artifacts } : { role: "ai", text: "好的，我来帮您处理这个请求。" });
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
        next.push({ role: "result", text: "", artifacts: [{ id: `${Date.now()}-pptx`, name: PPT_ARTIFACT_NAME, extension: "pptx", size: "12.6M" }] });
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

  const handleNewChat = () => {
    setMobileNavigationOpen(false);
    activeRunId.current += 1;
    setMessages([]);
    clearDraftAttachments(true);
    setInput("");
    setPptGeneration(false);
    setPptMode("PowerPoint");
    setPptPages("智能匹配");
    setStage("idle");
    setProjectListOpen(false);
    setActiveHistoryId(null);
    setActiveProjectId(null);
    setSelectedProjectId(null);
  };
  const handleOpenProjects = () => {
    setMobileNavigationOpen(false);
    activeRunId.current += 1;
    setMessages([]);
    clearDraftAttachments(true);
    setInput("");
    setPptGeneration(false);
    setStage("idle");
    setProjectListOpen(true);
    setActiveHistoryId(null);
    setActiveProjectId(null);
    setSelectedProjectId(null);
  };
  const handleNewProjectTask = (projectId: number) => {
    handleNewChat();
    setSelectedProjectId(projectId);
  };
  const firstMessageTitle = messages[0]?.text || messages[0]?.attachments?.[0]?.name || "新对话";
  const chatTitle = messages.length > 0
    ? firstMessageTitle.slice(0, 20) + (firstMessageTitle.length > 20 ? "…" : "")
    : undefined;
  const activeProject = projects.find(project => project.id === activeProjectId) ?? null;
  const activeTask = history.find(item => item.id === activeHistoryId) ?? null;
  const activeTaskProject = projects.find(project => project.id === activeTask?.projectId);
  const activeTaskArtifacts: LocatedTaskArtifact[] = messages.flatMap((message, messageIndex) => (
    (message.artifacts ?? []).map(artifact => ({ ...artifact, messageIndex }))
  ));
  const handleLocateArtifact = (artifact: LocatedTaskArtifact) => {
    const row = document.querySelector<HTMLElement>(`[data-message-index="${artifact.messageIndex}"]`);
    const target = row?.querySelector<HTMLElement>(`[data-artifact-id="${artifact.id}"]`) ?? row;
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.animate([{ boxShadow: "0 0 0 2px #1e63f5" }, { boxShadow: "0 0 0 2px rgba(30,99,245,0)" }], { duration: 1600, easing: "ease-out" });
  };
  const isFileDrag = (event: React.DragEvent) => Array.from(event.dataTransfer.types).includes("Files");
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    dragDepth.current = 0;
    setDragActive(false);
    const files = Array.from(event.dataTransfer.files);
    if (files.length) handleAddFiles(files);
    else toast.error("暂不支持上传文件夹");
  };

  const sidebar = (
        <Sidebar
          history={history}
          setHistory={setHistory}
          projects={projects}
          setProjects={setProjects}
          mobile={isMobile}
          onClose={() => isMobile ? setMobileNavigationOpen(false) : setSidebarOpen(false)}
          onNewChat={handleNewChat}
          onOpenProjects={handleOpenProjects}
          onNewProjectTask={handleNewProjectTask}
          projectListOpen={projectListOpen}
          activeId={activeHistoryId}
          activeProjectId={activeProjectId}
          onSelect={handleSelectHistory}
          onSelectProject={handleSelectProject}
        />
  );

  return (
    <Sheet open={isMobile && mobileNavigationOpen} onOpenChange={setMobileNavigationOpen}>
    <div className="w-screen h-screen flex flex-row overflow-hidden">
      {!isMobile && sidebarOpen && sidebar}
      {isMobile && (
        <SheetContent side="left" aria-describedby={undefined} className="w-[240px] max-w-full gap-0 border-0 p-0 shadow-none sm:max-w-[240px] [&>button]:hidden">
          <SheetTitle className="sr-only">导航</SheetTitle>
          {sidebar}
        </SheetContent>
      )}
      {/* main content: header always at App level so sidebar can never affect it */}
      <div
        className="chat-layout relative z-20 flex min-h-0 min-w-[320px] flex-1 flex-col bg-white p-0"
        onDragEnter={event => {
          if (!isFileDrag(event)) return;
          event.preventDefault();
          dragDepth.current += 1;
          setDragActive(true);
        }}
        onDragOver={event => {
          if (!isFileDrag(event)) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
        }}
        onDragLeave={event => {
          if (!isFileDrag(event)) return;
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (!dragDepth.current) setDragActive(false);
        }}
        onDrop={handleDrop}
      >
        <ChatHeader
          title={chatTitle}
          projectOverview={activeProject && !activeTask && !projectListOpen ? { name: activeProject.name, onOpenProjects: handleOpenProjects } : undefined}
          actions={activeProject && !activeTask && !projectListOpen ? (
            <ProjectHeaderActions
              key={activeProject.id}
              project={activeProject}
              panelOpen={projectConfigurationOpen}
              onTogglePanel={() => setProjectConfigurationOpen(open => !open)}
              onRename={name => setProjects(current => current.map(project => project.id === activeProject.id ? { ...project, name } : project))}
              onTransfer={owner => {
                setProjects(current => current.map(project => project.id === activeProject.id ? { ...project, owner } : project));
                toast.success(`本地示例：项目已移交给${owner}`);
              }}
              onArchive={() => {
                setProjects(current => current.filter(project => project.id !== activeProject.id));
                setHistory(current => current.filter(task => task.projectId !== activeProject.id));
                handleOpenProjects();
              }}
              onDelete={() => {
                setProjects(current => current.filter(project => project.id !== activeProject.id));
                setHistory(current => current.filter(task => task.projectId !== activeProject.id));
                handleOpenProjects();
              }}
            />
          ) : activeTask && messages.length > 0 ? (
            <TaskHeaderActions
              key={activeTask.id}
              task={activeTask}
              projects={projects}
              artifacts={activeTaskArtifacts}
              setHistory={setHistory}
              setProjects={setProjects}
              onLocateArtifact={handleLocateArtifact}
            />
          ) : undefined}
          projectBreadcrumb={activeProject && activeTask ? { projectName: activeProject.name, taskName: activeTask.title, onSelectProject: () => handleSelectProject(activeProject.id) } : undefined}
          mobile={isMobile}
          sidebarOpen={!isMobile && sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(o => !o)}
          onNewChat={messages.length > 0 || activeProject !== null ? handleNewChat : undefined}
        />
        {projectListOpen
          ? <ProjectListView
              projects={projects}
              onSelectProject={handleSelectProject}
              onCreateProject={project => {
                const id = Date.now();
                setProjects(current => [...current, { ...project, id }]);
                handleSelectProject(id);
              }}
              onRenameProject={(id, name) => {
                setProjects(current => current.map(project => project.id === id ? { ...project, name } : project));
              }}
              onArchiveProject={id => {
                setProjects(current => current.filter(project => project.id !== id));
                setHistory(current => current.filter(item => item.projectId !== id));
              }}
              onDeleteProject={id => {
                setProjects(current => current.filter(project => project.id !== id));
                setHistory(current => current.filter(item => item.projectId !== id));
              }}
            />
          : messages.length > 0
            ? <ChatView
              conversationId={activeHistoryId}
              messages={messages}
              input={input}
              onInputChange={setInput}
              onSend={handleSend}
              attachments={attachments}
              onAddFiles={handleAddFiles}
              onRemoveAttachment={handleRemoveAttachment}
              showInput={stage !== "requirement" && stage !== "outline"}
              hasProject={Boolean(activeTaskProject)}
              projectFiles={activeTaskProject ? activeTaskProject.files ?? DEMO_PROJECT_FILES : undefined}
              onOpenPpt={() => setStage("preview")}
              onRegeneratePpt={handleOutlineConfirm}
              pptGeneration={pptGeneration}
              onPptGenerationChange={setPptGeneration}
              pptMode={pptMode}
              onPptModeChange={setPptMode}
              pptPages={pptPages}
              onPptPagesChange={setPptPages}
              agentRunning={messages.some(message => message.role === "process" && Boolean(message.thinking))}
              onStop={handleStop}
            />
          : activeProject
            ? <ProjectHomeView
                key={activeProject.id}
                project={activeProject}
                configurationOpen={projectConfigurationOpen}
                projects={projects}
                onCreateProject={project => {
                  const id = Date.now();
                  setProjects(current => [...current, { ...project, id }]);
                  return id;
                }}
                tasks={history.filter(task => task.projectId === activeProject.id)}
                onSelectTask={handleSelectHistory}
                onUpdateTask={(id, updates) => setHistory(current => current.map(task => task.id === id ? { ...task, ...updates } : task))}
                onDeleteTask={id => setHistory(current => current.filter(task => task.id !== id))}
                onUpdateProject={updates => setProjects(current => current.map(project => project.id === activeProject.id ? { ...project, ...updates } : project))}
                inputProps={{
                  hasProject: true,
                  projectFiles: activeProject.files ?? DEMO_PROJECT_FILES,
                  value: input,
                  onChange: setInput,
                  onSend: handleSend,
                  attachments,
                  onAddFiles: handleAddFiles,
                  onRemoveAttachment: handleRemoveAttachment,
                  pptGeneration,
                  onPptGenerationChange: setPptGeneration,
                  pptMode,
                  onPptModeChange: setPptMode,
                  pptPages,
                  onPptPagesChange: setPptPages,
                }}
              />
          : <HomeView
              input={input}
              onInputChange={setInput}
              onSend={handleSend}
              attachments={attachments}
              onAddFiles={handleAddFiles}
              onRemoveAttachment={handleRemoveAttachment}
              pptGeneration={pptGeneration}
              onPptGenerationChange={setPptGeneration}
              pptMode={pptMode}
              onPptModeChange={setPptMode}
              pptPages={pptPages}
              onPptPagesChange={setPptPages}
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onCreateProject={project => {
                const id = Date.now();
                setProjects(current => [...current, { ...project, id }]);
                setSelectedProjectId(id);
              }}
            />
        }
        {dragActive && (
          <div className="pointer-events-none absolute inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-[8px] rounded-[16px] border-2 border-dashed border-[#1e63f5] px-[40px] py-[32px] text-center text-[16px] text-[rgba(0,0,0,0.88)]">
              <span className="text-[28px] leading-none text-[#1e63f5]">+</span>
              <span>文件拖放到此处即可上传</span>
              <span className="text-[12px] text-[rgba(0,0,0,0.38)]">支持图片、PDF、Office 文档及常见文本文件</span>
            </div>
          </div>
        )}
      </div>
      {/* right-hand PPT viewer, shares the row with the chat column */}
      {stage === "preview" && <PptPanel onClose={() => setStage("idle")} />}
      {/* panels / preview (z-50, fixed) */}
      {/*  these stay here so they overlay regardless of sidebar */}

      <RequirementPanel
        visible={stage === "requirement"}
        onClose={resetPptFlow}
        onConfirm={handleRequirementConfirm}
        pptMode={pptMode}
        onPptModeChange={setPptMode}
        initialPages={pptPages}
        mainOffset={!isMobile && sidebarOpen ? 120 : 0}
      />
      <OutlinePanel
        visible={stage === "outline"}
        onClose={resetPptFlow}
        onConfirm={handleOutlineConfirm}
        mainOffset={!isMobile && sidebarOpen ? 120 : 0}
      />
    </div>
    <Toaster position="top-center" />
    </Sheet>
  );
}
