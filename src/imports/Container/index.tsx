import svgPaths from "./svg-ky29gei8j7";
type ContainerProps = {
  className?: string;
  propValue?: "未选中_HOVER" | "选中_Default" | "选中_HOVER" | "未选中_Default";
};

export default function Container({ className, propValue = "未选中_Default" }: ContainerProps) {
  if (propValue === "未选中_HOVER") {
    return (
      <button className={className || "bg-[#f2f2f2] cursor-pointer relative rounded-[999999px]"} data-name="状态=未选中_HOVER">
        <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[999999px]" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative size-full">
            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon">
              <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.03px)] size-[12.087px] top-[calc(50%+0.03px)]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" height="12.0866" preserveAspectRatio="none" viewBox="0 0 12.0867 12.0866" width="12.0867">
                  <g id="Vector">
                    <path d={svgPaths.p9b19900} fill="black" fillOpacity="0.88" />
                    <path clipRule="evenodd" d={svgPaths.p3b20d180} fill="black" fillOpacity="0.88" fillRule="evenodd" />
                    <path d={svgPaths.p2920e200} fill="black" fillOpacity="0.88" />
                  </g>
                </svg>
              </div>
            </div>
            <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.014px] whitespace-nowrap">思考</p>
          </div>
        </div>
      </button>
    );
  }
  if (propValue === "选中_Default") {
    return (
      <div className={className || "bg-[#ebf4ff] relative rounded-[999999px]"} data-name="状态=选中_Default">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative size-full">
            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon">
              <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.03px)] size-[12.087px] top-[calc(50%+0.03px)]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" height="12.0866" preserveAspectRatio="none" viewBox="0 0 12.0867 12.0866" width="12.0867">
                  <g id="Vector">
                    <path d={svgPaths.p9b19900} fill="#1E63F5" />
                    <path clipRule="evenodd" d={svgPaths.p3b20d180} fill="#1E63F5" fillRule="evenodd" />
                    <path d={svgPaths.p2920e200} fill="#1E63F5" />
                  </g>
                </svg>
              </div>
            </div>
            <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1e63f5] text-[14px] text-center tracking-[0.014px] whitespace-nowrap">思考</p>
          </div>
        </div>
      </div>
    );
  }
  if (propValue === "选中_HOVER") {
    return (
      <button className={className || "bg-[#ebf4ff] cursor-pointer relative rounded-[999999px]"} data-name="状态=选中_HOVER">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative size-full">
            <div className="opacity-0 overflow-clip relative shrink-0 size-[16px]" data-name="Icon">
              <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.03px)] size-[12.087px] top-[calc(50%+0.03px)]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" height="12.0866" preserveAspectRatio="none" viewBox="0 0 12.0867 12.0866" width="12.0867">
                  <g id="Vector">
                    <path d={svgPaths.p9b19900} fill="black" fillOpacity="0.88" />
                    <path clipRule="evenodd" d={svgPaths.p3b20d180} fill="black" fillOpacity="0.88" fillRule="evenodd" />
                    <path d={svgPaths.p2920e200} fill="black" fillOpacity="0.88" />
                  </g>
                </svg>
              </div>
            </div>
            <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1e63f5] text-[14px] text-center tracking-[0.014px] whitespace-nowrap">思考</p>
            <div className="absolute left-[8px] overflow-clip size-[16px] top-[7px]" data-name="iconbase/cancel-fill">
              <div className="absolute inset-[8.33%]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                  <path d={svgPaths.p2186600} fill="#1E63F5" id="Vector" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  }
  return (
    <div className={className || "relative rounded-[999999px]"} data-name="状态=未选中_Default">
      <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[999999px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.03px)] size-[12.087px] top-[calc(50%+0.03px)]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" height="12.0866" preserveAspectRatio="none" viewBox="0 0 12.0867 12.0866" width="12.0867">
                <g id="Vector">
                  <path d={svgPaths.p9b19900} fill="black" fillOpacity="0.88" />
                  <path clipRule="evenodd" d={svgPaths.p3b20d180} fill="black" fillOpacity="0.88" fillRule="evenodd" />
                  <path d={svgPaths.p2920e200} fill="black" fillOpacity="0.88" />
                </g>
              </svg>
            </div>
          </div>
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.014px] whitespace-nowrap">思考</p>
        </div>
      </div>
    </div>
  );
}