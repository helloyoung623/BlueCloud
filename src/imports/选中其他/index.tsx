import svgPaths from "./svg-d8wtj7edgr";
import imgImage4 from "./29d4a489057188d7298a9a9f8b923d2d9c630925.png";
import imgImage5 from "./f49f63a62b02589f759f36fc0961c6709a8e1bdf.png";
import imgImage6 from "./9b2936619dc23e46dde47ce229cadb09c1b911ab.png";

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

function Frame2() {
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

function Frame5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-px not-italic relative text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px]">{`{一个卡片就是一个agent，不显示agent名字，显示执行目的}`}</p>
      <Frame2 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame5 />
    </div>
  );
}

function Agent() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="agent">
      <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center px-[16px] py-[12px] relative size-full">
          <Frame1 />
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

function Component4() {
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
          <Component4 />
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

function Frame() {
  return <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#1e63f5] left-1/2 rounded-[2px] size-[12px] top-1/2" />;
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
              <button className="absolute bg-[#ebf4ff] block cursor-pointer overflow-clip right-[8px] rounded-[999999px] size-[30px] top-[8px]" data-name="_发送按钮">
                <Frame />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.08)]" />
    </div>
  );
}

function Component3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center justify-center max-w-[800px] min-h-px relative w-full" data-name="信息流">
      <div className="h-[702px] relative shrink-0 w-full" data-name="ChatMessage">
        <div className="flex flex-col items-end overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-end p-[16px] relative size-full">
            <Slot />
          </div>
        </div>
      </div>
      <div className="max-h-[328px] opacity-0 relative rounded-[16px] shrink-0 w-full" data-name="Chat Input">
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

function Component2() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="内容区">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pt-[48px] px-[24px] relative size-full">
          <Component3 />
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
      <Component2 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full">
      <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Medium',sans-serif] leading-[24px] min-w-px not-italic relative text-[16px] text-[rgba(0,0,0,0.88)] tracking-[0.016px]">确认制作需求</p>
      <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon Button">
        <div className="content-stretch flex items-start p-[4px] relative size-full">
          <div className="flex-[1_0_0] h-full min-w-px overflow-clip relative" data-name="iconbase/close">
            <div className="absolute inset-[17.59%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" height="10.371" preserveAspectRatio="none" viewBox="0 0 10.371 10.371" width="10.371">
                <path d={svgPaths.p28244cc0} fill="black" fillOpacity="0.88" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame9 />
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)] tracking-[0.014px] w-full">确保 AI 生成的方向符合您的预期</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="-translate-y-1/2 absolute bg-white h-[22px] right-[7.89px] rounded-[4px] top-1/2 w-[39.111px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[21.843px] left-[calc(50%-0.1px)] top-[calc(50%+0.08px)] w-[38.913px]" data-name="image 4">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage4} />
        </div>
      </div>
      <div aria-hidden className="absolute border-[#e6e6e6] border-[0.157px] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_0px_1.886px_0px_rgba(0,0,0,0.08)]" />
    </div>
  );
}

function Frame11() {
  return (
    <div className="col-1 justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0">
      <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">科技现代</p>
          <Frame15 />
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="col-2 justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0">
      <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">XXX</p>
          <div className="absolute h-[22px] right-[8px] rounded-[4px] top-[8px] w-[39px]" data-name="image 5">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgImage5} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="col-3 justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0">
      <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">XXX</p>
          <div className="absolute h-[22px] right-[8px] rounded-[4px] top-[8px] w-[39px]" data-name="image 6">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgImage6} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="col-1 justify-self-stretch relative rounded-[8px] row-2 self-start shrink-0">
      <div aria-hidden className="absolute border border-[#1e63f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-px not-italic relative text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px]">更多</p>
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.38)] tracking-[0.014px] whitespace-nowrap">XXX风格</p>
          <div className="overflow-clip relative shrink-0 size-[12px]" data-name="Direction">
            <div className="absolute flex inset-[11.63%_27.92%_11.77%_27.89%] items-center justify-center" style={{ containerType: "size" }}>
              <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                <div className="relative size-full" data-name="Vector">
                  <svg className="absolute block inset-0 size-full" fill="none" height="9.19243" preserveAspectRatio="none" viewBox="0 0 5.30321 9.19243" width="5.30321">
                    <path d={svgPaths.p5e65780} fill="black" fillOpacity="0.38" id="Vector" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[repeat(2,fit-content(100%))] relative shrink-0 w-full">
      <Frame11 />
      <Frame12 />
      <Frame13 />
      <Frame14 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[768px]">
      <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-full">视觉风格</p>
      <Frame7 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="flex-[1_0_0] min-w-px relative rounded-[8px]">
      <div aria-hidden className="absolute border border-[#1e63f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">商业路演</p>
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="flex-[1_0_0] min-w-px relative rounded-[8px]">
      <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">XXX</p>
        </div>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="flex-[1_0_0] min-w-px relative rounded-[8px]">
      <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">XXX</p>
        </div>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
      <Frame18 />
      <Frame19 />
      <Frame20 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[768px]">
      <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-full">演示场景（可多选）</p>
      <Frame17 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="col-1 justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0">
      <div aria-hidden className="absolute border border-[#1e63f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">投资人</p>
        </div>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="col-2 justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0">
      <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">XXX</p>
        </div>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="col-3 justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0">
      <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">XXX</p>
        </div>
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="col-1 justify-self-stretch relative rounded-[8px] row-2 self-start shrink-0">
      <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">XXX</p>
        </div>
      </div>
    </div>
  );
}

function Frame27() {
  return (
    <div className="col-2 justify-self-stretch relative rounded-[8px] row-2 self-start shrink-0">
      <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">其他</p>
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[repeat(2,fit-content(100%))] relative shrink-0 w-full">
      <Frame23 />
      <Frame24 />
      <Frame25 />
      <Frame26 />
      <Frame27 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[768px]">
      <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-full">受众对象（可多选）</p>
      <Frame22 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="flex-[1_0_0] min-w-px relative rounded-[8px]">
      <div aria-hidden className="absolute border border-[#1e63f5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">8～12页</p>
        </div>
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="flex-[1_0_0] min-w-px relative rounded-[8px]">
      <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">XXX</p>
        </div>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="flex-[1_0_0] min-w-px relative rounded-[8px]">
      <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">XXX</p>
        </div>
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
      <Frame30 />
      <Frame31 />
      <Frame32 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[768px]">
      <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-full">页数</p>
      <Frame29 />
    </div>
  );
}

function Box() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[216px]" data-name="Box">
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.26)] tracking-[0.014px] whitespace-nowrap">请输入您想强调的关键数据、特定观点或特殊要求…</p>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[768px]">
      <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-full">补充说明</p>
      <div className="h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="常规">
        <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[9px] relative size-full">
            <Box />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[0] min-w-px not-italic relative text-[0px] text-[rgba(0,0,0,0.88)] tracking-[0.014px]">
        <span className="font-['TCloudNumber:Regular',sans-serif] leading-[22px] text-[#1e63f5] text-[14px]">30S</span>
        <span className="leading-[22px] text-[14px]">{` `}</span>
        <span className="leading-[22px] text-[14px] text-[rgba(0,0,0,0.38)]">后自动确认</span>
      </p>
      <div className="bg-[#1e63f5] relative rounded-[8px] shrink-0" data-name="Filled Primary Button">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[16px] py-[5px] relative size-full">
            <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0.98)] text-center tracking-[0.014px] whitespace-nowrap">确认</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="-translate-x-1/2 absolute bg-white bottom-[22px] content-stretch drop-shadow-[0px_0px_6px_rgba(0,0,0,0.08)] flex flex-col gap-[16px] items-end left-1/2 pb-[16px] pt-[12px] px-[16px] rounded-[16px] w-[800px]">
      <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Frame8 />
      <Frame10 />
      <Frame16 />
      <Frame21 />
      <Frame28 />
      <Frame33 />
      <Frame34 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative">
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">XXX风格</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative">
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">XXX风格</p>
    </div>
  );
}

function Menu() {
  return (
    <div className="content-stretch flex flex-col items-start py-[4px] relative shrink-0 w-full" data-name="Menu">
      <div className="relative rounded-[8px] shrink-0 w-full" data-name="01">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[8px] py-[11px] relative size-full">
            <Frame3 />
          </div>
        </div>
      </div>
      <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="02">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[8px] py-[11px] relative size-full">
            <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Medium',sans-serif] leading-[22px] min-w-px not-italic relative text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px]">XXX风格</p>
            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="状态-成功">
              <div className="absolute bottom-[21.87%] left-[12.5%] right-[12.5%] top-1/4" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" height="8.49991" preserveAspectRatio="none" viewBox="0 0 12 8.49991" width="12">
                  <path d={svgPaths.p3be72300} fill="#1E63F5" id="Vector" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative rounded-[8px] shrink-0 w-full" data-name="6">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[8px] py-[11px] relative size-full">
            <Frame4 />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <div className="relative size-full" data-name="选中其他">
      <div className="absolute bg-white h-[900px] left-0 min-w-[320px] top-0 w-[1440px]" data-name="MessageStream">
        <div className="flex flex-col items-center min-w-[inherit] overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-center min-w-[inherit] relative size-full">
            <Component1 />
          </div>
        </div>
      </div>
      <Frame6 />
      <div className="absolute bg-white left-[592px] rounded-[12px] top-[372px] w-[192px]" data-name="DropdownMenu">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
            <Menu />
          </div>
        </div>
        <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.08)]" />
      </div>
    </div>
  );
}