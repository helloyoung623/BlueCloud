import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import svgPaths from "@/imports/默认首页-1/svg-4ly00k0kqz";
import svgPanel from "@/imports/需求确认-1/svg-1yxmq1shfb";
import svgOutline from "@/imports/大纲/svg-fzbroqn38q";
import svgSidebar from "@/imports/历史对话操作项/svg-1dh84d0t2n";
import svgTask from "@/imports/任务执行过程/svg-tkwirjnqmk";
import imgStyle1 from "@/imports/需求确认-1/29d4a489057188d7298a9a9f8b923d2d9c630925.png";
import imgStyle2 from "@/imports/需求确认-1/f49f63a62b02589f759f36fc0961c6709a8e1bdf.png";
import imgStyle3 from "@/imports/需求确认-1/9b2936619dc23e46dde47ce229cadb09c1b911ab.png";
import imgEmpty from "@/imports/Frame427318236/9e55d93ab34e49b9baf8a7d585a49321a5312a43.png";

// ── types ─────────────────────────────────────────────────────────────────────

type Message = { role: "user" | "ai" | "process"; text: string; thinking?: boolean };
type PptStage = "idle" | "requirement" | "outline_generating" | "outline" | "ppt_generating" | "preview";

type OutlinePageContent =
  | { type: "text"; text: string }
  | { type: "list"; items: string[] };

type OutlinePage = { id: number; pageLabel: string; title: string; content: OutlinePageContent };

// ── helpers ───────────────────────────────────────────────────────────────────

const isPPTIntent = (t: string) => /ppt|演示|幻灯|slide/i.test(t) || t.includes("PPT");

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
      <button onClick={onConfirm} className="bg-[#1e63f5] text-white text-[14px] leading-[22px] px-[16px] py-[5px] rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity">
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
  const scrollRef = useRef<HTMLDivElement>(null);

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
            <div className="relative rounded-[8px] cursor-pointer col-span-1">
              <div aria-hidden className="absolute inset-0 rounded-[8px] border border-[#e6e6e6] pointer-events-none" />
              <div className="flex items-center justify-between px-[12px] py-[8px]">
                <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)]">更多</span>
                <svg width="12" height="10" viewBox="0 0 5.30321 9.19243" fill="none"><path d={svgPanel.p5e65780} fill="black" fillOpacity="0.38" /></svg>
              </div>
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

function OutlinePageCard({ page }: { page: OutlinePage }) {
  return (
    <div className="bg-[#f7f7f7] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-col gap-[8px] items-start p-[8px]">
        <p className="font-['PingFang_SC:Regular',sans-serif] leading-[20px] text-[12px] text-[rgba(0,0,0,0.38)] tracking-[0.012px] whitespace-nowrap">{page.pageLabel}</p>
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const aiInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible) { setPages(mockOutlinePages()); setShowAiEdit(false); }
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
          pages.map(p => <OutlinePageCard key={p.id} page={p} />)
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
            {!cancelled && <><span className="text-[#1e63f5] font-medium">{count}S</span><span className="text-[rgba(0,0,0,0.88)]"> 后自动确认</span></>}
          </p>
          {/* AI编辑 button */}
          <button onClick={handleAiEditClick}
            className="relative flex items-center gap-[8px] px-[16px] py-[5px] rounded-[8px] cursor-pointer hover:bg-[#f7f7f7] transition-colors">
            <div aria-hidden className="absolute inset-0 rounded-[8px] border border-[#e6e6e6] pointer-events-none" />
            <svg width="16" height="16" viewBox="0 0 14 14.6644" fill="none" className="shrink-0">
              <path d={svgOutline.p3fbfc4c0} fill="black" fillOpacity="0.88" />
            </svg>
            <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">AI编辑</span>
          </button>
          {/* 确认 button */}
          <button onClick={handleConfirm}
            className="bg-[#1e63f5] text-[rgba(255,255,255,0.98)] text-[14px] leading-[22px] tracking-[0.014px] px-[16px] py-[5px] rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity">
            确认
          </button>
        </div>
      </div>
    </SlidePanel>
  );
}

// ── PPT preview ───────────────────────────────────────────────────────────────

function PptPreview({ onClose }: { onClose: () => void }) {
  const slides = ["封面", "目录", "背景分析", "解决方案", "数据支撑", "实施路径", "团队介绍", "总结"];
  const [active, setActive] = useState(0);
  return (
    <div className="fixed inset-0 z-50 bg-[#1a1a1a] flex flex-col">
      <div className="shrink-0 h-[48px] flex items-center justify-between px-[20px] border-b border-[rgba(255,255,255,0.1)]">
        <span className="text-white text-[14px] font-medium">PPT 预览</span>
        <button onClick={onClose} className="text-[rgba(255,255,255,0.6)] hover:text-white text-[13px] px-[12px] py-[4px] rounded-[6px] border border-[rgba(255,255,255,0.2)] cursor-pointer">关闭预览</button>
      </div>
      <div className="flex-1 flex min-h-0">
        {/* thumbnail list */}
        <div className="w-[160px] shrink-0 border-r border-[rgba(255,255,255,0.1)] overflow-y-auto py-[12px] flex flex-col gap-[8px] px-[8px]">
          {slides.map((s, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`w-full rounded-[6px] border text-left px-[10px] py-[8px] text-[12px] cursor-pointer transition-colors ${i === active ? "border-[#1e63f5] bg-[rgba(30,99,245,0.15)] text-white" : "border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)] hover:border-[rgba(255,255,255,0.3)]"}`}
            >
              <div className="text-[10px] mb-[2px] opacity-50">第 {i + 1} 页</div>
              {s}
            </button>
          ))}
        </div>
        {/* main canvas */}
        <div className="flex-1 flex items-center justify-center p-[32px]">
          <div className="bg-white rounded-[8px] shadow-2xl flex items-center justify-center" style={{ width: "100%", maxWidth: 720, aspectRatio: "16/9" }}>
            <div className="text-center">
              <div className="text-[rgba(0,0,0,0.26)] text-[12px] mb-[8px]">第 {active + 1} 页</div>
              <div className="text-[28px] font-medium text-[rgba(0,0,0,0.88)]">{slides[active]}</div>
              <div className="text-[14px] text-[rgba(0,0,0,0.38)] mt-[8px]">PPT 内容区域</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
          <div aria-hidden className="absolute inset-0 rounded-[4px] border border-[#e6e6e6] pointer-events-none" />
          <svg width="16" height="15" viewBox="0 0 14.6667 15" fill="none" className="shrink-0">
            <path d={svgSidebar.p2e5a6e00} fill="black" fillOpacity="0.88" />
          </svg>
          <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">新任务</span>
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
                  <svg width="16" height="13" viewBox="0 0 12 12.6667" fill="none" className="shrink-0">
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

      {/* bottom — user info */}
      <div className="shrink-0 flex items-center px-[12px] py-[8px] bg-white">
        <div className="flex-1 min-w-0 flex items-center gap-[8px] px-[12px] py-[4px] rounded-[8px]">
          <div className="relative shrink-0 w-[24px] h-[24px] rounded-full bg-[#dcdcdc] border border-white overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="12" height="11" viewBox="0 0 9.5 10.5" fill="none">
                <path clipRule="evenodd" d={svgSidebar.p44b8000} fill="#5E5E5E" fillRule="evenodd" />
                <path d={svgSidebar.p16884000} fill="#5E5E5E" />
              </svg>
            </div>
          </div>
          <p className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap truncate">张三李四王麻子</p>
        </div>
      </div>
    </div>
  );
}

// ── chat input ────────────────────────────────────────────────────────────────

function ChatInput({ value, onChange, onSend }: { value: string; onChange: (v: string) => void; onSend: () => void }) {
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
    <div className="relative w-full rounded-[20px] bg-white" style={{ boxShadow: "0 0 12px rgba(0,0,0,0.08)", border: "1px solid #e6e6e6" }}>
      <div className="px-[12px] pt-[12px] pb-[12px]">
        <textarea ref={textareaRef} value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKeyDown}
          placeholder="有问题，尽管问；/调用技能" rows={1} style={{ minHeight: 22, maxHeight: 160 }}
          className="block w-full resize-none bg-transparent text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] placeholder:text-[rgba(0,0,0,0.26)] outline-none overflow-y-auto"
        />
        <div className="h-[36px]" />
      </div>
      <div className="px-[8px] pb-[8px] flex items-center gap-[8px]">
        <button className="shrink-0 w-[30px] h-[30px] rounded-full border border-[#f2f2f2] flex items-center justify-center hover:bg-[#f7f7f7]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d={svgPaths.p4063380} fill="black" fillOpacity="0.88" /></svg>
        </button>
        <div className="shrink-0 flex items-center gap-[4px] px-[8px] py-[4px] rounded-full border border-[#f2f2f2]">
          <svg width="16" height="16" viewBox="0 0 13.3333 13.3334" fill="none" className="shrink-0">
            <path d={svgPaths.p3302ed00} fill="black" fillOpacity="0.88" />
            <path d={svgPaths.p1868fc80} fill="black" fillOpacity="0.88" />
            <path d={svgPaths.p3aa3c200} fill="black" fillOpacity="0.88" />
          </svg>
          <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] whitespace-nowrap">来源</span>
        </div>
        <div className="shrink-0 flex items-center gap-[4px] px-[8px] py-[4px] rounded-full border border-[#f2f2f2]">
          <svg width="12" height="14" viewBox="0 0 12 13.3333" fill="none" className="shrink-0"><path d={svgPaths.p10161080} fill="black" fillOpacity="0.88" /></svg>
          <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] whitespace-nowrap">PPT生成</span>
        </div>
        <button onClick={() => hasText && onSend()}
          className={`ml-auto shrink-0 w-[30px] h-[30px] rounded-full flex items-center justify-center transition-colors ${hasText ? "bg-[#1e63f5] cursor-pointer" : "bg-[#f2f2f2] cursor-default"}`}
        >
          <svg width="14" height="14" viewBox="0 0 13.4784 13.4602" fill="none">
            <path d={svgPaths.p18714f00} fill={hasText ? "white" : "black"} fillOpacity={hasText ? "0.98" : "0.26"} />
          </svg>
        </button>
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

function HomeView({ input, onInputChange, onSend }: { input: string; onInputChange: (v: string) => void; onSend: () => void }) {
  return (
    <div className="flex-1 min-h-0 bg-white flex flex-col overflow-hidden">
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      <div className="relative flex-1 flex flex-col items-center px-[24px] min-h-0">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-[756px] h-[400px] rounded bg-gradient-to-r from-[#a3ffff] to-[#1e63f5] opacity-10 blur-[100px]" />
        </div>
        <div className="relative w-full max-w-[800px] flex flex-col items-center flex-1 pt-[160px] min-h-0">
          <div className="shrink-0 flex items-baseline gap-[8px] py-[32px]">
            <span className="text-[46px] font-medium leading-[56px] text-[rgba(0,0,0,0.88)] tracking-[0.046px]">Hi，xxxx</span>
            <span className="w-[16px] h-[4px] bg-[rgba(0,0,0,0.88)] self-end mb-[10px]" style={{ animation: "blink 1s step-end infinite" }} />
          </div>
          <div className="flex-1 flex flex-col items-center w-full">
            <div className="shrink-0 flex items-center gap-[8px] pt-[32px] pb-[20px]">
              <svg width="80" height="1" viewBox="0 0 80 1" fill="none"><path d="M0 0.5H80" stroke="url(#gl)" /><defs><linearGradient id="gl" x1="0" y1="1" x2="80" y2="1" gradientUnits="userSpaceOnUse"><stop stopOpacity="0" /><stop offset="1" stopOpacity="0.3" /></linearGradient></defs></svg>
              <span className="text-[14px] font-medium leading-[22px] text-[rgba(0,0,0,0.38)] whitespace-nowrap">试试这些</span>
              <svg width="80" height="1" viewBox="0 0 80 1" fill="none"><path d="M0 0.5H80" stroke="url(#gr)" /><defs><linearGradient id="gr" x1="0" y1="1" x2="80" y2="1" gradientUnits="userSpaceOnUse"><stop stopOpacity="0.3" /><stop offset="1" stopOpacity="0" /></linearGradient></defs></svg>
            </div>
            <div className="shrink-0 flex flex-wrap items-center justify-center gap-[12px]">
              {SUGGESTIONS.map((s, i) => (
                <button key={s} onClick={() => onInputChange(s)} className="flex items-center gap-[10px] px-[8px] py-[8px] bg-[#f7f7f7] hover:bg-[#f2f2f2] rounded-[8px] transition-colors cursor-pointer">
                  <AIIcon uid={`s${i}`} />
                  <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] whitespace-nowrap">{s}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="shrink-0 w-full"><ChatInput value={input} onChange={onInputChange} onSend={onSend} /></div>
        </div>
      </div>
      <div className="shrink-0 flex items-center justify-center p-[4px]">
        <span className="text-[10px] text-[rgba(0,0,0,0.26)]">内容由AI生成，仅供参考</span>
      </div>
    </div>
  );
}

function ChatView({ messages, input, onInputChange, onSend, showInput = true }: {
  messages: Message[]; input: string; onInputChange: (v: string) => void; onSend: () => void; showInput?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);
  return (
    <div className="flex-1 min-h-0 bg-white flex flex-col">
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      <div className="flex-1 flex flex-col items-center px-[24px] pb-0 min-h-0">
        <div className="w-full max-w-[800px] flex flex-col flex-1 min-h-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 pt-[16px]">
            <div className="flex flex-col gap-[32px] pb-[16px]">
              {messages.map((msg, i) => msg.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[680px] bg-[#f7f7f7] px-[12px] py-[8px] rounded-tl-[8px] rounded-br-[8px] rounded-bl-[8px]">
                    <p className="text-[16px] leading-[26px] text-[rgba(0,0,0,0.88)] whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                </div>
              ) : msg.role === "process" ? (
                <div key={i}><ExecutionProcess running={Boolean(msg.thinking)} /></div>
              ) : (
                <div key={i}>
                  {msg.thinking ? (
                    <div className="flex items-center gap-[6px] py-[4px]">
                      {[0, 200, 400].map(d => <span key={d} className="w-[6px] h-[6px] rounded-full bg-[rgba(0,0,0,0.26)] inline-block" style={{ animation: `blink 1s ${d}ms step-end infinite` }} />)}
                    </div>
                  ) : (
                    <p className="text-[16px] leading-[26px] text-[rgba(0,0,0,0.88)] whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div aria-hidden={!showInput} className={`shrink-0 w-full transition-opacity duration-200 ${showInput ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <ChatInput value={input} onChange={onInputChange} onSend={onSend} />
          </div>
        </div>
      </div>
      <div className="shrink-0 flex items-center justify-center p-[4px]">
        <span className="text-[10px] text-[rgba(0,0,0,0.26)]">内容由AI生成，仅供参考</span>
      </div>
    </div>
  );
}

// ── root ──────────────────────────────────────────────────────────────────────

function TaskIcon({ type }: { type: "search" | "read" | "spark" | "chevron" }) {
  const paths = type === "search" ? [svgTask.p3b5d3c00, svgTask.p313b1700] : type === "read" ? [svgTask.p27585af0, svgTask.p10b3d540, svgTask.p376ce200] : type === "spark" ? [svgTask.p313b1700] : [svgTask.p33898580];
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">{paths.map((d, i) => <path key={i} d={d} fill="black" fillOpacity="0.38" />)}</svg>;
}

function ExecutionProcess({ running }: { running: boolean }) {
  const [expanded, setExpanded] = useState(running);
  useEffect(() => { setExpanded(running); }, [running]);
  const actions = [
    { label: "理解演示目标与受众", icon: "spark" as const },
    { label: "检索可用的内容结构", icon: "search" as const },
    { label: running ? "正在整理演示需求" : "已整理出初步制作方案", icon: "read" as const },
  ];
  return (
    <div className="w-full max-w-[768px]">
      <button onClick={() => setExpanded(v => !v)} className="w-full flex items-center justify-between rounded-[8px] border border-[#f2f2f2] px-[16px] py-[12px] text-left hover:bg-[#fafafa]">
        <span className="flex items-center gap-[8px] text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)]">
          {running ? <motion.span className="size-[14px] rounded-full border border-[#1e63f5] border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 2, ease: "linear", repeat: Infinity }} /> : <span className="text-[#1e63f5] text-[16px] leading-none">✓</span>}
          {running ? "正在规划演示内容" : "执行过程"}
        </span>
        <span className={expanded ? "rotate-180 transition-transform" : "transition-transform"}><TaskIcon type="chevron" /></span>
      </button>
      {expanded && <div className="mt-[12px] flex flex-col gap-[12px] rounded-[8px] border border-[#f2f2f2] px-[16px] py-[12px]">
        <p className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.38)]">任务目标：生成符合演示场景、受众与风格要求的 PPT</p>
        {actions.map(({ label, icon }, index) => <div key={label} className="flex items-center gap-[8px] text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)]">
          {running && index === 2 ? <motion.span className="size-[14px] rounded-full border border-[#1e63f5] border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 2, ease: "linear", repeat: Infinity }} /> : <TaskIcon type={icon} />}
          <span className={running && index === 2 ? "text-[rgba(0,0,0,0.38)]" : ""}>{label}</span>
        </div>)}
      </div>}
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<PptStage>("idle");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const nextHistoryId = useRef(1);

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

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    // create a history entry when starting a brand-new conversation
    if (activeHistoryId === null) {
      const id = nextHistoryId.current++;
      setHistory(h => [{ id, title: text.slice(0, 20), messages: [] }, ...h]);
      setActiveHistoryId(id);
    }
    setMessages(prev => [...prev, { role: "user", text }, { role: "process", text: "", thinking: true }]);

    // AI returns summary first
    setTimeout(() => {
      if (isPPTIntent(text)) {
        setMessages(prev => {
          const next = [...prev];
          const idx = next.findLastIndex(m => m.role === "process" && m.thinking);
          if (idx !== -1) next[idx] = { ...next[idx], thinking: false };
          next.push({ role: "ai", text: "好的，我来帮您生成PPT。需要先确认演示场景、受众、页数和风格，以便提供针对性的内容结构。" });
          return next;
        });
        // panel appears after AI summary is shown
        setTimeout(() => setStage("requirement"), 400);
      } else {
        setMessages(prev => {
          const next = [...prev];
          const idx = next.findLastIndex(m => m.role === "process" && m.thinking);
          if (idx !== -1) next[idx] = { ...next[idx], thinking: false };
          next.push({ role: "ai", text: "好的，我来帮您处理这个请求。" });
          return next;
        });
      }
    }, 1200);
  };

  const handleRequirementConfirm = () => {
    setStage("outline_generating");
    setMessages(prev => [...prev, { role: "ai", text: "", thinking: true }]);
    setTimeout(() => {
      setMessages(prev => {
        const next = [...prev];
        const idx = next.findLastIndex(m => m.thinking);
        if (idx !== -1) next[idx] = { role: "ai", text: "需求已确认，大纲生成完成，请确认以下结构。" };
        return next;
      });
      setStage("outline");
    }, 1800);
  };

  const handleOutlineConfirm = () => {
    setStage("ppt_generating");
    setMessages(prev => [...prev, { role: "ai", text: "", thinking: true }]);
    setTimeout(() => {
      setMessages(prev => {
        const next = [...prev];
        const idx = next.findLastIndex(m => m.thinking);
        if (idx !== -1) next[idx] = { role: "ai", text: "PPT 已生成完成，正在为您打开预览…" };
        return next;
      });
      setStage("preview");
    }, 2000);
  };

  const handleNewChat = () => { setMessages([]); setInput(""); setStage("idle"); setActiveHistoryId(null); };
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
          ? <ChatView messages={messages} input={input} onInputChange={setInput} onSend={handleSend} showInput={stage !== "requirement" && stage !== "outline"} />
          : <HomeView input={input} onInputChange={setInput} onSend={handleSend} />
        }
      </div>
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
      {stage === "preview" && <PptPreview onClose={() => setStage("idle")} />}
    </div>
  );
}
