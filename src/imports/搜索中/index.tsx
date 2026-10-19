import svgPaths from "./svg-pcft5f0tqe";
type loadingProps = {
  className?: string;
  property1?: "1" | "2";
  text1?: string;
};

function loading({ className, property1 = "1", text1 = "读取邮件" }: loadingProps) {
  const is2 = property1 === "2";
  return (
    <div className={className || "relative"}>
      <div className="content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.38)] tracking-[0.014px] whitespace-nowrap">{text1}</p>
        <div className="absolute h-[22px] left-0 top-0 w-[57px]" data-name="Mask group">
          <svg className="absolute block inset-0 size-full" fill="none" height="22" preserveAspectRatio="none" viewBox="0 0 57 22" width="57">
            <g id="Mask group">
              <mask height="22" id={is2 ? "mask0_0_11" : "mask0_0_15"} maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="57" x="0" y="0">
                <g id="è¯»åé®ä»¶">
                  <path d={svgPaths.p307de30} fill="black" fillOpacity="0.88" id="è¯»åé®ä»¶_2" />
                </g>
              </mask>
              <g mask={is2 ? "url(#mask0_0_11)" : "url(#mask0_0_15)"}>
                <circle cx={is2 ? "74" : "-16"} cy="11" fill="black" id="Ellipse 195" r="16" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative size-full" data-name="搜索中">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="iconbase/search2">
        <div className="absolute inset-[4.16%_7.02%_7.02%_8.33%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="14.2102" preserveAspectRatio="none" viewBox="0 0 13.543 14.2102" width="13.543">
            <g id="Vector">
              <path d={svgPaths.p3b5d3c00} fill="black" fillOpacity="0.38" />
              <path d={svgPaths.p313b1700} fill="black" fillOpacity="0.38" />
            </g>
          </svg>
        </div>
      </div>
      <loading className="relative shrink-0" text1="{正在搜索相关信息}" />
    </div>
  );
}