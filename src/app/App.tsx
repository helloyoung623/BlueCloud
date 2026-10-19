import { useState, useEffect } from "react";
import svgPpt from "@/imports/Ppt生成/svg-jn8tuqkhjb";
import svgNeed from "@/imports/需求确认/svg-svleeoz2dz";
import imgImage4 from "@/imports/需求确认/29d4a489057188d7298a9a9f8b923d2d9c630925.png";
import imgImage5 from "@/imports/需求确认/f49f63a62b02589f759f36fc0961c6709a8e1bdf.png";
import imgImage6 from "@/imports/需求确认/9b2936619dc23e46dde47ce229cadb09c1b911ab.png";

// ── shared sub-components ────────────────────────────────────────────────────

function UserMessage() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex items-start justify-center max-w-[680px] px-[12px] py-[8px] relative rounded-bl-[8px] rounded-br-[8px] rounded-tl-[8px] shrink-0">
      <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[26px] max-w-[656px] min-w-px not-italic overflow-hidden relative text-[16px] text-[rgba(0,0,0,0.88)] text-ellipsis">
        生成PPT
      </p>
    </div>
  );
}

function UserMessageDefault() {
  return (
    <div className="content-stretch flex gap-[12px] items-center max-w-[680px] relative shrink-0">
      <UserMessage />
    </div>
  );
}

function ArrowChevron({ svgPaths }: { svgPaths: typeof svgPpt }) {
  return (
    <div className="h-[22px] relative shrink-0 w-[16px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[16px] top-1/2">
        <div className="absolute flex inset-[23.48%_33.8%_23.48%_33.79%] items-center justify-center" style={{ containerType: "size" }}>
          <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
            <div className="relative size-full">
              <svg className="absolute block inset-0 size-full" fill="none" height="8.48533" preserveAspectRatio="none" viewBox="0 0 5.18533 8.48533" width="5.18533">
                <path d={svgPaths.p13a1fe00} fill="black" fillOpacity="0.38" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentCard({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="relative rounded-[8px] shrink-0 w-full cursor-pointer"
      onClick={onClick}
    >
      <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center px-[16px] py-[12px] relative size-full">
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
              <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-px not-italic relative text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px]">
                {`{一个卡片就是一个agent，不显示agent名字，显示它解决什么问题}`}
              </p>
              <ArrowChevron svgPaths={svgPpt} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReActBlock({ onAgentClick }: { onAgentClick?: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start justify-center relative rounded-[8px] shrink-0 w-full">
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-[min-content]">
        {`{任务目标:XXXXXXX}`}
      </p>
      <AgentCard onClick={onAgentClick} />
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-[min-content]">
        需要澄清演示场景、受众、页数和风格，或者其他说明；以便提供针对性的结构化描述
      </p>
    </div>
  );
}

function SourceBadge() {
  return (
    <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative rounded-[999999px] shrink-0">
      <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[999999px]" />
      <div className="relative shrink-0 size-[16px]">
        <div className="absolute inset-[8.33%]">
          <svg className="absolute block inset-0 size-full" fill="none" height="13.3334" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3334" width="13.3333">
            <g>
              <path d={svgPpt.p3302ed00} fill="black" fillOpacity="0.88" />
              <path d={svgPpt.p1868fc80} fill="black" fillOpacity="0.88" />
              <path d={svgPpt.p3aa3c200} fill="black" fillOpacity="0.88" />
            </g>
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.014px] whitespace-nowrap">
        来源
      </p>
    </div>
  );
}

function ChatInput({ sendEnabled }: { sendEnabled?: boolean }) {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        {/* text area */}
        <div className="bg-white relative shrink-0 w-full">
          <div className="overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex flex-col gap-[8px] items-start pb-[48px] pt-[12px] px-[12px] relative size-full">
              <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.26)] tracking-[0.014px] whitespace-nowrap">
                有问题，尽管问；/调用技能
              </p>
            </div>
          </div>
        </div>
        {/* toolbar */}
        <div className="bg-white relative shrink-0 w-full">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[8px] items-center p-[8px] relative size-full">
              {/* + button */}
              <div className="relative shrink-0 size-[30px]">
                <div className="absolute left-0 rounded-[999999px] top-0">
                  <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[999999px]" />
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[4px] items-center p-[7px] relative size-full">
                      <div className="overflow-clip relative shrink-0 size-[16px]">
                        <div className="absolute inset-[12.5%]">
                          <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
                            <path d={svgPpt.p4063380} fill="black" fillOpacity="0.88" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <SourceBadge />
              {/* PPT生成 button */}
              <button className="cursor-pointer relative rounded-[999999px] shrink-0">
                <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[999999px]" />
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative size-full">
                    <div className="overflow-clip relative shrink-0 size-[16px]">
                      <div className="absolute inset-[8.33%_12.5%]">
                        <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 12 13.3333" width="12">
                          <path d={svgPpt.p10161080} fill="black" fillOpacity="0.88" />
                        </svg>
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.014px] whitespace-nowrap">
                      PPT生成
                    </p>
                  </div>
                </div>
              </button>
              {/* send button */}
              <div className={`absolute ${sendEnabled ? "bg-[#ebf4ff]" : "bg-[#f2f2f2]"} overflow-clip right-[8px] rounded-[999999px] size-[30px] top-[8px]`}>
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[16px] top-1/2">
                  <div className="absolute inset-[9.45%_9.31%_6.42%_6.45%]">
                    <svg className="absolute block inset-0 size-full" fill="none" height="13.4602" preserveAspectRatio="none" viewBox="0 0 13.4784 13.4602" width="13.4784">
                      <path d={svgPpt.p18714f00} fill="black" fillOpacity="0.26" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.08)]" />
    </div>
  );
}

function ChatHeader() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[48px] items-center left-0 overflow-clip px-[16px] py-[8px] right-0 top-0">
      {/* L Action bar */}
      <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
        <div className="relative rounded-[4px] shrink-0 size-[32px]">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
              <div className="overflow-clip relative shrink-0 size-[20px]">
                <div className="absolute inset-[6.25%]">
                  <svg className="absolute block inset-0 size-full" fill="none" height="17.5" preserveAspectRatio="none" viewBox="0 0 17.5 17.5" width="17.5">
                    <path d={svgPpt.p2861a580} fill="black" fillOpacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative rounded-[4px] shrink-0 size-[32px]">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
              <div className="overflow-clip relative shrink-0 size-[20px]">
                <div className="absolute inset-[0_0_6.25%_8.33%]">
                  <svg className="absolute block inset-0 size-full" fill="none" height="18.75" preserveAspectRatio="none" viewBox="0 0 18.3333 18.75" width="18.3333">
                    <path d={svgPpt.pad1cb00} fill="black" fillOpacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* title */}
      <div className="-translate-y-1/2 absolute content-stretch flex gap-[4px] items-center justify-center left-0 overflow-clip right-0 rounded-[4px] top-1/2">
        <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-ellipsis tracking-[0.014px] whitespace-nowrap">
          标题标题标题标题
        </p>
        <div className="relative rounded-[4px] shrink-0 size-[24px]">
          <div className="content-stretch flex items-start p-[4px] relative size-full">
            <div className="flex-[1_0_0] h-full min-w-px overflow-clip relative">
              <div className="absolute inset-[41.67%_12.5%]">
                <svg className="absolute block inset-0 size-full" fill="none" height="2.66667" preserveAspectRatio="none" viewBox="0 0 12 2.66667" width="12">
                  <path d={svgPpt.p152a4f80} fill="black" fillOpacity="0.38" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[rgba(255,255,255,0)] flex-[1_0_0] h-[28px] min-w-px relative" />
      <div className="content-stretch flex gap-[8px] items-center relative shrink-0 size-[32px]" />
    </div>
  );
}

// ── requirement confirmation modal ───────────────────────────────────────────

function StyleOption({
  label,
  image,
  selected,
  onClick,
}: {
  label: string;
  image?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="justify-self-stretch relative rounded-[8px] self-start shrink-0 cursor-pointer"
      onClick={onClick}
    >
      <div aria-hidden className={`absolute border ${selected ? "border-[#1e63f5]" : "border-[#e6e6e6]"} border-solid inset-0 pointer-events-none rounded-[8px]`} />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">
            {label}
          </p>
          {image && (
            <div className="absolute h-[22px] right-[8px] rounded-[4px] top-[8px] w-[39px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={image} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="flex-[1_0_0] min-w-px relative rounded-[8px] cursor-pointer"
      onClick={onClick}
    >
      <div aria-hidden className={`absolute border ${selected ? "border-[#1e63f5]" : "border-[#e6e6e6]"} border-solid inset-0 pointer-events-none rounded-[8px]`} />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function GridSelectOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="justify-self-stretch relative rounded-[8px] self-start shrink-0 cursor-pointer"
      onClick={onClick}
    >
      <div aria-hidden className={`absolute border ${selected ? "border-[#1e63f5]" : "border-[#e6e6e6]"} border-solid inset-0 pointer-events-none rounded-[8px]`} />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function RequirementModal({ onClose }: { onClose: () => void }) {
  const [selectedStyle, setSelectedStyle] = useState("科技现代");
  const [selectedScenes, setSelectedScenes] = useState<string[]>(["商业路演"]);
  const [selectedAudience, setSelectedAudience] = useState<string[]>(["投资人"]);
  const [selectedPages, setSelectedPages] = useState("8～12页");
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown <= 0) { onClose(); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, onClose]);

  const toggleMulti = (set: string[], val: string, setter: (v: string[]) => void) => {
    setter(set.includes(val) ? set.filter((x) => x !== val) : [...set, val]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-[22px]" onClick={onClose}>
      <div
        className="bg-white rounded-[16px] w-[800px] h-[560px] relative shadow-[0px_0px_12px_0px_rgba(0,0,0,0.08)] border border-[#e6e6e6] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="relative shrink-0 w-full">
          <div className="content-stretch flex flex-col items-start p-[16px] relative size-full">
            <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full">
              <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Medium',sans-serif] leading-[24px] min-w-px not-italic relative text-[16px] text-[rgba(0,0,0,0.88)] tracking-[0.016px]">
                确认制作需求
              </p>
              <button
                className="relative rounded-[4px] shrink-0 size-[24px] cursor-pointer"
                onClick={onClose}
              >
                <div className="content-stretch flex items-start p-[4px] relative size-full">
                  <div className="flex-[1_0_0] h-full min-w-px overflow-clip relative">
                    <div className="absolute inset-[17.59%]">
                      <svg className="absolute block inset-0 size-full" fill="none" height="10.371" preserveAspectRatio="none" viewBox="0 0 10.371 10.371" width="10.371">
                        <path d={svgNeed.p28244cc0} fill="black" fillOpacity="0.88" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            </div>
            <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)] tracking-[0.014px] w-full">
              确保 AI 生成的方向符合您的预期
            </p>
          </div>
        </div>

        {/* scrollable body */}
        <div className="flex-[1_0_0] min-h-px overflow-y-auto w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start px-[16px] pb-[16px] relative">
            {/* 视觉风格 */}
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-full">
                视觉风格
              </p>
              <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[repeat(2,fit-content(100%))] relative shrink-0 w-full">
                <StyleOption label="科技现代" image={imgImage4} selected={selectedStyle === "科技现代"} onClick={() => setSelectedStyle("科技现代")} />
                <StyleOption label="商务风" image={imgImage5} selected={selectedStyle === "商务风"} onClick={() => setSelectedStyle("商务风")} />
                <StyleOption label="XXX" image={imgImage6} selected={selectedStyle === "XXX"} onClick={() => setSelectedStyle("XXX")} />
                {/* 更多 */}
                <div className="justify-self-stretch relative rounded-[8px] self-start shrink-0 cursor-pointer">
                  <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
                      <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-px not-italic relative text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px]">
                        更多
                      </p>
                      <div className="overflow-clip relative shrink-0 size-[12px]">
                        <div className="absolute flex inset-[11.63%_27.92%_11.77%_27.89%] items-center justify-center" style={{ containerType: "size" }}>
                          <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                            <div className="relative size-full">
                              <svg className="absolute block inset-0 size-full" fill="none" height="9.19243" preserveAspectRatio="none" viewBox="0 0 5.30321 9.19243" width="5.30321">
                                <path d={svgNeed.p5e65780} fill="black" fillOpacity="0.38" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 演示场景 */}
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-full">
                演示场景（可多选）
              </p>
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
                <SelectOption label="商业路演" selected={selectedScenes.includes("商业路演")} onClick={() => toggleMulti(selectedScenes, "商业路演", setSelectedScenes)} />
                <SelectOption label="XXX" selected={selectedScenes.includes("XXX")} onClick={() => toggleMulti(selectedScenes, "XXX", setSelectedScenes)} />
                <SelectOption label="XXX" selected={selectedScenes.includes("XXX2")} onClick={() => toggleMulti(selectedScenes, "XXX2", setSelectedScenes)} />
              </div>
            </div>

            {/* 受众对象 */}
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-full">
                受众对象（可多选）
              </p>
              <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[repeat(2,fit-content(100%))] relative shrink-0 w-full">
                <GridSelectOption label="投资人" selected={selectedAudience.includes("投资人")} onClick={() => toggleMulti(selectedAudience, "投资人", setSelectedAudience)} />
                <GridSelectOption label="XXX" selected={selectedAudience.includes("XXX")} onClick={() => toggleMulti(selectedAudience, "XXX", setSelectedAudience)} />
                <GridSelectOption label="XXX" selected={selectedAudience.includes("XXX2")} onClick={() => toggleMulti(selectedAudience, "XXX2", setSelectedAudience)} />
                <GridSelectOption label="XXX" selected={selectedAudience.includes("XXX3")} onClick={() => toggleMulti(selectedAudience, "XXX3", setSelectedAudience)} />
                <GridSelectOption label="其他" selected={selectedAudience.includes("其他")} onClick={() => toggleMulti(selectedAudience, "其他", setSelectedAudience)} />
              </div>
            </div>

            {/* 页数 */}
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-full">
                页数
              </p>
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
                <SelectOption label="8～12页" selected={selectedPages === "8～12页"} onClick={() => setSelectedPages("8～12页")} />
                <SelectOption label="XXX" selected={selectedPages === "XXX"} onClick={() => setSelectedPages("XXX")} />
                <SelectOption label="XXX" selected={selectedPages === "XXX2"} onClick={() => setSelectedPages("XXX2")} />
              </div>
            </div>

            {/* 补充说明 */}
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-full">
                补充说明
              </p>
              <div className="h-[40px] relative rounded-[8px] shrink-0 w-full">
                <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[9px] relative size-full">
                    <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.26)] tracking-[0.014px] whitespace-nowrap">
                      请输入您想强调的关键数据、特定观点或特殊要求…
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="bg-[rgba(255,255,255,0.5)] relative shrink-0 w-full">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[16px] items-center p-[16px] relative size-full">
              <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[0] min-w-px not-italic relative text-[0px] text-[rgba(0,0,0,0.88)] tracking-[0.014px]">
                <span className="font-['TCloudNumber:Regular',sans-serif] leading-[22px] text-[#1e63f5] text-[14px]">{countdown}S</span>
                <span className="leading-[22px] text-[14px]">{` `}</span>
                <span className="leading-[22px] text-[14px] text-[rgba(0,0,0,0.38)]">后自动确认</span>
              </p>
              <button
                className="bg-[#1e63f5] relative rounded-[8px] shrink-0 cursor-pointer"
                onClick={onClose}
              >
                <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                  <div className="content-stretch flex gap-[8px] items-center px-[16px] py-[5px] relative size-full">
                    <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0.98)] text-center tracking-[0.014px] whitespace-nowrap">
                      确认
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── main app ─────────────────────────────────────────────────────────────────

export default function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative bg-white w-full min-h-screen overflow-hidden">
      {/* page */}
      <div className="relative w-full h-[900px]">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col items-center pt-[48px] px-[24px] relative size-full">
            {/* chat flow + input */}
            <div className="content-stretch flex flex-[1_0_0] flex-col items-center justify-center max-w-[800px] min-h-px relative w-full">
              <div className="h-[702px] relative shrink-0 w-full">
                <div className="flex flex-col items-end overflow-clip rounded-[inherit] size-full">
                  <div className="content-stretch flex flex-col items-end p-[16px] relative size-full">
                    {/* slot */}
                    <div className="content-stretch flex flex-col gap-[48px] items-end relative shrink-0 w-full">
                      {/* user message */}
                      <div className="max-w-[680px] relative shrink-0 w-full">
                        <div className="flex flex-col items-end max-w-[inherit] size-full">
                          <div className="content-stretch flex flex-col gap-[8px] items-end max-w-[inherit] relative size-full">
                            <UserMessageDefault />
                          </div>
                        </div>
                      </div>
                      {/* ai message */}
                      <div className="relative shrink-0 w-full">
                        <div className="content-stretch flex flex-col gap-[12px] items-start relative size-full">
                          <ReActBlock onAgentClick={() => setShowModal(true)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* chat input */}
              <div className="max-h-[328px] relative rounded-[16px] shrink-0 w-full">
                <div className="content-stretch flex flex-col items-start max-h-[inherit] relative size-full">
                  <ChatInput />
                </div>
              </div>
            </div>
            {/* disclaimer */}
            <div className="content-stretch flex items-center justify-center p-[4px] relative shrink-0">
              <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-[rgba(0,0,0,0.26)] text-right tracking-[0.01px] whitespace-nowrap">
                内容由AI生成，仅供参考
              </p>
            </div>
          </div>
        </div>
        <ChatHeader />
      </div>

      {/* modal */}
      {showModal && <RequirementModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
