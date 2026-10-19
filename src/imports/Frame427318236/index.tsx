import svgPaths from "./svg-mjwp2drvpn";
import imgImage3 from "./9e55d93ab34e49b9baf8a7d585a49321a5312a43.png";
import imgSlot from "./ae0b4b17dfd8b056b7e9e2be30021bace18d9f5d.png";
type CopyIconProps = {
  className?: string;
  propValue?: "Default" | "success";
};

function CopyIcon({ className, propValue = "Default" }: CopyIconProps) {
  if (propValue === "success") {
    return (
      <div className={className || "relative"} data-name="状态=success">
        <div className="content-stretch flex items-start relative size-full">
          <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="success">
            <div className="content-stretch flex items-start p-[4px] relative size-full">
              <div className="flex-[1_0_0] h-full min-w-px overflow-clip relative" data-name="iconbase/success">
                <div className="absolute bottom-[21.87%] left-[12.5%] right-[12.5%] top-1/4" data-name="Vector">
                  <svg className="absolute block inset-0 size-full" fill="none" height="8.49991" preserveAspectRatio="none" viewBox="0 0 12 8.49991" width="12">
                    <path d={svgPaths.p3be72300} fill="black" fillOpacity="0.6" id="Vector" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <button className={className || "cursor-pointer relative"} data-name="状态=Default">
      <div className="content-stretch flex items-start relative size-full">
        <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="copy">
          <div className="content-stretch flex items-start p-[4px] relative size-full">
            <div className="flex-[1_0_0] h-full min-w-px overflow-clip relative" data-name="iconbase/copy-line">
              <div className="absolute inset-[8.33%]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                  <path d={svgPaths.p2431f370} fill="black" fillOpacity="0.6" id="Vector" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
type ComponentProps = {
  className?: string;
  type?: "暂无消息";
};

function Component({ className, type = "暂无消息" }: ComponentProps) {
  return (
    <div className={className || "overflow-clip relative size-[240px]"}>
      <div className="-translate-x-1/2 absolute aspect-[480/480] bottom-0 left-1/2 top-0" data-name="image 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage3} />
      </div>
    </div>
  );
}

function Head() {
  return (
    <div className="bg-white h-[120px] relative shrink-0 w-full" data-name="head">
      <p className="[word-break:break-word] absolute font-['PingFang_SC:Medium',sans-serif] leading-[24px] left-[24px] not-italic text-[16px] text-[rgba(0,0,0,0.88)] top-[12px] tracking-[0.016px] whitespace-nowrap">任务</p>
      <div className="absolute left-[196px] rounded-[4px] size-[32px] top-[8px]" data-name="Icon Button">
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
    </div>
  );
}

function Component2() {
  return (
    <div className="h-[240px] relative shrink-0 w-full" data-name="插画">
      <Component className="-translate-y-1/2 absolute left-0 overflow-clip size-[240px] top-1/2" />
      <p className="[word-break:break-word] absolute font-['PingFang_SC:Medium',sans-serif] leading-[22px] left-[calc(50%-42px)] not-italic text-[14px] text-[rgba(0,0,0,0.38)] top-[186px] tracking-[0.014px] whitespace-nowrap">暂无历史对话</p>
      <p className="[word-break:break-word] absolute font-['PingFang_SC:Regular',sans-serif] leading-[22px] left-[calc(50%-84px)] not-italic text-[14px] text-[rgba(0,0,0,0.38)] top-[210px] tracking-[0.014px] whitespace-nowrap">快去输入问题发起新的咨询</p>
    </div>
  );
}

function AvatarL() {
  return (
    <div className="absolute bg-[#dcdcdc] border border-solid border-white left-0 overflow-clip rounded-[999999px] size-[24px] top-0" data-name="Avatar/L">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[12px] top-1/2" data-name="iconbase/user-line">
        <div className="absolute inset-[6.25%_10.42%]" data-name="Union">
          <svg className="absolute block inset-0 size-full" fill="none" height="10.5" preserveAspectRatio="none" viewBox="0 0 9.5 10.5" width="9.5">
            <g id="Union">
              <path clipRule="evenodd" d={svgPaths.p44b8000} fill="#5E5E5E" fillRule="evenodd" />
              <path d={svgPaths.p16884000} fill="#5E5E5E" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function More() {
  return (
    <div className="flex-[1_0_0] h-[32px] min-w-px relative rounded-[8px]" data-name="more">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[4px] relative size-full">
          <div className="relative rounded-[30px] shrink-0 size-[24px]" data-name="Avatar">
            <AvatarL />
          </div>
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">张三李四王麻子</p>
        </div>
      </div>
    </div>
  );
}

function Bottom() {
  return (
    <div className="absolute bg-white bottom-0 content-stretch flex items-center justify-end left-0 px-[12px] py-[8px] w-[240px]" data-name="bottom">
      <More />
    </div>
  );
}

function Slot() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-end relative shrink-0 w-full" data-name="Slot">
      <div className="max-w-[680px] relative shrink-0 w-full" data-name="_UserMessage">
        <div className="flex flex-col items-end max-w-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[8px] items-end max-w-[inherit] relative size-full">
            <div className="content-stretch flex gap-[12px] items-center max-w-[680px] relative shrink-0" data-name="_UserMessage/default">
              <div className="bg-[#f7f7f7] content-stretch flex items-start justify-center max-w-[680px] px-[12px] py-[8px] relative rounded-bl-[8px] rounded-br-[8px] rounded-tl-[8px] shrink-0" data-name="UserMessage">
                <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[26px] max-w-[656px] min-w-px not-italic overflow-hidden relative text-[16px] text-[rgba(0,0,0,0.88)] text-ellipsis">提问问题</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="_AIMessage">
        <div className="content-stretch flex flex-col gap-[12px] items-start relative size-full">
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="内容">
            <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[28px] min-w-full not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.88)] tracking-[0.16px] w-[min-content]">回答的内容回答的内容回答的内容回答的内容回答的内容回答的内容回答的内容回答的内容回答的内容回答的内容回答的内容回答的内容回答的内容回答的内容回答的内容回答的内容</p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="MessageActions">
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Slot">
              <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon Button">
                <div className="content-stretch flex items-start p-[4px] relative size-full">
                  <div className="flex-[1_0_0] h-full min-w-px overflow-clip relative" data-name="iconbase/refresh">
                    <div className="absolute inset-[8.33%]" data-name="Vector">
                      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
                        <path d={svgPaths.p2af60500} fill="black" fillOpacity="0.88" id="Vector" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <button className="cursor-pointer relative shrink-0" data-name=".copy Icon">
                <div className="content-stretch flex items-start relative size-full">
                  <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="copy">
                    <div className="content-stretch flex items-start p-[4px] relative size-full">
                      <div className="flex-[1_0_0] h-full min-w-px overflow-clip relative" data-name="iconbase/copy-line">
                        <div className="absolute inset-[8.33%]" data-name="Vector">
                          <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
                            <path d={svgPaths.p1dcb3780} fill="black" fillOpacity="0.88" id="Vector" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
              <div className="content-stretch flex gap-[4px] items-center px-[4px] relative shrink-0" data-name="来源">
                <div className="content-stretch flex items-center relative shrink-0">
                  <div className="bg-white mr-[-4px] relative rounded-[1249998.75px] shrink-0 size-[20px]">
                    <div className="flex flex-row items-center justify-center size-full">
                      <div className="content-stretch flex items-center justify-center p-[12.5px] relative size-full">
                        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="File Type">
                          <div className="absolute inset-[8.33%]" data-name="Subtract">
                            <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
                              <g id="Subtract">
                                <path d={svgPaths.p95aba80} fill="#4094F7" />
                                <path d={svgPaths.p2fd09e00} fill="#4094F7" />
                                <path d={svgPaths.p110c1400} fill="#4094F7" />
                                <path d={svgPaths.p206c4500} fill="#4094F7" />
                              </g>
                            </svg>
                          </div>
                          <div className="absolute inset-[50.01%_52.61%_32.64%_33.47%]" data-name="Subtract">
                            <svg className="absolute block inset-0 size-full" fill="none" height="4.165" preserveAspectRatio="none" viewBox="0 0 3.3425 4.165" width="3.3425">
                              <path d={svgPaths.p3b575f80} fill="white" id="Subtract" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white mr-[-4px] relative rounded-[1249998.75px] shrink-0 size-[20px]">
                    <div className="flex flex-row items-center justify-center size-full">
                      <div className="content-stretch flex items-center justify-center p-[12.5px] relative size-full">
                        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon">
                          <div className="absolute inset-[8.33%]" data-name="Vector">
                            <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
                              <path d={svgPaths.p3ef4adf0} fill="black" fillOpacity="0.88" id="Vector" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white relative rounded-[1249998.75px] shrink-0 size-[20px]">
                    <div className="flex flex-row items-center justify-center size-full">
                      <div className="content-stretch flex items-center justify-center p-[12.5px] relative size-full">
                        <div className="overflow-clip relative rounded-[999999px] shrink-0 size-[16px]">
                          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[27px] top-1/2" data-name="image 1">
                            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSlot} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)] text-center tracking-[0.014px] whitespace-nowrap">9个来源</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatContainer() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="chat Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start pb-[48px] pt-[12px] px-[12px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.26)] tracking-[0.014px] whitespace-nowrap">有问题，尽管问；/调用技能</p>
        </div>
      </div>
    </div>
  );
}

function Component5() {
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
              <Component5 />
              <div className="relative rounded-[999999px] shrink-0" data-name="深度思考">
                <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[999999px]" />
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative size-full">
                    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon">
                      <div className="absolute inset-[8.33%]" data-name="Vector">
                        <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                          <path d={svgPaths.p9d63080} fill="black" fillOpacity="0.88" id="Vector" />
                        </svg>
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.014px] whitespace-nowrap">技能</p>
                  </div>
                </div>
              </div>
              <div className="absolute bg-[#f2f2f2] overflow-clip right-[8px] rounded-[999999px] size-[30px] top-[8px]" data-name="_发送按钮">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[16px] top-1/2" data-name="Icon">
                  <div className="absolute inset-[9.45%_9.31%_6.42%_6.45%]" data-name="Vector">
                    <svg className="absolute block inset-0 size-full" fill="none" height="13.4602" preserveAspectRatio="none" viewBox="0 0 13.4784 13.4602" width="13.4784">
                      <path d={svgPaths.p18714f00} fill="black" fillOpacity="0.26" id="Vector" />
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

function Component4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center justify-center max-w-[800px] min-h-px relative w-full" data-name="信息流">
      <div className="flex-[1_0_0] min-h-px relative w-full" data-name="ChatMessage">
        <div className="flex flex-col items-end overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-end p-[16px] relative size-full">
            <Slot />
          </div>
        </div>
      </div>
      <div className="max-h-[328px] relative rounded-[16px] shrink-0 w-full" data-name="Chat Input">
        <div className="content-stretch flex flex-col items-start max-h-[inherit] relative size-full">
          <Ingput />
        </div>
      </div>
    </div>
  );
}

function Component6() {
  return (
    <div className="content-stretch flex items-center justify-center p-[4px] relative shrink-0" data-name="申明">
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-[rgba(0,0,0,0.26)] text-right tracking-[0.01px] whitespace-nowrap">内容由AI生成，仅供参考</p>
    </div>
  );
}

function LActionBar() {
  return <div className="content-stretch flex gap-[8px] h-[32px] items-center relative shrink-0 w-[72px]" data-name="L Action bar" />;
}

function Title() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex gap-[4px] items-center justify-center left-0 overflow-clip right-0 rounded-[4px] top-1/2" data-name="title">
      <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-ellipsis tracking-[0.014px] whitespace-nowrap">标题标题标题标题</p>
      <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon Button">
        <div className="content-stretch flex items-start p-[4px] relative size-full">
          <div className="flex-[1_0_0] h-full min-w-px overflow-clip relative" data-name="iconbase/more-horizontal">
            <div className="absolute inset-[41.67%_12.5%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" height="2.66667" preserveAspectRatio="none" viewBox="0 0 12 2.66667" width="12">
                <path d={svgPaths.p152a4f80} fill="black" fillOpacity="0.38" id="Vector" />
              </svg>
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
      <Title />
      <div className="bg-[rgba(255,255,255,0)] flex-[1_0_0] h-[28px] min-w-px relative" data-name="用来撑开" />
      <RActionBar />
    </div>
  );
}

function Component3() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="内容区">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pt-[48px] px-[24px] relative size-full">
          <Component4 />
          <Component6 />
          <ChatHeader />
        </div>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px relative w-full" data-name="主页面">
      <div className="bg-white h-full relative shrink-0 w-[240px]" data-name="Sidebar">
        <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-center relative size-full">
            <Head />
            <Component2 />
            <Bottom />
          </div>
        </div>
        <div aria-hidden className="absolute border-[#f2f2f2] border-r border-solid inset-0 pointer-events-none" />
      </div>
      <Component3 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="absolute bg-white h-[900px] left-0 min-w-[320px] top-0 w-[1440px]" data-name="MessageStream">
        <div className="flex flex-col items-center min-w-[inherit] overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-center min-w-[inherit] relative size-full">
            <Component1 />
          </div>
        </div>
      </div>
    </div>
  );
}