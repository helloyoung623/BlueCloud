import { useState } from "react";
import svgPpt from "@/imports/Ppt/svg-51inp52nxe";
import imgSlideCover from "@/imports/Ppt/04c6a7ef5a9380c6aec54ab5eed98e3167209a47.png";
import imgSlideInner from "@/imports/Ppt/aeb0902ca3b2ba4c3454b148a331f35084076f2c.png";

export const PPT_FILE_NAME = "文件名称.PPT";
const SLIDE_COUNT = 17;

// slide thumbnails cycle through the two imported renders; page 4 onward is still blank
const slideImage = (index: number) => (index === 0 ? imgSlideCover : index < 3 ? imgSlideInner : null);

// ── file card shown inside the completed AI message ───────────────────────────

function FileIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]">
      <div className="absolute inset-[6.52%_14.17%_6.52%_6.52%]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.3786 27.8261">
          <path d={svgPpt.p2e94d500} fill="url(#pptFileGrad)" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="pptFileGrad" x1="12.6893" x2="12.6893" y1="0" y2="27.8261">
              <stop stopColor="#FF9C72" />
              <stop offset="1" stopColor="#FF7A42" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute inset-[28.16%_6.52%_6.52%_79.39%]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.50896 20.9016"><path d={svgPpt.p39ca1c00} fill="#DA6437" /></svg>
      </div>
      <div className="absolute inset-[28.8%_37.15%_32.26%_23.91%]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.4594 12.4594"><path d={svgPpt.p2c6e1680} fill="white" fillOpacity="0.8" /></svg>
      </div>
      <div className="absolute inset-[28.8%_36.96%_52.62%_44.47%]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.94368 5.94368"><path d={svgPpt.p7238b80} fill="white" /></svg>
      </div>
    </div>
  );
}

function PptFileCard({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-[12px] w-full">
      <button onClick={onOpen} className="col-start-1 h-[50px] bg-[#f7f7f7] hover:bg-[#f2f2f2] transition-colors rounded-[8px] flex items-center gap-[8px] px-[8px] text-left cursor-pointer">
        <FileIcon />
        <div className="flex-1 min-w-0 flex flex-col">
          <p className="text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)] truncate font-normal">{PPT_FILE_NAME}</p>
          <p className="text-[12px] leading-[20px] tracking-[0.012px] text-[rgba(0,0,0,0.38)] truncate">PPT · 36M</p>
        </div>
      </button>
    </div>
  );
}

function IconButton({ path, viewBox, inset, onClick, label }: {
  path: string; viewBox: string; inset: string; onClick?: () => void; label: string;
}) {
  return (
    <button aria-label={label} onClick={onClick} className="relative size-[24px] rounded-[4px] hover:bg-[#f7f7f7] transition-colors cursor-pointer">
      <span className="absolute overflow-clip" style={{ inset: "4px" }}>
        <span className="absolute" style={{ inset }}>
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox={viewBox}><path d={path} fill="black" fillOpacity="0.6" /></svg>
        </span>
      </span>
    </button>
  );
}

export function PptResultMessage({ onOpen, onRegenerate }: { onOpen: () => void; onRegenerate?: () => void }) {
  const [copied, setCopied] = useState(false);
  const summary = `信息的分析报告 PPT 已经为您制作完成。\n这份 PPT 共 ${SLIDE_COUNT} 页，采用了专业、现代的商务风格，通过时间轴、图表和数据卡片等形式，清晰地梳理了历史、缴费趋势和核心权益`;
  return (
    <div className="w-full flex flex-col gap-[12px]">
      <div className="w-full flex flex-col gap-[12px]">
        <div className="text-[16px] leading-[26px] tracking-[0.16px] text-[rgba(0,0,0,0.88)]">
          <p className="mb-0">信息的分析报告 PPT 已经为您制作完成。</p>
          <p>这份 PPT 共 {SLIDE_COUNT} 页，采用了专业、现代的商务风格，通过时间轴、图表和数据卡片等形式，清晰地梳理了历史、缴费趋势和核心权益</p>
        </div>
        <PptFileCard onOpen={onOpen} />
      </div>
      <div className="flex items-center gap-[8px]">
        <IconButton label="重新生成" onClick={onRegenerate} path={svgPpt.p31ce5e00} viewBox="0 0 13.3333 13.3333" inset="8.33%" />
        <IconButton label={copied ? "已复制" : "复制"} onClick={() => { navigator.clipboard?.writeText(summary); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }} path={svgPpt.p2431f370} viewBox="0 0 13.3333 13.3333" inset="8.33%" />
        {copied && <span className="text-[12px] leading-[20px] text-[rgba(0,0,0,0.38)]">已复制</span>}
      </div>
    </div>
  );
}

// ── right-hand PPT preview panel ──────────────────────────────────────────────

function SlideThumb({ index, active, onClick }: { index: number; active: boolean; onClick: () => void }) {
  const src = slideImage(index);
  return (
    <button onClick={onClick} className="flex gap-[8px] items-start shrink-0 cursor-pointer text-left">
      <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.6)] text-center whitespace-nowrap w-[16px]">{index + 1}</span>
      <span className={`relative block h-[68px] w-[120px] rounded-[8px] ${src ? "" : "bg-white"}`}>
        <span aria-hidden className="absolute inset-0 rounded-[8px] overflow-hidden">
          {src ? <>
            <span className="absolute inset-0 bg-[#f7f7f7] rounded-[8px]" />
            <img alt="" className="absolute size-full max-w-none object-cover rounded-[8px]" src={src} />
          </> : null}
        </span>
        <span aria-hidden className={`absolute inset-0 pointer-events-none rounded-[8px] border-solid ${active ? "border-2 border-[#1c61f1]" : "border border-[#f2f2f2]"}`} />
      </span>
    </button>
  );
}

function HeaderTextButton({ path, viewBox, inset, label, onClick }: {
  path: string; viewBox: string; inset: string; label: string; onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="shrink-0 rounded-[4px] flex items-center gap-[8px] px-[4px] py-[3px] hover:bg-[#f7f7f7] transition-colors cursor-pointer">
      <span className="relative size-[16px] overflow-clip shrink-0">
        <span className="absolute" style={{ inset }}>
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox={viewBox}><path d={path} fill="black" fillOpacity="0.88" /></svg>
        </span>
      </span>
      <span className="text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)] text-center whitespace-nowrap">{label}</span>
    </button>
  );
}

export function PptPanel({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const src = slideImage(active);
  return (
    <div className="relative h-full shrink-0 w-[min(1000px,58%)] min-w-[420px] bg-white flex flex-col overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none border-l border-solid border-[#f2f2f2]" />
      {/* header */}
      <div className="relative shrink-0 h-[48px] flex items-center gap-[10px] px-[16px] py-[8px]">
        <div aria-hidden className="absolute inset-0 pointer-events-none border-b border-solid border-[#f2f2f2]" />
        <p className="flex-1 min-w-0 text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)] truncate">PPT文件名称</p>
        <HeaderTextButton label="放映" onClick={() => setPlaying(true)} path={svgPpt.p2d4a9180} viewBox="0 0 13.3333 13.3333" inset="8.33%" />
        <HeaderTextButton label="下载" path={svgPpt.p29d50f00} viewBox="0 0 14.6683 12.6681" inset="8.32% 4.16% 12.5% 4.17%" />
        <button aria-label="关闭" onClick={onClose} className="relative size-[24px] shrink-0 rounded-[4px] hover:bg-[#f7f7f7] transition-colors cursor-pointer">
          <span className="absolute overflow-clip" style={{ inset: "4px" }}>
            <span className="absolute inset-[17.59%]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.371 10.371"><path d={svgPpt.p28244cc0} fill="black" fillOpacity="0.88" /></svg>
            </span>
          </span>
        </button>
      </div>
      {/* body */}
      <div className="flex-1 min-h-0 flex items-stretch">
        <div className="shrink-0 self-stretch overflow-y-auto bg-[rgba(255,255,255,0.5)] flex flex-col gap-[12px] items-start p-[12px]">
          {Array.from({ length: SLIDE_COUNT }, (_, i) => (
            <SlideThumb key={i} index={i} active={i === active} onClick={() => setActive(i)} />
          ))}
        </div>
        <div className="flex-1 min-w-0 bg-[#f7f7f7] flex flex-col items-center justify-center px-[16px] py-[8px]">
          <div className="relative w-full max-h-full aspect-[85/48] rounded-[8px] shadow-[0px_0px_24px_0px_rgba(0,0,0,0.16)]">
            <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[8px] overflow-hidden">
              <div className="absolute inset-0 bg-white rounded-[8px]" />
              {src && <img alt="" className="absolute size-full max-w-none object-cover rounded-[8px]" src={src} />}
            </div>
            {!src && <div className="absolute inset-0 flex items-center justify-center text-[14px] leading-[22px] text-[rgba(0,0,0,0.26)]">第 {active + 1} 页</div>}
          </div>
        </div>
      </div>
      {/* 放映 full-screen mode */}
      {playing && (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center" onClick={() => setPlaying(false)}>
          <div className="relative w-[92%] max-w-[1280px] aspect-[85/48] bg-white rounded-[4px] overflow-hidden">
            {src ? <img alt="" className="size-full object-cover" src={src} />
              : <div className="size-full flex items-center justify-center text-[16px] text-[rgba(0,0,0,0.26)]">第 {active + 1} 页</div>}
          </div>
          <span className="absolute bottom-[24px] text-[12px] text-[rgba(255,255,255,0.5)]">点击任意处退出放映</span>
        </div>
      )}
    </div>
  );
}
