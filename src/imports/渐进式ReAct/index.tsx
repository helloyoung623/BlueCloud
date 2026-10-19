import svgPaths from "./svg-x4n03n8we0";
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
              <mask height="22" id={is2 ? "mask0_0_58" : "mask0_0_62"} maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="57" x="0" y="0">
                <g id="è¯»åé®ä»¶">
                  <path d={svgPaths.p307de30} fill="black" fillOpacity="0.88" id="è¯»åé®ä»¶_2" />
                </g>
              </mask>
              <g mask={is2 ? "url(#mask0_0_58)" : "url(#mask0_0_62)"}>
                <circle cx={is2 ? "74" : "-16"} cy="11" fill="black" id="Ellipse 195" r="16" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Motion({ className }: { className?: string }) {
  return (
    <div className={className || "h-[46px] relative w-[256px]"} data-name="motion">
      <div className="absolute inset-[-1.09%_-0.2%]">
        <svg className="block size-full" fill="none" height="47" preserveAspectRatio="none" viewBox="0 0 257 47" width="257">
          <path d={svgPaths.p3bb61200} id="Rectangle 462" pathLength="1" stroke="url(#paint0_linear_0_77)" strokeDasharray="1 1" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_77" x1="0.5" x2="256.5" y1="23.5" y2="23.5">
              <stop stopColor="#1C61F1" />
              <stop offset="1" stopColor="#38E38A" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Frame4() {
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

function Frame8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-px not-italic relative text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px]">{`{一个卡片就是一个agent，不显示agent名字，显示它解决什么问题}`}</p>
      <Frame4 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame8 />
    </div>
  );
}

function Agent() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="agent">
      <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start justify-center px-[16px] py-[12px] relative size-full">
          <Frame />
          <Motion className="-translate-x-1/2 -translate-y-1/2 absolute h-[46px] left-1/2 top-1/2 w-[768px]" />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="h-[22px] relative shrink-0 w-[16px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[16px] top-1/2" data-name="Direction">
        <div className="absolute inset-[33.8%_23.48%_33.79%_23.48%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="5.18533" preserveAspectRatio="none" viewBox="0 0 8.48533 5.18533" width="8.48533">
            <path d={svgPaths.p33898580} fill="black" fillOpacity="0.38" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-px not-italic relative text-[14px] text-[rgba(0,0,0,0.38)] tracking-[0.014px]">{`{agent，显示它解决什么问题}`}</p>
      <Frame5 />
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="搜索">
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
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">{`{搜索；找到 3条相关结果}`}</p>
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="读取">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="iconbase/read">
        <div className="absolute left-[1.33px] size-[13.333px] top-[1.33px]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
            <g id="Vector">
              <path d={svgPaths.p27585af0} fill="black" fillOpacity="0.38" />
              <path d={svgPaths.p10b3d540} fill="black" fillOpacity="0.38" />
              <path d={svgPaths.p376ce200} fill="black" fillOpacity="0.38" />
            </g>
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">{`{读取；加载目标网页中的关键信息}`}</p>
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="提取">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="数据清洗">
        <div className="absolute inset-[8.33%_16.67%_12.5%_8.33%]" data-name="Subtract">
          <svg className="absolute block inset-0 size-full" fill="none" height="12.667" preserveAspectRatio="none" viewBox="0 0 12 12.667" width="12">
            <path d={svgPaths.p31938000} fill="black" fillOpacity="0.38" id="Subtract" />
          </svg>
        </div>
        <div className="absolute inset-[63.33%_12.5%_9.17%_58.33%]" data-name="Vector (Stroke)">
          <svg className="absolute block inset-0 size-full" fill="none" height="4.39974" preserveAspectRatio="none" viewBox="0 0 4.66667 4.39974" width="4.66667">
            <path d={svgPaths.p1528fd00} fill="black" fillOpacity="0.38" id="Vector (Stroke)" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">{`{提取；从结果中提取 5 个关键点}`}</p>
    </div>
  );
}

function Component3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="分析">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="营销-线">
        <div className="absolute inset-[12.5%_8.33%_8.33%_8.33%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="12.6667" preserveAspectRatio="none" viewBox="0 0 13.3334 12.6667" width="13.3334">
            <g id="Vector">
              <path d={svgPaths.p39797f00} fill="black" fillOpacity="0.38" />
              <path clipRule="evenodd" d={svgPaths.p3d6ffbf0} fill="black" fillOpacity="0.38" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">{`{分析；提炼出 3 个核心方向}`}</p>
    </div>
  );
}

function Component4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="生成">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="文本清单-线">
        <div className="absolute inset-[8.33%_12.5%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 12 13.3333" width="12">
            <path d={svgPaths.p21d54700} fill="black" fillOpacity="0.38" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-[248px]">{`{生成；生成了可直接编辑的答案草稿}`}</p>
    </div>
  );
}

function Component5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="校验">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="iconbase/check">
        <div className="absolute h-[14.243px] left-[1.67px] top-px w-[12.667px]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="14.2427" preserveAspectRatio="none" viewBox="0 0 12.6667 14.2427" width="12.6667">
            <g id="Vector">
              <path d={svgPaths.p2e680a00} fill="black" fillOpacity="0.38" />
              <path d={svgPaths.pce82500} fill="black" fillOpacity="0.38" />
              <path d={svgPaths.p2a4faf00} fill="black" fillOpacity="0.38" />
              <path d={svgPaths.p2dfb8000} fill="black" fillOpacity="0.38" />
              <path d={svgPaths.p375f7200} fill="black" fillOpacity="0.38" />
              <path d={svgPaths.p14ac9ef0} fill="black" fillOpacity="0.38" />
            </g>
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">{`{校验；完成答案内容的一致性检查}`}</p>
    </div>
  );
}

function Component6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="汇总">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="合并">
        <div className="-translate-y-1/2 absolute h-[11.314px] left-0 top-1/2 w-[15.98px]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="11.3137" preserveAspectRatio="none" viewBox="0 0 15.9804 11.3137" width="15.9804">
            <g id="Vector">
              <path clipRule="evenodd" d={svgPaths.p1305b900} fill="black" fillOpacity="0.38" fillRule="evenodd" />
              <path d={svgPaths.p3d125080} fill="black" fillOpacity="0.38" />
              <path d={svgPaths.p3fde1480} fill="black" fillOpacity="0.38" />
            </g>
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">{`{汇总；正在生成统一的最终输出}`}</p>
    </div>
  );
}

function Component7() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="执行">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="iconbase/click">
        <div className="absolute inset-[12.5%_9.65%_4.14%_4.17%]" data-name="Union">
          <svg className="absolute block inset-0 size-full" fill="none" height="13.3381" preserveAspectRatio="none" viewBox="0 0 13.7892 13.3381" width="13.7892">
            <path d={svgPaths.p2a822e00} fill="black" fillOpacity="0.38" id="Union" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">{`{执行；邮件已发送给目标联系人}`}</p>
    </div>
  );
}

function Component8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="失败终态">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="iconbase/close">
        <div className="absolute inset-[17.59%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="10.371" preserveAspectRatio="none" viewBox="0 0 10.371 10.371" width="10.371">
            <path d={svgPaths.p16dcd200} fill="#FC5926" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">扩大范围后仍未找到可用信息</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame9 />
      <Component />
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-[min-content]">{`{阶段结果/中间结果}`}</p>
      <Component1 />
      <Component2 />
      <Component3 />
      <Component4 />
      <Component5 />
      <Component6 />
      <Component7 />
      <Component8 />
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-[min-content]">{`{阶段结果/中间结果}`}</p>
    </div>
  );
}

function Agent1() {
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

function Component9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative" data-name="搜索">
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

function Frame6() {
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

function Frame10() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">{`{agent，显示它解决什么问题}`}</p>
      <div className="h-[16px] relative shrink-0 w-0">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 1 16" width="1">
            <path d="M0.5 0V16" id="Vector 117" stroke="#E6E6E6" />
          </svg>
        </div>
      </div>
      <Component9 />
      <Frame6 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame10 />
    </div>
  );
}

function Agent2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-[768px]" data-name="agent">
      <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame2 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="h-[22px] relative shrink-0 w-[16px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[16px] top-1/2" data-name="Direction">
        <div className="absolute inset-[33.8%_23.48%_33.79%_23.48%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="5.18533" preserveAspectRatio="none" viewBox="0 0 8.48533 5.18533" width="8.48533">
            <path d={svgPaths.p33898580} fill="black" fillOpacity="0.38" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-px not-italic relative text-[14px] text-[rgba(0,0,0,0.38)] tracking-[0.014px]">{`{agent，显示它解决什么问题}`}</p>
      <Frame7 />
    </div>
  );
}

function Component10() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="读取">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="iconbase/read">
        <div className="absolute left-[1.33px] size-[13.333px] top-[1.33px]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
            <g id="Vector">
              <path d={svgPaths.p27585af0} fill="black" fillOpacity="0.38" />
              <path d={svgPaths.p10b3d540} fill="black" fillOpacity="0.38" />
              <path d={svgPaths.p376ce200} fill="black" fillOpacity="0.38" />
            </g>
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">{`{读取；加载目标网页中的关键信息}`}</p>
    </div>
  );
}

function Component11() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="搜索中">
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

function Component12() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="重新搜索">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="iconbase/warning-line">
        <div className="absolute inset-[10.42%_6.14%_12.5%_6.14%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="12.3333" preserveAspectRatio="none" viewBox="0 0 14.0346 12.3333" width="14.0346">
            <path d={svgPaths.p3ee53800} fill="#F3C63D" id="Vector" />
          </svg>
        </div>
      </div>
      <loading className="relative shrink-0" text1="{搜索结果不够精确，正在重新筛选}" />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame11 />
      <Component10 />
      <Component11 />
      <Component12 />
    </div>
  );
}

function Agent3() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="agent">
      <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center px-[16px] py-[12px] relative size-full">
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

export default function ReAct() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[12px] items-start justify-center relative rounded-[8px] size-full" data-name="渐进式ReAct">
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-[min-content]">{`{任务目标:XXXXXXX}`}</p>
      <Agent />
      <Agent1 />
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-[min-content]">{`{阶段结果/中间结果}`}</p>
      <Agent2 />
      <Agent3 />
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] w-[min-content]">{`{总结}`}</p>
    </div>
  );
}