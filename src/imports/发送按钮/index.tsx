import svgPaths from "./svg-l2s27wvkpy";
type ComponentProps = {
  className?: string;
  propValue?: "Default" | "激活" | "暂停" | "激活_hover" | "激活_pressed" | "暂停_Hover" | "暂停_pressed" | "loading";
};

export default function Component({ className, propValue = "Default" }: ComponentProps) {
  if (propValue === "loading") {
    return (
      <div className={className || "bg-[#f2f2f2] overflow-clip relative rounded-[999999px] size-[30px]"} data-name="状态=loading">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[16px] top-1/2" data-name="loading">
          <div className="absolute inset-[16.67%]">
            <div className="absolute inset-[0_0.27%_0_0]">
              <svg className="block size-full" fill="none" height="10.6667" preserveAspectRatio="none" viewBox="0 0 10.6376 10.6667" width="10.6376">
                <path d={svgPaths.p2556f980} fill="black" fillOpacity="0.6" id="Ellipse 148" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (propValue === "激活") {
    return (
      <div className={className || "bg-[#1e63f5] overflow-clip relative rounded-[999999px] size-[30px]"} data-name="状态=激活">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[16px] top-1/2" data-name="Icon">
          <div className="absolute inset-[9.45%_9.31%_6.42%_6.45%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" height="13.4602" preserveAspectRatio="none" viewBox="0 0 13.4784 13.4602" width="13.4784">
              <path d={svgPaths.p18714f00} fill="white" fillOpacity="0.98" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (propValue === "激活_hover") {
    return (
      <button className={className || "bg-[#4788ff] block cursor-pointer overflow-clip relative rounded-[999999px] size-[30px]"} data-name="状态=激活_hover">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[16px] top-1/2" data-name="Icon">
          <div className="absolute inset-[9.45%_9.31%_6.42%_6.45%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" height="13.4602" preserveAspectRatio="none" viewBox="0 0 13.4784 13.4602" width="13.4784">
              <path d={svgPaths.p18714f00} fill="white" fillOpacity="0.98" id="Vector" />
            </svg>
          </div>
        </div>
      </button>
    );
  }
  if (propValue === "激活_pressed") {
    return (
      <button className={className || "bg-[#0e45cf] block cursor-pointer overflow-clip relative rounded-[999999px] size-[30px]"} data-name="状态=激活_pressed">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[16px] top-1/2" data-name="Icon">
          <div className="absolute inset-[9.45%_9.31%_6.42%_6.45%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" height="13.4602" preserveAspectRatio="none" viewBox="0 0 13.4784 13.4602" width="13.4784">
              <path d={svgPaths.p18714f00} fill="white" fillOpacity="0.98" id="Vector" />
            </svg>
          </div>
        </div>
      </button>
    );
  }
  if (propValue === "暂停") {
    return (
      <div className={className || "bg-[#ebf4ff] overflow-clip relative rounded-[999999px] size-[30px]"} data-name="状态=暂停">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#1e63f5] left-1/2 rounded-[2px] size-[12px] top-1/2" />
      </div>
    );
  }
  if (propValue === "暂停_Hover") {
    return (
      <button className={className || "bg-[#ebf4ff] block cursor-pointer overflow-clip relative rounded-[999999px] size-[30px]"} data-name="状态=暂停_Hover">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#1e63f5] left-1/2 rounded-[2px] size-[12px] top-1/2" />
      </button>
    );
  }
  if (propValue === "暂停_pressed") {
    return (
      <button className={className || "bg-[#99c3ff] block cursor-pointer overflow-clip relative rounded-[999999px] size-[30px]"} data-name="状态=暂停_pressed">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#1e63f5] left-1/2 rounded-[2px] size-[12px] top-1/2" />
      </button>
    );
  }
  return (
    <div className={className || "bg-[#f2f2f2] overflow-clip relative rounded-[999999px] size-[30px]"} data-name="状态=Default">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[16px] top-1/2" data-name="Icon">
        <div className="absolute inset-[9.45%_9.31%_6.42%_6.45%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="13.4602" preserveAspectRatio="none" viewBox="0 0 13.4784 13.4602" width="13.4784">
            <path d={svgPaths.p18714f00} fill="black" fillOpacity="0.26" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}