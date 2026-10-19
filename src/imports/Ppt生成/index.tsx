import svgPaths from "./svg-jn8tuqkhjb";

function UserMessage() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex items-start justify-center max-w-[680px] px-[12px] py-[8px] relative rounded-bl-[8px] rounded-br-[8px] rounded-tl-[8px] shrink-0" data-name="UserMessage">
      <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[26px] max-w-[656px] min-w-px not-italic overflow-hidden relative text-[16px] text-[rgba(0,0,0,0.88)] text-ellipsis">生成PPT</p>
    </div>
  );
}

function UserMessageDefault() {
  return (
    <div className="content-stretch flex gap-[12px] items-center max-w-[680px] relative shrink-0" data-name="_UserMessage/default">
      <UserMessage />
    </div>
  );
}

function Frame1() {
  return (
    <div className="h-[22px] relative shrink-0 w-[16px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[16px] top-1/2" data-name="Direction">
        <div className="absolute flex inset-[23.48%_33.8%_23.48%_33.79%] items-center justify-center" style={{ containerType: "size" }}>
          <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
            <div className="relative size-full" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" height="8.48533" preserveAspectRatio="none" viewBox="0 0 5.18533 8.48533" width="5.18533">
                <path d={svgPaths.p13a1fe00} fill="black" fillOpacity="0.38" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-px not-italic relative text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px]">{`{一个卡片就是一个agent，不显示agent名字，显示它解决什么问题}`}</p>
      <Frame1 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame2 />
    </div>
  );
}

function Agent() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="agent">
      <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center px-[16px] py-[12px] relative size-full">
          <Frame />
        </div>
      </div>
    </div>
  );
}

function ReAct() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start justify-center relative rounded-[8px] shrink-0 w-[768px]" data-name="任务执行过程_ReAct">
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-[min-content]">{`{任务目标:XXXXXXX}`}</p>
      <Agent />
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-[min-content]">需要澄清演示场景、受众、页数和风格，或者其他说明；以便提供针对性的结构化描述</p>
    </div>
  );
}

function Component3() {
  return <div className="content-stretch flex flex-col gap-[12px] h-[706px] items-start relative shrink-0 w-full" data-name="内容" />;
}

function Slot() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-end relative shrink-0 w-full" data-name="Slot">
      <div className="max-w-[680px] relative shrink-0 w-full" data-name="_UserMessage">
        <div className="flex flex-col items-end max-w-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[8px] items-end max-w-[inherit] relative size-full">
            <UserMessageDefault />
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="_AIMessage">
        <div className="content-stretch flex flex-col gap-[12px] items-start relative size-full">
          <ReAct />
          <Component3 />
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

function Component4() {
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
              <Component4 />
              <button className="cursor-pointer relative rounded-[999999px] shrink-0" data-name="深度思考">
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
              </button>
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

function Component2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center justify-center max-w-[800px] min-h-px relative w-full" data-name="信息流">
      <div className="h-[702px] relative shrink-0 w-full" data-name="ChatMessage">
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

function Component5() {
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

function Component1() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="内容区">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pt-[48px] px-[24px] relative size-full">
          <Component2 />
          <Component5 />
          <ChatHeader />
        </div>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex h-[900px] items-start relative shrink-0 w-full" data-name="主页面">
      <Component1 />
    </div>
  );
}

export default function Ppt() {
  return (
    <div className="relative size-full" data-name="ppt生成">
      <div className="absolute bg-white left-0 min-w-[320px] top-0 w-[1440px]" data-name="MessageStream">
        <div className="flex flex-col items-center min-w-[inherit] overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-center min-w-[inherit] relative size-full">
            <Component />
          </div>
        </div>
      </div>
    </div>
  );
}