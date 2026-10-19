import svgPaths from "./svg-4ly00k0kqz";
type ComponentProps = {
  className?: string;
  propValue?: "default" | "hover";
};

function Component({ className, propValue = "default" }: ComponentProps) {
  return (
    <div className={className || `relative rounded-[8px] ${propValue === "hover" ? "bg-[#f2f2f2] drop-shadow-[0px_0px_6px_rgba(0,0,0,0.08)]" : "bg-[#f7f7f7]"}`}>
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[10px] items-center justify-center p-[8px] relative size-full">
          <div className="relative shrink-0 size-[16px]" data-name="Frame">
            <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
              <g clipPath="url(#clip0_0_8251)" id="Frame">
                <path d={svgPaths.p2b6e3f00} fill="url(#paint0_linear_0_8251)" id="Vector" />
              </g>
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_8251" x1="0.222656" x2="15.1949" y1="7.99995" y2="7.99995">
                  <stop stopColor="#1E63F5" />
                  <stop offset="1" stopColor="#13C2C2" />
                </linearGradient>
                <clipPath id="clip0_0_8251">
                  <rect fill="white" height="16" width="16" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.014px] whitespace-nowrap">找出近一周的邮件</p>
        </div>
      </div>
    </div>
  );
}
type Component1Props = {
  className?: string;
  property1?: "dark" | "light";
};

function Component1({ className, property1 = "light" }: Component1Props) {
  return (
    <div className={className || "h-[4px] relative w-[16px]"}>
      <div className={`-translate-y-1/2 absolute bg-black h-[4px] left-0 right-0 top-1/2 ${property1 === "dark" ? "opacity-0" : ""}`} />
    </div>
  );
}
type Component2Props = {
  className?: string;
  property1?: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "052" | "062" | "022" | "032" | "042";
};

function Component2({ className, property1 = "01" }: Component2Props) {
  const is02Or022 = ["02", "022"].includes(property1);
  return (
    <div className={className || "relative"}>
      <div className="content-stretch flex gap-[8px] items-baseline py-[32px] relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[56px] not-italic relative shrink-0 text-[46px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.046px] whitespace-nowrap">{["03", "032"].includes(property1) ? "Hi" : ["04", "042"].includes(property1) ? "Hi，x" : ["05", "052"].includes(property1) ? "Hi，xx" : ["06", "062"].includes(property1) ? "Hi，xxx" : property1 === "07" ? "Hi，xxxx" : is02Or022 ? " " : " "}</p>
        {["01", "07", "06", "062", "05", "052", "04", "042", "03", "032"].includes(property1) && <Component1 className="h-[4px] relative shrink-0 w-[16px]" property1={["06", "062", "04", "042"].includes(property1) ? "dark" : undefined} />}
        {is02Or022 && (
          <>
            <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[56px] not-italic relative shrink-0 text-[46px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.046px] whitespace-nowrap">H</p>
            <Component1 className="h-[4px] relative shrink-0 w-[16px]" property1="dark" />
          </>
        )}
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center pb-[20px] pt-[32px] relative shrink-0">
      <div className="h-0 relative shrink-0 w-[80px]" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 80 1" width="80">
            <path d="M0 0.5H80" id="line" stroke="url(#paint0_linear_0_9290)" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_9290" x1="0" x2="80" y1="1" y2="1">
                <stop stopOpacity="0" />
                <stop offset="1" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.38)] text-center tracking-[0.014px] whitespace-nowrap">试试这些</p>
      <div className="h-0 relative shrink-0 w-[80px]" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 80 1" width="80">
            <path d="M0 0.5H80" id="line" stroke="url(#paint0_linear_0_9239)" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_9239" x1="0" x2="80" y1="1" y2="1">
                <stop stopOpacity="0.3" />
                <stop offset="1" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_0_8251)" id="Frame">
          <path d={svgPaths.p2b6e3f00} fill="url(#paint0_linear_0_8251)" id="Vector" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_8251" x1="0.222656" x2="15.1949" y1="7.99995" y2="7.99995">
            <stop stopColor="#1E63F5" />
            <stop offset="1" stopColor="#13C2C2" />
          </linearGradient>
          <clipPath id="clip0_0_8251">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_0_8251)" id="Frame">
          <path d={svgPaths.p2b6e3f00} fill="url(#paint0_linear_0_8251)" id="Vector" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_8251" x1="0.222656" x2="15.1949" y1="7.99995" y2="7.99995">
            <stop stopColor="#1E63F5" />
            <stop offset="1" stopColor="#13C2C2" />
          </linearGradient>
          <clipPath id="clip0_0_8251">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Component8() {
  return (
    <div className="content-center flex flex-wrap gap-[12px] items-center justify-center relative shrink-0 w-full" data-name="推荐问题">
      <Component className="bg-[#f7f7f7] relative rounded-[8px] shrink-0" />
      <div className="bg-[#f7f7f7] relative rounded-[8px] shrink-0" data-name="_推荐问题">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[10px] items-center justify-center p-[8px] relative size-full">
            <Frame />
            <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.014px] whitespace-nowrap">请帮我起草一封给团队的邮件</p>
          </div>
        </div>
      </div>
      <div className="bg-[#f7f7f7] relative rounded-[8px] shrink-0" data-name="_推荐问题">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[10px] items-center justify-center p-[8px] relative size-full">
            <Frame1 />
            <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.014px] whitespace-nowrap">总结下智能助手项目邮件</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px relative w-full" data-name="推荐问题">
      <Frame2 />
      <Component8 />
    </div>
  );
}

function Filled() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-name="Filled">
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">生成PPT</p>
      <div className="bg-[rgba(0,0,0,0.88)] h-[22px] relative shrink-0 w-px" data-name="cursor" />
    </div>
  );
}

function ChatContainer() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="chat Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start pb-[48px] pt-[12px] px-[12px] relative size-full">
          <Filled />
        </div>
      </div>
    </div>
  );
}

function Component9() {
  return (
    <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative rounded-[999999px] shrink-0" data-name="来源">
      <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[999999px]" />
      <div className="relative shrink-0 size-[16px]" data-name="Icon">
        <div className="absolute inset-[8.33%]" data-name="Union">
          <svg className="absolute block inset-0 size-full" fill="none" height="13.3334" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3334" width="13.3333">
            <g id="Union">
              <path d={svgPaths.p3302ed00} fill="black" fillOpacity="0.88" />
              <path d={svgPaths.p1868fc80} fill="black" fillOpacity="0.88" />
              <path d={svgPaths.p3aa3c200} fill="black" fillOpacity="0.88" />
            </g>
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.014px] whitespace-nowrap">来源</p>
    </div>
  );
}

function Ingput() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0 w-full" data-name="ingput">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <ChatContainer />
        <div className="bg-white relative shrink-0 w-full" data-name="_tool bar">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[8px] items-center p-[8px] relative size-full">
              <div className="relative shrink-0 size-[30px]" data-name="_添加内容">
                <div className="absolute left-0 rounded-[999999px] top-0" data-name="_添加内容按钮">
                  <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[999999px]" />
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[4px] items-center p-[7px] relative size-full">
                      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon">
                        <div className="absolute inset-[12.5%]" data-name="Vector">
                          <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
                            <path d={svgPaths.p4063380} fill="black" fillOpacity="0.88" id="Vector" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Component9 />
              <div className="relative rounded-[999999px] shrink-0" data-name="深度思考">
                <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[999999px]" />
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative size-full">
                    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon">
                      <div className="absolute inset-[8.33%_12.5%]" data-name="Vector">
                        <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 12 13.3333" width="12">
                          <path d={svgPaths.p10161080} fill="black" fillOpacity="0.88" id="Vector" />
                        </svg>
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.014px] whitespace-nowrap">PPT生成</p>
                  </div>
                </div>
              </div>
              <div className="absolute bg-[#1e63f5] overflow-clip right-[8px] rounded-[999999px] size-[30px] top-[8px]" data-name="_发送按钮">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[16px] top-1/2" data-name="Icon">
                  <div className="absolute inset-[9.45%_9.31%_6.42%_6.45%]" data-name="Vector">
                    <svg className="absolute block inset-0 size-full" fill="none" height="13.4602" preserveAspectRatio="none" viewBox="0 0 13.4784 13.4602" width="13.4784">
                      <path d={svgPaths.p18714f00} fill="white" fillOpacity="0.98" id="Vector" />
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

function Component6() {
  return (
    <div className="flex-[1_0_0] max-w-[800px] min-h-px relative w-full" data-name="信息流">
      <div className="flex flex-col items-center justify-center max-w-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-center max-w-[inherit] pt-[200px] relative size-full">
          <Component2 className="relative shrink-0" property1="07" />
          <Component7 />
          <div className="max-h-[328px] relative rounded-[16px] shrink-0 w-full" data-name="Chat Input">
            <div className="content-stretch flex flex-col items-start max-h-[inherit] relative size-full">
              <Ingput />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component10() {
  return (
    <div className="content-stretch flex items-center justify-center p-[4px] relative shrink-0" data-name="申明">
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-[rgba(0,0,0,0.26)] text-right tracking-[0.01px] whitespace-nowrap">内容由AI生成，仅供参考</p>
    </div>
  );
}

function LActionBar() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="L Action bar">
      <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Icon Button">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="iconbase/sidebar">
              <div className="absolute inset-[6.25%]" data-name="Vector (Stroke)">
                <svg className="absolute block inset-0 size-full" fill="none" height="17.5" preserveAspectRatio="none" viewBox="0 0 17.5 17.5" width="17.5">
                  <path d={svgPaths.p2861a580} fill="black" fillOpacity="0.6" id="Vector (Stroke)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Icon Button">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="iconbase/new-chat">
              <div className="absolute inset-[0_0_6.25%_8.33%]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" height="18.75" preserveAspectRatio="none" viewBox="0 0 18.3333 18.75" width="18.3333">
                  <path d={svgPaths.pad1cb00} fill="black" fillOpacity="0.6" id="Vector" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RActionBar() {
  return <div className="content-stretch flex gap-[8px] items-center relative shrink-0 size-[32px]" data-name="R  Action bar" />;
}

function ChatHeader() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[48px] items-center left-0 overflow-clip px-[16px] py-[8px] right-0 top-0" data-name="ChatHeader">
      <LActionBar />
      <div className="bg-[rgba(255,255,255,0)] flex-[1_0_0] h-[28px] min-w-px relative" data-name="用来撑开" />
      <RActionBar />
    </div>
  );
}

function Component5() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="内容区">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pt-[48px] px-[24px] relative size-full">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-gradient-to-r blur-[100px] from-[#a3ffff] h-[400px] left-1/2 opacity-10 rounded-[4px] to-[#1e63f5] top-1/2 w-[755.556px]" data-name="big bg" />
          <Component6 />
          <Component10 />
          <ChatHeader />
        </div>
      </div>
    </div>
  );
}

function Component4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px relative w-full" data-name="主页面">
      <Component5 />
    </div>
  );
}

export default function Component3() {
  return (
    <div className="relative size-full" data-name="默认首页">
      <div className="absolute bg-white h-[900px] left-0 min-w-[320px] top-0 w-[1440px]" data-name="MessageStream">
        <div className="flex flex-col items-center min-w-[inherit] overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-center min-w-[inherit] relative size-full">
            <Component4 />
          </div>
        </div>
      </div>
    </div>
  );
}