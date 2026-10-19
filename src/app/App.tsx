import { useState, useRef, useEffect } from "react";
import svgPaths from "@/imports/默认首页-1/svg-4ly00k0kqz";

// ── gradient AI icon ──────────────────────────────────────────────────────────

function AIIcon({ size = 16, uid }: { size?: number; uid: string }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="absolute block inset-0 size-full" fill="none" height={size} preserveAspectRatio="none" viewBox="0 0 16 16" width={size}>
        <g clipPath={`url(#clip-${uid})`}>
          <path d={svgPaths.p2b6e3f00} fill={`url(#grad-${uid})`} />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id={`grad-${uid}`} x1="0.222656" x2="15.1949" y1="7.99995" y2="7.99995">
            <stop stopColor="#1E63F5" />
            <stop offset="1" stopColor="#13C2C2" />
          </linearGradient>
          <clipPath id={`clip-${uid}`}>
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// ── toolbar / send button shared ──────────────────────────────────────────────

function Toolbar({ hasText, onSend }: { hasText: boolean; onSend: () => void }) {
  return (
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
                        <path d={svgPaths.p4063380} fill="black" fillOpacity="0.88" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 来源 badge */}
          <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative rounded-[999999px] shrink-0">
            <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[999999px]" />
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute inset-[8.33%]">
                <svg className="absolute block inset-0 size-full" fill="none" height="13.3334" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3334" width="13.3333">
                  <g>
                    <path d={svgPaths.p3302ed00} fill="black" fillOpacity="0.88" />
                    <path d={svgPaths.p1868fc80} fill="black" fillOpacity="0.88" />
                    <path d={svgPaths.p3aa3c200} fill="black" fillOpacity="0.88" />
                  </g>
                </svg>
              </div>
            </div>
            <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.014px] whitespace-nowrap">
              来源
            </p>
          </div>
          {/* PPT生成 pill */}
          <div className="relative rounded-[999999px] shrink-0">
            <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-0 pointer-events-none rounded-[999999px]" />
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative size-full">
                <div className="overflow-clip relative shrink-0 size-[16px]">
                  <div className="absolute inset-[8.33%_12.5%]">
                    <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 12 13.3333" width="12">
                      <path d={svgPaths.p10161080} fill="black" fillOpacity="0.88" />
                    </svg>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.014px] whitespace-nowrap">
                  PPT生成
                </p>
              </div>
            </div>
          </div>
          {/* send button */}
          <button
            className={`absolute right-[8px] top-[8px] overflow-clip rounded-[999999px] size-[30px] transition-colors ${hasText ? "bg-[#1e63f5] cursor-pointer" : "bg-[#f2f2f2] cursor-default"}`}
            onClick={() => hasText && onSend()}
            disabled={!hasText}
          >
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[16px] top-1/2">
              <div className="absolute inset-[9.45%_9.31%_6.42%_6.45%]">
                <svg className="absolute block inset-0 size-full" fill="none" height="13.4602" preserveAspectRatio="none" viewBox="0 0 13.4784 13.4602" width="13.4784">
                  <path d={svgPaths.p18714f00} fill={hasText ? "white" : "black"} fillOpacity={hasText ? "0.98" : "0.26"} />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── chat input box (shared) ───────────────────────────────────────────────────

function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = "有问题，尽管问；/调用技能",
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  placeholder?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasText = value.trim().length > 0;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 240) + "px";
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (hasText) onSend();
    }
  };

  return (
    <div className="bg-white relative rounded-[20px] shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="bg-white relative shrink-0 w-full">
          <div className="overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex flex-col gap-[8px] items-start pb-[4px] pt-[12px] px-[12px] relative size-full">
              <textarea
                ref={textareaRef}
                className="w-full resize-none outline-none bg-transparent font-['PingFang_SC:Regular',sans-serif] text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] placeholder:text-[rgba(0,0,0,0.26)] min-h-[22px] max-h-[240px] overflow-y-auto"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
            </div>
          </div>
        </div>
        <Toolbar hasText={hasText} onSend={onSend} />
      </div>
      <div aria-hidden className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.08)]" />
    </div>
  );
}

// ── header ────────────────────────────────────────────────────────────────────

function ChatHeader({ title }: { title?: string }) {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[48px] items-center left-0 overflow-clip px-[16px] py-[8px] right-0 top-0">
      <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
        <div className="relative rounded-[4px] shrink-0 size-[32px]">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
              <div className="overflow-clip relative shrink-0 size-[20px]">
                <div className="absolute inset-[6.25%]">
                  <svg className="absolute block inset-0 size-full" fill="none" height="17.5" preserveAspectRatio="none" viewBox="0 0 17.5 17.5" width="17.5">
                    <path d={svgPaths.p2861a580} fill="black" fillOpacity="0.6" />
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
                    <path d={svgPaths.pad1cb00} fill="black" fillOpacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {title && (
        <div className="-translate-y-1/2 absolute content-stretch flex gap-[4px] items-center justify-center left-0 overflow-clip right-0 rounded-[4px] top-1/2 pointer-events-none">
          <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-ellipsis tracking-[0.014px] whitespace-nowrap">
            {title}
          </p>
        </div>
      )}
      <div className="bg-[rgba(255,255,255,0)] flex-[1_0_0] h-[28px] min-w-px relative" />
      <div className="content-stretch flex gap-[8px] items-center relative shrink-0 size-[32px]" />
    </div>
  );
}

// ── message bubble ────────────────────────────────────────────────────────────

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end w-full">
      <div className="bg-[#f7f7f7] max-w-[680px] px-[12px] py-[8px] rounded-bl-[8px] rounded-br-[8px] rounded-tl-[8px]">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[26px] not-italic text-[16px] text-[rgba(0,0,0,0.88)] whitespace-pre-wrap">
          {text}
        </p>
      </div>
    </div>
  );
}

// ── AI thinking placeholder ───────────────────────────────────────────────────

function AIThinking() {
  return (
    <div className="flex items-center gap-[6px] py-[4px]">
      <span className="animate-[blink_1s_0ms_step-end_infinite] bg-[rgba(0,0,0,0.26)] rounded-full size-[6px] inline-block" />
      <span className="animate-[blink_1s_200ms_step-end_infinite] bg-[rgba(0,0,0,0.26)] rounded-full size-[6px] inline-block" />
      <span className="animate-[blink_1s_400ms_step-end_infinite] bg-[rgba(0,0,0,0.26)] rounded-full size-[6px] inline-block" />
    </div>
  );
}

// ── message types ─────────────────────────────────────────────────────────────

type Message = { role: "user" | "ai"; text: string; thinking?: boolean };

// ── chat view ─────────────────────────────────────────────────────────────────

function ChatView({ messages, input, onInputChange, onSend }: {
  messages: Message[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const title = messages[0]?.text.slice(0, 20) + (messages[0]?.text.length > 20 ? "…" : "");

  return (
    <div className="relative bg-white w-full h-screen overflow-hidden">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pt-[48px] px-[24px] pb-0 relative size-full">
          <div className="flex-[1_0_0] max-w-[800px] min-h-px relative w-full flex flex-col">
            {/* message list */}
            <div ref={scrollRef} className="flex-[1_0_0] overflow-y-auto min-h-0 py-[16px]">
              <div className="flex flex-col gap-[32px]">
                {messages.map((msg, i) =>
                  msg.role === "user" ? (
                    <UserBubble key={i} text={msg.text} />
                  ) : (
                    <div key={i} className="flex flex-col gap-[8px]">
                      {msg.thinking ? (
                        <AIThinking />
                      ) : (
                        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[26px] text-[16px] text-[rgba(0,0,0,0.88)] whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
            {/* input */}
            <div className="shrink-0 pb-[8px]">
              <ChatInput value={input} onChange={onInputChange} onSend={onSend} />
            </div>
          </div>
          {/* disclaimer */}
          <div className="content-stretch flex items-center justify-center p-[4px] shrink-0">
            <p className="font-['PingFang_SC:Regular',sans-serif] leading-[normal] text-[10px] text-[rgba(0,0,0,0.26)] text-right tracking-[0.01px] whitespace-nowrap">
              内容由AI生成，仅供参考
            </p>
          </div>
        </div>
      </div>
      <ChatHeader title={title} />
    </div>
  );
}

// ── home view ─────────────────────────────────────────────────────────────────

const SUGGESTIONS = ["找出近一周的邮件", "请帮我起草一封给团队的邮件", "总结下智能助手项目邮件"];

function HomeView({ input, onInputChange, onSend }: {
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="relative bg-white w-full h-screen overflow-hidden">
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pt-[48px] px-[24px] relative size-full">
          {/* glow */}
          <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-gradient-to-r blur-[100px] from-[#a3ffff] h-[400px] left-1/2 opacity-10 rounded-[4px] to-[#1e63f5] top-1/2 w-[755.556px] pointer-events-none" />

          <div className="flex-[1_0_0] max-w-[800px] min-h-px relative w-full">
            <div className="flex flex-col items-center justify-center max-w-[inherit] size-full">
              <div className="content-stretch flex flex-col items-center justify-center max-w-[inherit] pt-[200px] relative size-full">
                {/* greeting */}
                <div className="relative shrink-0">
                  <div className="content-stretch flex gap-[8px] items-baseline py-[32px] relative size-full">
                    <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[56px] not-italic relative shrink-0 text-[46px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.046px] whitespace-nowrap">
                      Hi，xxxx
                    </p>
                    <span className="animate-[blink_1s_step-end_infinite] bg-[rgba(0,0,0,0.88)] h-[4px] self-end mb-[10px] shrink-0 w-[16px]" />
                  </div>
                </div>

                {/* suggestions */}
                <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px relative w-full">
                  {/* divider */}
                  <div className="content-stretch flex gap-[8px] items-center pb-[20px] pt-[32px] relative shrink-0">
                    <div className="h-0 relative shrink-0 w-[80px]">
                      <div className="absolute inset-[-0.5px_0]">
                        <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 80 1" width="80">
                          <path d="M0 0.5H80" stroke="url(#grad-dl)" />
                          <defs>
                            <linearGradient gradientUnits="userSpaceOnUse" id="grad-dl" x1="0" x2="80" y1="1" y2="1">
                              <stop stopOpacity="0" /><stop offset="1" stopOpacity="0.3" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <p className="font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic shrink-0 text-[14px] text-[rgba(0,0,0,0.38)] text-center tracking-[0.014px] whitespace-nowrap">
                      试试这些
                    </p>
                    <div className="h-0 relative shrink-0 w-[80px]">
                      <div className="absolute inset-[-0.5px_0]">
                        <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 80 1" width="80">
                          <path d="M0 0.5H80" stroke="url(#grad-dr)" />
                          <defs>
                            <linearGradient gradientUnits="userSpaceOnUse" id="grad-dr" x1="0" x2="80" y1="1" y2="1">
                              <stop stopOpacity="0.3" /><stop offset="1" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* chips */}
                  <div className="content-center flex flex-wrap gap-[12px] items-center justify-center relative shrink-0 w-full">
                    {SUGGESTIONS.map((s, i) => (
                      <button
                        key={s}
                        className="bg-[#f7f7f7] hover:bg-[#f2f2f2] relative rounded-[8px] shrink-0 cursor-pointer transition-colors"
                        onClick={() => onInputChange(s)}
                      >
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex gap-[10px] items-center justify-center p-[8px] relative size-full">
                            <AIIcon size={16} uid={`chip-${i}`} />
                            <p className="font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic shrink-0 text-[14px] text-[rgba(0,0,0,0.88)] text-center tracking-[0.014px] whitespace-nowrap">
                              {s}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* input */}
                <div className="max-h-[328px] relative rounded-[16px] shrink-0 w-full mt-[0px]">
                  <ChatInput value={input} onChange={onInputChange} onSend={onSend} />
                </div>
              </div>
            </div>
          </div>

          {/* disclaimer */}
          <div className="content-stretch flex items-center justify-center p-[4px] shrink-0">
            <p className="font-['PingFang_SC:Regular',sans-serif] leading-[normal] text-[10px] text-[rgba(0,0,0,0.26)] text-right tracking-[0.01px] whitespace-nowrap">
              内容由AI生成，仅供参考
            </p>
          </div>
        </div>
      </div>
      <ChatHeader />
    </div>
  );
}

// ── root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("生成PPT");
  const inChat = messages.length > 0;

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const thinking: Message = { role: "ai", text: "", thinking: true };
    setMessages((prev) => [...prev, { role: "user", text }, thinking]);
    // simulate AI reply after 1.2 s
    setTimeout(() => {
      setMessages((prev) => {
        const next = [...prev];
        const idx = next.findLastIndex((m) => m.thinking);
        if (idx !== -1) next[idx] = { role: "ai", text: "好的，我来帮您处理这个请求。" };
        return next;
      });
    }, 1200);
  };

  if (inChat) {
    return (
      <ChatView
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
      />
    );
  }

  return (
    <HomeView
      input={input}
      onInputChange={setInput}
      onSend={handleSend}
    />
  );
}
