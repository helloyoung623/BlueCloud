import { useState, useRef, useEffect, useCallback } from "react";
import svgPaths from "@/imports/默认首页-1/svg-4ly00k0kqz";
import svgPanel from "@/imports/需求确认-1/svg-1yxmq1shfb";
import imgStyle1 from "@/imports/需求确认-1/29d4a489057188d7298a9a9f8b923d2d9c630925.png";
import imgStyle2 from "@/imports/需求确认-1/f49f63a62b02589f759f36fc0961c6709a8e1bdf.png";
import imgStyle3 from "@/imports/需求确认-1/9b2936619dc23e46dde47ce229cadb09c1b911ab.png";

// ── types ─────────────────────────────────────────────────────────────────────

type Message = { role: "user" | "ai"; text: string; thinking?: boolean };
type PptStage = "idle" | "requirement" | "outline_generating" | "outline" | "ppt_generating" | "preview";

type OutlinePage = {
  id: number;
  title: string;
  mode: "smart" | "visual";
  visualMode?: "auto" | "specified";
  chartType?: string;
};

type OutlineVersion = { id: number; pages: OutlinePage[] };

// ── helpers ───────────────────────────────────────────────────────────────────

const isPPTIntent = (t: string) => /ppt|演示|幻灯|slide/i.test(t) || t.includes("PPT");

function mockOutlinePages(): OutlinePage[] {
  return [
    { id: 1, title: "封面：项目名称 & 核心主题", mode: "smart" },
    { id: 2, title: "目录：内容结构概览", mode: "smart" },
    { id: 3, title: "背景与现状分析", mode: "visual", visualMode: "auto" },
    { id: 4, title: "核心问题与解决方案", mode: "smart" },
    { id: 5, title: "数据支撑：关键指标", mode: "visual", visualMode: "auto" },
    { id: 6, title: "实施路径与时间节点", mode: "visual", visualMode: "auto" },
    { id: 7, title: "团队介绍", mode: "smart" },
    { id: 8, title: "总结与行动建议", mode: "smart" },
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

function SlidePanel({ visible, onClose, children }: {
  visible: boolean; onClose: () => void; children: React.ReactNode;
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
    <>
      <div className="fixed inset-0 z-40" style={{ opacity: animIn ? 0.15 : 0, background: "#000", transition: "opacity .35s" }} onClick={onClose} />
      <div
        className="fixed left-1/2 z-50 flex flex-col bg-white rounded-[16px]"
        style={{
          width: 800, maxHeight: 560, bottom: 22,
          transform: `translateX(-50%) translateY(${animIn ? "0%" : "120%"})`,
          transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
          boxShadow: "0 0 12px rgba(0,0,0,0.08)", border: "1px solid #e6e6e6",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </>
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

function RequirementPanel({ visible, onClose, onConfirm }: {
  visible: boolean; onClose: () => void; onConfirm: () => void;
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
    <SlidePanel visible={visible} onClose={onClose}>
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

const CHART_TYPES = ["柱状图", "折线图", "饼图", "散点图", "漏斗图", "雷达图"];

function OutlinePageRow({ page, onChange, onInteract }: {
  page: OutlinePage;
  onChange: (p: OutlinePage) => void;
  onInteract: () => void;
}) {
  const isVisual = page.mode === "visual";
  return (
    <div className="flex flex-col gap-[8px] py-[10px] border-b border-[#f2f2f2] last:border-0">
      <div className="flex items-start gap-[12px]">
        <span className="shrink-0 w-[20px] h-[20px] rounded-full bg-[#f2f2f2] flex items-center justify-center text-[11px] text-[rgba(0,0,0,0.38)] font-medium mt-[1px]">{page.id}</span>
        <p className="flex-1 text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)]">{page.title}</p>
        {/* mode toggle */}
        <div className="shrink-0 flex items-center gap-[4px] rounded-[6px] p-[2px] bg-[#f7f7f7]" onClick={onInteract}>
          <button
            onClick={() => onChange({ ...page, mode: "smart" })}
            className={`text-[12px] leading-[20px] px-[8px] py-[2px] rounded-[4px] transition-colors cursor-pointer ${!isVisual ? "bg-white text-[rgba(0,0,0,0.88)] shadow-sm" : "text-[rgba(0,0,0,0.38)]"}`}
          >智能呈现</button>
          <button
            onClick={() => onChange({ ...page, mode: "visual", visualMode: page.visualMode || "auto" })}
            className={`text-[12px] leading-[20px] px-[8px] py-[2px] rounded-[4px] transition-colors cursor-pointer ${isVisual ? "bg-white text-[rgba(0,0,0,0.88)] shadow-sm" : "text-[rgba(0,0,0,0.38)]"}`}
          >可视化呈现</button>
        </div>
      </div>
      {/* visual sub-mode */}
      {isVisual && (
        <div className="ml-[32px] flex items-center gap-[8px] flex-wrap" onClick={onInteract}>
          <button
            onClick={() => onChange({ ...page, visualMode: "auto", chartType: undefined })}
            className={`text-[12px] leading-[20px] px-[10px] py-[2px] rounded-full border cursor-pointer transition-colors ${page.visualMode === "auto" ? "border-[#1e63f5] text-[#1e63f5]" : "border-[#e6e6e6] text-[rgba(0,0,0,0.6)]"}`}
          >智能匹配</button>
          <button
            onClick={() => onChange({ ...page, visualMode: "specified", chartType: page.chartType || "柱状图" })}
            className={`text-[12px] leading-[20px] px-[10px] py-[2px] rounded-full border cursor-pointer transition-colors ${page.visualMode === "specified" ? "border-[#1e63f5] text-[#1e63f5]" : "border-[#e6e6e6] text-[rgba(0,0,0,0.6)]"}`}
          >指定图形</button>
          {page.visualMode === "specified" && (
            <div className="flex items-center gap-[6px] flex-wrap">
              {CHART_TYPES.map(ct => (
                <button key={ct}
                  onClick={() => onChange({ ...page, chartType: ct })}
                  className={`text-[12px] leading-[20px] px-[10px] py-[2px] rounded-full border cursor-pointer transition-colors ${page.chartType === ct ? "border-[#1e63f5] bg-[#ebf4ff] text-[#1e63f5]" : "border-[#e6e6e6] text-[rgba(0,0,0,0.6)]"}`}
                >{ct}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OutlinePanel({ visible, onClose, onConfirm }: {
  visible: boolean; onClose: () => void; onConfirm: () => void;
}) {
  const [versions, setVersions] = useState<OutlineVersion[]>([]);
  const [currentVersionIdx, setCurrentVersionIdx] = useState(0);
  const [aiEditText, setAiEditText] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) {
      const initial: OutlineVersion = { id: 1, pages: mockOutlinePages() };
      setVersions([initial]);
      setCurrentVersionIdx(0);
    }
  }, [visible]);

  const handleConfirm = useCallback(() => onConfirm(), [onConfirm]);
  const { count, cancelled, cancel } = useCountdown(visible && versions.length > 0, 30, handleConfirm);

  const currentVersion = versions[currentVersionIdx];

  const updatePage = (page: OutlinePage) => {
    cancel();
    setVersions(vs => vs.map((v, i) => i === currentVersionIdx
      ? { ...v, pages: v.pages.map(p => p.id === page.id ? page : p) }
      : v
    ));
  };

  const handleAiEdit = () => {
    if (!aiEditText.trim()) return;
    cancel();
    setIsRegenerating(true);
    setAiEditText("");
    setTimeout(() => {
      const newVersion: OutlineVersion = {
        id: versions.length + 1,
        pages: mockOutlinePages().map(p => ({ ...p, title: p.title + (versions.length === 1 ? "（已优化）" : " v" + (versions.length + 1)) })),
      };
      setVersions(prev => {
        const next = [...prev, newVersion];
        setCurrentVersionIdx(next.length - 1);
        return next;
      });
      setIsRegenerating(false);
    }, 1500);
  };

  const showVersions = versions.length > 1;

  return (
    <SlidePanel visible={visible} onClose={onClose}>
      {/* header */}
      <div className="shrink-0 px-[16px] pt-[16px] pb-[8px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <span className="text-[16px] font-medium leading-[24px] text-[rgba(0,0,0,0.88)]">确认大纲</span>
            {showVersions && (
              <div className="flex items-center gap-[4px] rounded-[6px] p-[2px] bg-[#f7f7f7]">
                {versions.map((v, i) => (
                  <button key={v.id} onClick={() => { setCurrentVersionIdx(i); cancel(); }}
                    className={`text-[12px] leading-[20px] px-[8px] py-[1px] rounded-[4px] cursor-pointer transition-colors ${i === currentVersionIdx ? "bg-white text-[rgba(0,0,0,0.88)] shadow-sm" : "text-[rgba(0,0,0,0.38)]"}`}
                  >v{v.id}</button>
                ))}
              </div>
            )}
          </div>
          <CloseBtn onClick={onClose} />
        </div>
        <p className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.6)] mt-[2px]">确认后将生成 PPT，可对每页调整呈现方式</p>
      </div>

      {/* body */}
      <div ref={scrollRef} onScroll={cancel} onClick={cancel} className="flex-1 overflow-y-auto min-h-0 px-[16px] pb-[8px]">
        {isRegenerating ? (
          <div className="flex items-center justify-center py-[40px] gap-[8px] text-[14px] text-[rgba(0,0,0,0.38)]">
            <span className="animate-spin w-[16px] h-[16px] border-2 border-[#1e63f5] border-t-transparent rounded-full inline-block" />
            AI 正在优化大纲…
          </div>
        ) : currentVersion ? (
          currentVersion.pages.map(p => <OutlinePageRow key={p.id} page={p} onChange={updatePage} onInteract={cancel} />)
        ) : null}
      </div>

      {/* AI edit bar */}
      <div className="shrink-0 px-[16px] py-[10px] border-t border-[#f2f2f2] flex items-center gap-[8px]">
        <AIIcon uid="outline-edit" />
        <input
          value={aiEditText}
          onChange={e => setAiEditText(e.target.value)}
          onFocus={cancel}
          onKeyDown={e => e.key === "Enter" && handleAiEdit()}
          className="flex-1 text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] placeholder:text-[rgba(0,0,0,0.26)] outline-none bg-transparent"
          placeholder="描述你的修改需求，AI 将生成新版本…"
        />
        <button onClick={handleAiEdit} disabled={!aiEditText.trim() || isRegenerating}
          className={`text-[13px] leading-[20px] px-[12px] py-[3px] rounded-[6px] transition-colors cursor-pointer ${aiEditText.trim() ? "bg-[#1e63f5] text-white" : "bg-[#f2f2f2] text-[rgba(0,0,0,0.26)]"}`}
        >生成</button>
      </div>

      <PanelFooter count={count} cancelled={cancelled} onConfirm={handleConfirm} />
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

function ChatHeader({ title, onNewChat }: { title?: string; onNewChat?: () => void }) {
  return (
    <div className="absolute top-0 left-0 right-0 h-[48px] bg-white flex items-center gap-[8px] px-[16px] z-10">
      <button className="shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f7f7f7]">
        <svg width="20" height="20" viewBox="0 0 17.5 17.5" fill="none"><path d={svgPaths.p2861a580} fill="black" fillOpacity="0.6" /></svg>
      </button>
      <button className="shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f7f7f7]" onClick={onNewChat}>
        <svg width="20" height="20" viewBox="0 0 18.3333 18.75" fill="none"><path d={svgPaths.pad1cb00} fill="black" fillOpacity="0.6" /></svg>
      </button>
      {title && <p className="absolute left-0 right-0 text-center text-[14px] font-medium leading-[22px] text-[rgba(0,0,0,0.88)] truncate px-[80px] pointer-events-none">{title}</p>}
      <div className="flex-1" />
    </div>
  );
}

// ── views ─────────────────────────────────────────────────────────────────────

const SUGGESTIONS = ["找出近一周的邮件", "请帮我起草一封给团队的邮件", "总结下智能助手项目邮件"];

function HomeView({ input, onInputChange, onSend }: { input: string; onInputChange: (v: string) => void; onSend: () => void }) {
  return (
    <div className="relative w-full h-screen bg-white overflow-hidden flex flex-col">
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[756px] h-[400px] rounded bg-gradient-to-r from-[#a3ffff] to-[#1e63f5] opacity-10 blur-[100px]" />
      </div>
      <ChatHeader />
      <div className="flex-1 flex flex-col items-center px-[24px] pt-[48px] pb-0 min-h-0">
        <div className="w-full max-w-[800px] flex flex-col items-center flex-1 pt-[200px] min-h-0">
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

function ChatView({ messages, input, onInputChange, onSend, onNewChat }: {
  messages: Message[]; input: string; onInputChange: (v: string) => void; onSend: () => void; onNewChat: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);
  const title = messages[0]?.text.slice(0, 20) + (messages[0]?.text.length > 20 ? "…" : "");
  return (
    <div className="relative w-full h-screen bg-white overflow-hidden flex flex-col">
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      <ChatHeader title={title} onNewChat={onNewChat} />
      <div className="flex-1 flex flex-col items-center pt-[48px] px-[24px] pb-0 min-h-0">
        <div className="w-full max-w-[800px] flex flex-col flex-1 min-h-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 py-[16px]">
            <div className="flex flex-col gap-[32px]">
              {messages.map((msg, i) => msg.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[680px] bg-[#f7f7f7] px-[12px] py-[8px] rounded-tl-[8px] rounded-br-[8px] rounded-bl-[8px]">
                    <p className="text-[16px] leading-[26px] text-[rgba(0,0,0,0.88)] whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                </div>
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
          <div className="shrink-0 pb-[8px]"><ChatInput value={input} onChange={onInputChange} onSend={onSend} /></div>
        </div>
      </div>
      <div className="shrink-0 flex items-center justify-center p-[4px]">
        <span className="text-[10px] text-[rgba(0,0,0,0.26)]">内容由AI生成，仅供参考</span>
      </div>
    </div>
  );
}

// ── root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("生成PPT");
  const [stage, setStage] = useState<PptStage>("idle");

  const resetPptFlow = useCallback(() => setStage("idle"), []);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text }, { role: "ai", text: "", thinking: true }]);

    // AI returns summary first
    setTimeout(() => {
      if (isPPTIntent(text)) {
        setMessages(prev => {
          const next = [...prev];
          const idx = next.findLastIndex(m => m.thinking);
          if (idx !== -1) next[idx] = { role: "ai", text: "好的，我来帮您生成PPT。需要先确认演示场景、受众、页数和风格，以便提供针对性的内容结构。" };
          return next;
        });
        // panel appears after AI summary is shown
        setTimeout(() => setStage("requirement"), 400);
      } else {
        setMessages(prev => {
          const next = [...prev];
          const idx = next.findLastIndex(m => m.thinking);
          if (idx !== -1) next[idx] = { role: "ai", text: "好的，我来帮您处理这个请求。" };
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

  const handleNewChat = () => { setMessages([]); setInput(""); setStage("idle"); };

  return (
    <>
      {messages.length > 0
        ? <ChatView messages={messages} input={input} onInputChange={setInput} onSend={handleSend} onNewChat={handleNewChat} />
        : <HomeView input={input} onInputChange={setInput} onSend={handleSend} />
      }

      <RequirementPanel
        visible={stage === "requirement"}
        onClose={resetPptFlow}
        onConfirm={handleRequirementConfirm}
      />
      <OutlinePanel
        visible={stage === "outline"}
        onClose={resetPptFlow}
        onConfirm={handleOutlineConfirm}
      />
      {stage === "preview" && <PptPreview onClose={() => setStage("idle")} />}
    </>
  );
}
