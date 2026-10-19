import { useState, useRef, useEffect } from "react";
import svgPaths from "@/imports/默认首页-1/svg-4ly00k0kqz";

// ── gradient AI spark icon ────────────────────────────────────────────────────

function AIIcon({ uid }: { uid: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <g clipPath={`url(#c-${uid})`}>
        <path d={svgPaths.p2b6e3f00} fill={`url(#g-${uid})`} />
      </g>
      <defs>
        <linearGradient id={`g-${uid}`} x1="0.222656" y1="7.99995" x2="15.1949" y2="7.99995" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E63F5" />
          <stop offset="1" stopColor="#13C2C2" />
        </linearGradient>
        <clipPath id={`c-${uid}`}><rect width="16" height="16" fill="white" /></clipPath>
      </defs>
    </svg>
  );
}

// ── chat input ────────────────────────────────────────────────────────────────

function ChatInput({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasText = value.trim().length > 0;

  // auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (hasText) onSend();
    }
  };

  return (
    <div className="relative w-full rounded-[20px] bg-white" style={{ boxShadow: "0 0 12px rgba(0,0,0,0.08)", border: "1px solid #e6e6e6" }}>
      {/* text area */}
      <div className="px-[12px] pt-[12px] pb-[12px]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="有问题，尽管问；/调用技能"
          rows={1}
          style={{ minHeight: 22, maxHeight: 160 }}
          className="block w-full resize-none bg-transparent text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] placeholder:text-[rgba(0,0,0,0.26)] outline-none overflow-y-auto"
        />
        {/* spacer that gives the input area its visual height, matching design */}
        <div className="h-[36px]" />
      </div>

      {/* toolbar row */}
      <div className="px-[8px] pb-[8px] flex items-center gap-[8px]">
        {/* + button */}
        <button className="shrink-0 w-[30px] h-[30px] rounded-full border border-[#f2f2f2] flex items-center justify-center hover:bg-[#f7f7f7]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d={svgPaths.p4063380} fill="black" fillOpacity="0.88" />
          </svg>
        </button>

        {/* 来源 badge */}
        <div className="shrink-0 flex items-center gap-[4px] px-[8px] py-[4px] rounded-full border border-[#f2f2f2]">
          <svg width="16" height="16" viewBox="0 0 13.3333 13.3334" fill="none" className="shrink-0">
            <path d={svgPaths.p3302ed00} fill="black" fillOpacity="0.88" />
            <path d={svgPaths.p1868fc80} fill="black" fillOpacity="0.88" />
            <path d={svgPaths.p3aa3c200} fill="black" fillOpacity="0.88" />
          </svg>
          <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">来源</span>
        </div>

        {/* PPT生成 pill */}
        <div className="shrink-0 flex items-center gap-[4px] px-[8px] py-[4px] rounded-full border border-[#f2f2f2]">
          <svg width="12" height="14" viewBox="0 0 12 13.3333" fill="none" className="shrink-0">
            <path d={svgPaths.p10161080} fill="black" fillOpacity="0.88" />
          </svg>
          <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">PPT生成</span>
        </div>

        {/* send button — pushed to right */}
        <button
          onClick={() => hasText && onSend()}
          className={`ml-auto shrink-0 w-[30px] h-[30px] rounded-full flex items-center justify-center transition-colors ${hasText ? "bg-[#1e63f5] cursor-pointer" : "bg-[#f2f2f2] cursor-default"}`}
        >
          <svg width="14" height="14" viewBox="0 0 13.4784 13.4602" fill="none">
            <path d={svgPaths.p18714f00} fill={hasText ? "white" : "black"} fillOpacity={hasText ? "0.98" : "0.26"} />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── header ────────────────────────────────────────────────────────────────────

function ChatHeader({ title }: { title?: string }) {
  return (
    <div className="absolute top-0 left-0 right-0 h-[48px] bg-white flex items-center gap-[8px] px-[16px] z-10">
      {/* sidebar icon */}
      <button className="shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f7f7f7]">
        <svg width="20" height="20" viewBox="0 0 17.5 17.5" fill="none">
          <path d={svgPaths.p2861a580} fill="black" fillOpacity="0.6" />
        </svg>
      </button>
      {/* new chat icon */}
      <button className="shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f7f7f7]">
        <svg width="20" height="20" viewBox="0 0 18.3333 18.75" fill="none">
          <path d={svgPaths.pad1cb00} fill="black" fillOpacity="0.6" />
        </svg>
      </button>

      {title && (
        <p className="absolute left-0 right-0 text-center text-[14px] font-medium leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] truncate px-[80px] pointer-events-none">
          {title}
        </p>
      )}

      <div className="flex-1" />
    </div>
  );
}

// ── home page ─────────────────────────────────────────────────────────────────

const SUGGESTIONS = ["找出近一周的邮件", "请帮我起草一封给团队的邮件", "总结下智能助手项目邮件"];

function HomeView({ input, onInputChange, onSend }: {
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="relative w-full h-screen bg-white overflow-hidden flex flex-col">
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>

      {/* background glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[756px] h-[400px] rounded bg-gradient-to-r from-[#a3ffff] to-[#1e63f5] opacity-10 blur-[100px]" />
      </div>

      <ChatHeader />

      {/* center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-[24px] pt-[48px] pb-0">
        <div className="w-full max-w-[800px] flex flex-col items-center gap-0">

          {/* greeting */}
          <div className="flex items-baseline gap-[8px] py-[32px]">
            <span className="text-[46px] font-medium leading-[56px] text-[rgba(0,0,0,0.88)] tracking-[0.046px]">
              Hi，xxxx
            </span>
            <span className="w-[16px] h-[4px] bg-[rgba(0,0,0,0.88)] self-end mb-[10px] shrink-0" style={{ animation: "blink 1s step-end infinite" }} />
          </div>

          {/* divider + chips */}
          <div className="flex flex-col items-center w-full pb-[20px]">
            <div className="flex items-center gap-[8px] pt-[32px] pb-[20px]">
              <svg width="80" height="1" viewBox="0 0 80 1" fill="none">
                <path d="M0 0.5H80" stroke="url(#gl)" />
                <defs>
                  <linearGradient id="gl" x1="0" y1="1" x2="80" y2="1" gradientUnits="userSpaceOnUse">
                    <stop stopOpacity="0" /><stop offset="1" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-[14px] font-medium leading-[22px] text-[rgba(0,0,0,0.38)] tracking-[0.014px] whitespace-nowrap">试试这些</span>
              <svg width="80" height="1" viewBox="0 0 80 1" fill="none">
                <path d="M0 0.5H80" stroke="url(#gr)" />
                <defs>
                  <linearGradient id="gr" x1="0" y1="1" x2="80" y2="1" gradientUnits="userSpaceOnUse">
                    <stop stopOpacity="0.3" /><stop offset="1" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-[12px]">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={s}
                  onClick={() => onInputChange(s)}
                  className="flex items-center gap-[10px] px-[8px] py-[8px] bg-[#f7f7f7] hover:bg-[#f2f2f2] rounded-[8px] transition-colors cursor-pointer"
                >
                  <AIIcon uid={`s${i}`} />
                  <span className="text-[14px] leading-[22px] text-[rgba(0,0,0,0.88)] tracking-[0.014px] whitespace-nowrap">{s}</span>
                </button>
              ))}
            </div>
          </div>

          {/* input */}
          <div className="w-full mt-[12px]">
            <ChatInput value={input} onChange={onInputChange} onSend={onSend} />
          </div>
        </div>
      </div>

      {/* disclaimer */}
      <div className="flex items-center justify-center p-[4px] shrink-0">
        <span className="text-[10px] leading-normal text-[rgba(0,0,0,0.26)] tracking-[0.01px]">内容由AI生成，仅供参考</span>
      </div>
    </div>
  );
}

// ── chat view ─────────────────────────────────────────────────────────────────

type Message = { role: "user" | "ai"; text: string; thinking?: boolean };

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[680px] bg-[#f7f7f7] px-[12px] py-[8px] rounded-tl-[8px] rounded-br-[8px] rounded-bl-[8px]">
        <p className="text-[16px] leading-[26px] text-[rgba(0,0,0,0.88)] whitespace-pre-wrap break-words">{text}</p>
      </div>
    </div>
  );
}

function AIThinking() {
  return (
    <div className="flex items-center gap-[6px] py-[4px]">
      {[0, 200, 400].map((d) => (
        <span key={d} className="w-[6px] h-[6px] rounded-full bg-[rgba(0,0,0,0.26)] inline-block" style={{ animation: `blink 1s ${d}ms step-end infinite` }} />
      ))}
    </div>
  );
}

function ChatView({ messages, input, onInputChange, onSend }: {
  messages: Message[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const title = messages[0]?.text.slice(0, 20) + (messages[0]?.text.length > 20 ? "…" : "");

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden flex flex-col">
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      <ChatHeader title={title} />

      <div className="flex-1 flex flex-col items-center pt-[48px] px-[24px] pb-0 min-h-0">
        <div className="w-full max-w-[800px] flex flex-col flex-1 min-h-0">
          {/* messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 py-[16px]">
            <div className="flex flex-col gap-[32px]">
              {messages.map((msg, i) =>
                msg.role === "user" ? (
                  <UserBubble key={i} text={msg.text} />
                ) : (
                  <div key={i}>
                    {msg.thinking ? <AIThinking /> : (
                      <p className="text-[16px] leading-[26px] text-[rgba(0,0,0,0.88)] whitespace-pre-wrap">{msg.text}</p>
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
      </div>

      <div className="flex items-center justify-center p-[4px] shrink-0">
        <span className="text-[10px] leading-normal text-[rgba(0,0,0,0.26)] tracking-[0.01px]">内容由AI生成，仅供参考</span>
      </div>
    </div>
  );
}

// ── root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("生成PPT");

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }, { role: "ai", text: "", thinking: true }]);
    setTimeout(() => {
      setMessages((prev) => {
        const next = [...prev];
        const idx = next.findLastIndex((m) => m.thinking);
        if (idx !== -1) next[idx] = { role: "ai", text: "好的，我来帮您处理这个请求。" };
        return next;
      });
    }, 1200);
  };

  if (messages.length > 0) {
    return <ChatView messages={messages} input={input} onInputChange={setInput} onSend={handleSend} />;
  }

  return <HomeView input={input} onInputChange={setInput} onSend={handleSend} />;
}
