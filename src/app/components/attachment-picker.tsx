import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { MAX_ATTACHMENTS, formatFileSize, getAttachmentIcon } from "./attachment-tray";
import type { ChatAttachment } from "./attachment-tray";
import { OperationMenu } from "./operation-menu";
import { PopoverContent } from "./ui/popover";
import type { ProjectFiles } from "./project-files";

export type AttachmentSource = "Outlook" | "OneDrive" | "SharePoint" | "项目资料" | "产物";
type FileKind = "all" | "image" | "document" | "email";

// Figma 9650:46400「Outlook 选择面板」邮件列表示例数据：
// 前 4 条为 64px 带头像行（时间 14px「2026年2月5日  22:23」），其余为 48px 紧凑行（发件人旁 12px 时间）
type ExampleEmail = { id: string; sender: string; avatar: string; avatarBg: string; avatarColor: string; title: string; body: string; time: string; compact?: boolean };

const OUTLOOK_EMAILS: ExampleEmail[] = [
  { id: "zhang-wei-q4", sender: "张伟", avatar: "张", avatarBg: "#e6fffa", avatarColor: "#12c2c2", title: "Q4 销售数据汇总及分析报告", body: "各位好，Q4 销售数据已经整理完毕，整体同比增长 12.5%，详细数据请见附件，有问题随时沟通。", time: "2026年2月5日  22:23" },
  { id: "li-na-review", sender: "李娜", avatar: "李", avatarBg: "#f0fdf4", avatarColor: "#22c45e", title: "关于下周产品评审会的安排", body: "评审会定于下周三下午 2 点在 3 号会议室举行，请各项目组提前准备好演示材料。", time: "2026年2月5日  18:47" },
  { id: "wang-qiang-contract", sender: "王强", avatar: "王", avatarBg: "#fff0f0", avatarColor: "#f1222e", title: "合同审批流程已提交，麻烦跟进", body: "世纪互联合作协议已进入法务审批环节，预计本周五完成，麻烦王总审阅。", time: "2026年2月5日  15:12" },
  { id: "chen-xiaomei-budget", sender: "陈晓梅", avatar: "陈", avatarBg: "#fffcf2", avatarColor: "#d9b40c", title: "2026 年预算调整方案征求意见", body: "按财务部要求，各部门需在本周五前反馈预算调整意见，逾期视为无异议。", time: "2026年2月4日  17:30" },
  { id: "liu-yang-weekly", sender: "刘洋", avatar: "刘", avatarBg: "#e6fffa", avatarColor: "#12c2c2", title: "智能助手项目周报（第 6 周）", body: "本周完成归档页面开发与可撤销 toast 联调，下周进行整体回归测试。", time: "2026年2月4日  11:20", compact: true },
  { id: "zhao-lei-visit", sender: "赵磊", avatar: "赵", avatarBg: "#e6fffa", avatarColor: "#12c2c2", title: "客户拜访安排确认", body: "已与世纪互联确认拜访时间为下周四上午，会议邀请已发出，请查收日历。", time: "2026年2月3日  16:05", compact: true },
  { id: "zhou-jie-training", sender: "周洁", avatar: "周", avatarBg: "#e6fffa", avatarColor: "#12c2c2", title: "新员工入职培训材料更新", body: "附件为最新版培训材料，请各部门负责人转发给近期入职的同事。", time: "2026年2月2日  09:41", compact: true },
  { id: "wu-min-server", sender: "吴敏", avatar: "吴", avatarBg: "#e6fffa", avatarColor: "#12c2c2", title: "服务器迁移窗口通知", body: "本周六 22:00-24:00 进行服务器迁移，期间服务可能短暂中断，请提前做好准备。", time: "2026年1月30日  19:08", compact: true },
  { id: "zheng-hao-design", sender: "郑浩", avatar: "郑", avatarBg: "#e6fffa", avatarColor: "#12c2c2", title: "设计评审反馈汇总", body: "针对 V2.0 设计稿的评审意见已汇总到文档，详见附件，预计下周三前完成修改。", time: "2026年1月29日  14:26", compact: true },
];

const emailFileName = (email: ExampleEmail) => `Outlook-${email.sender}-${email.id}.eml`;

const emailBlob = (email: ExampleEmail) => new Blob(
  [`From: ${email.sender} <demo@example.invalid>\r\nTo: team@example.invalid\r\nSubject: ${email.title}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${email.body}\r\n`],
  { type: "message/rfc822" },
);

// Figma 9650:46400「CheckBox Icon」：未选中 = 白底深描边 + 内部 9x9 浅灰；选中态稿中未给出，按产品语言用蓝底白勾
/* Figma 9650:46400「CheckBox Icon」：16x16 容器，内为 12x12 描边方框（描边 rgba(0,0,0,0.38)） */
function EmailCheckbox({ checked }: { checked: boolean }) {
  return (
    <img
      src={checked ? "/assets/checkbox-checked.svg" : "/assets/checkbox-unchecked.svg"}
      alt=""
      width={16}
      height={16}
      className="block size-[16px] shrink-0"
      aria-hidden
    />
  );
}


function examplePdf(title: string) {
  const stream = `BT /F1 18 Tf 48 780 Td (${title}) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let content = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(content.length);
    content += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = content.length;
  content += `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
  content += offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  return new Blob([`${content}trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`], { type: "application/pdf" });
}

type ExampleFile = { name: string; kind: Exclude<FileKind, "all">; extension: string } & (
  { url: string; size: number; blob?: never } | { blob: Blob; url?: never; size?: never }
);

export const EXAMPLE_FILES: ExampleFile[] = [
  { name: "项目现场照片.jpeg", kind: "image", extension: "jpeg", url: "/assets/attachment-example.jpeg", size: 61385 },
  { name: "项目方案与实施计划.pdf", kind: "document", extension: "pdf", blob: examplePdf("Example project plan") },
  { name: "项目资料索引.html", kind: "document", extension: "html", blob: new Blob(["<!doctype html><meta charset=\"utf-8\"><title>Example index</title><h1>Example project files</h1>"], { type: "text/html" }) },
  { name: "项目进展通知.eml", kind: "email", extension: "eml", blob: new Blob(["From: demo@example.invalid\r\nTo: team@example.invalid\r\nSubject: Example project update\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nThis is a local example attachment.\r\n"], { type: "message/rfc822" }) },
  { name: "项目交付说明.pdf", kind: "document", extension: "pdf", blob: examplePdf("Example delivery notes") },
];

const FILTERS: { value: FileKind; label: string }[] = [
  { value: "all", label: "全部类型" },
  { value: "image", label: "图片" },
  { value: "document", label: "文档" },
  { value: "email", label: "邮件文件" },
];

function PickerImage({ file }: { file: ExampleFile }) {
  const [preview, setPreview] = useState(file.url);
  useEffect(() => {
    if (!file.blob) {
      setPreview(file.url);
      return;
    }
    const url = URL.createObjectURL(file.blob);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file.blob, file.url]);
  return <img src={preview} alt="" className="size-[32px] shrink-0 rounded-[4px] object-cover" />;
}

export function AttachmentPicker({ source, hasProject, projectFiles, onSourceChange, attachments, onAddFiles, onRemove, onClose }: {
  source: AttachmentSource;
  hasProject: boolean;
  projectFiles?: ProjectFiles;
  onSourceChange: (source: AttachmentSource) => void;
  attachments: ChatAttachment[];
  onAddFiles: (files: File[]) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<FileKind>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [pendingName, setPendingName] = useState<string | null>(null);
  const pendingRef = useRef(false);
  const filterRef = useRef<HTMLButtonElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const projectRecords = source === "项目资料" ? projectFiles?.sources.filter(file => file.status === "enabled") : source === "产物" ? projectFiles?.artifacts : undefined;
  const availableFiles: ExampleFile[] = projectRecords ? projectRecords.map(file => {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const kind = ["jpg", "jpeg", "png"].includes(extension) ? "image" : ["eml", "msg"].includes(extension) ? "email" : "document";
    return file.blob
      ? { name: file.name, kind, extension, blob: file.blob }
      : { name: file.name, kind, extension, url: file.url, size: file.size };
  }) : EXAMPLE_FILES;
  const visibleFiles = availableFiles.filter(file =>
    (kind === "all" || file.kind === kind) && file.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );

  useEffect(() => {
    if (!filterOpen) return;
    const close = (event: PointerEvent) => {
      if (event.target instanceof Node && !filterRef.current?.contains(event.target) && !filterMenuRef.current?.contains(event.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [filterOpen]);

  const selectFile = async (item: typeof EXAMPLE_FILES[number]) => {
    const name = `${source}-${item.name}`;
    const selected = attachments.find(attachment => attachment.name === name);
    if (selected) {
      onRemove(selected.id);
      return;
    }
    if (pendingRef.current) return;
    if (attachments.length >= MAX_ATTACHMENTS) {
      toast.error(`最多上传 ${MAX_ATTACHMENTS} 个文件`);
      return;
    }
    pendingRef.current = true;
    setPendingName(name);
    try {
      let blob = item.blob;
      if (item.url) {
        const response = await fetch(item.url);
        if (!response.ok) throw new Error(`示例文件读取失败 (${response.status})`);
        blob = await response.blob();
      }
      if (!blob) throw new Error("示例文件内容不存在");
      onAddFiles([new File([blob], name, { type: blob.type })]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "无法读取示例文件，请重试");
    } finally {
      pendingRef.current = false;
      setPendingName(null);
    }
  };

  const selectEmail = (email: ExampleEmail) => {
    const name = emailFileName(email);
    const selected = attachments.find(attachment => attachment.name === name);
    if (selected) {
      onRemove(selected.id);
      return;
    }
    if (attachments.length >= MAX_ATTACHMENTS) {
      toast.error(`最多上传 ${MAX_ATTACHMENTS} 个文件`);
      return;
    }
    onAddFiles([new File([emailBlob(email)], name, { type: "message/rfc822" })]);
  };

  const visibleEmails = OUTLOOK_EMAILS.filter(email =>
    `${email.sender} ${email.title} ${email.body}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <PopoverContent
      side="top"
      align="start"
      sideOffset={8}
      collisionPadding={8}
      aria-label="选择工作内容"
      onOpenAutoFocus={event => {
        event.preventDefault();
        searchRef.current?.focus();
      }}
      onCloseAutoFocus={event => {
        event.preventDefault();
        onClose();
      }}
      onInteractOutside={event => {
        if (event.target instanceof Element && event.target.closest("[data-operation-menu]")) event.preventDefault();
      }}
      onEscapeKeyDown={event => {
        if (filterOpen) {
          event.preventDefault();
          setFilterOpen(false);
          filterRef.current?.focus();
        }
      }}
      className="z-[350] flex h-[420px] max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] flex-col gap-[16px] overflow-hidden rounded-[20px] border border-[#f2f2f2] bg-white pl-[16px] pr-0 pt-0 pb-[12px] shadow-[0_0_12px_rgba(0,0,0,0.08)]"
    >
      <div role="tablist" aria-label="文件来源" className="flex h-[48px] shrink-0 gap-[24px] overflow-x-auto border-b border-[#e6e6e6] pr-[16px]">
        {(["Outlook", "OneDrive", "SharePoint", "项目资料", "产物"] as const).filter(tab => tab !== "项目资料" || hasProject).map(tab => (
          <button
            key={tab}
            id={`${id}-${tab}`}
            type="button"
            role="tab"
            aria-selected={source === tab}
            aria-controls={`${id}-files`}
            onClick={() => {
              onSourceChange(tab);
              setQuery("");
              setKind("all");
              setFilterOpen(false);
            }}
            className={`h-[48px] shrink-0 cursor-pointer border-b-2 bg-transparent p-0 text-[16px] leading-[24px] tracking-[0.016px] ${source === tab ? "border-[#1e63f5] font-medium text-[#1e63f5]" : "border-transparent font-normal text-[rgba(0,0,0,0.6)]"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex shrink-0 items-center gap-[12px] pr-[16px]">
        <label className="flex h-[32px] min-w-0 flex-1 items-center gap-[8px] rounded-[8px] bg-[#f7f7f7] pl-[8px] pr-[16px]">
          <img src="/assets/11400.svg" alt="" className="shrink-0" />
          <input ref={searchRef} aria-label="搜索文件" value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索" className="min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-[22px] outline-none placeholder:text-[rgba(0,0,0,0.38)]" />
        </label>
        <button ref={filterRef} type="button" aria-label={`筛选文件：${FILTERS.find(filter => filter.value === kind)?.label}`} aria-haspopup="menu" aria-expanded={filterOpen} onClick={() => setFilterOpen(open => !open)} className={`flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] ${filterOpen || kind !== "all" ? "bg-[#ebf4ff]" : "hover:bg-[#f2f2f2]"}`}>
          <img src="/assets/6d02b.svg" alt="" />
        </button>
        {filterOpen && (
          <OperationMenu ref={filterMenuRef} anchor={filterRef.current} gap={4} role="menu" aria-label="文件类型" onKeyDown={event => {
            if (event.key === "Escape") {
              event.stopPropagation();
              setFilterOpen(false);
              filterRef.current?.focus();
            }
          }} className="w-[168px] rounded-[12px] border border-[#f2f2f2] bg-white p-[8px] shadow-[0_0_12px_rgba(0,0,0,0.08)]">
            {FILTERS.map(filter => (
              <button key={filter.value} type="button" role="menuitemradio" aria-checked={kind === filter.value} onClick={() => {
                setKind(filter.value);
                setFilterOpen(false);
              }} className={`flex w-full cursor-pointer rounded-[8px] px-[8px] py-[8px] text-left text-[14px] font-normal hover:bg-[#f2f2f2] ${kind === filter.value ? "text-[#1e63f5]" : ""}`}>{filter.label}</button>
            ))}
          </OperationMenu>
        )}
      </div>
      <div id={`${id}-files`} role="tabpanel" aria-labelledby={`${id}-${source}`} className="outlook-scroll min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
        {source === "Outlook" ? (
          /* Figma 9650:46400 —— 严格按稿：
             标准行 h64 = py8 + 内容48（cb 垂直居中 + 头像48 + 文本块 22+4+22）；
             间隙全部 8px（cb16+8+头像48+8+文本）；标题固定宽 480、正文接 8 间隙占剩余；
             时间 14px 右端贴行右缘；紧凑行 h48 无头像（第一行 cb+发件人+12px 时间，第二行 pl24 标题固定宽 496+正文）；
             行间 16px；文本颜色稿中全部纯黑 */
          <div className="flex flex-col gap-[16px]">
            {visibleEmails.map(email => {
              const name = emailFileName(email);
              const selected = attachments.some(attachment => attachment.name === name);
              return email.compact ? (
                <button
                  key={email.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selectEmail(email)}
                  className="flex h-[48px] w-full shrink-0 cursor-pointer flex-col justify-center gap-[4px] rounded-[8px] bg-transparent pr-[16px] text-left font-normal"
                >
                  <span className="flex h-[22px] items-center gap-[8px]">
                    <EmailCheckbox checked={selected} />
                    <span className="shrink-0 truncate text-[14px] leading-[22px] tracking-[0.014px] text-black">{email.sender}</span>
                    <span className="shrink-0 text-[12px] leading-[20px] tracking-[0.012px] text-black">{email.time}</span>
                  </span>
                  <span className="flex h-[22px] min-w-0 gap-[8px] pl-[24px]">
                    <span className="w-[496px] max-w-full min-w-0 shrink-0 truncate text-[14px] leading-[22px] tracking-[0.014px] text-black">{email.title}</span>
                    <span className="min-w-0 flex-1 truncate text-[14px] leading-[22px] tracking-[0.014px] text-black">{email.body}</span>
                  </span>
                </button>
              ) : (
                <button
                  key={email.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selectEmail(email)}
                  className="flex h-[64px] w-full shrink-0 cursor-pointer items-center gap-[8px] rounded-[8px] bg-transparent py-[8px] pr-[16px] text-left font-normal"
                >
                  <EmailCheckbox checked={selected} />
                  <span className="flex size-[48px] shrink-0 items-center justify-center rounded-full text-[20px] font-normal leading-[28px]" style={{ background: email.avatarBg, color: email.avatarColor }}>{email.avatar}</span>
                  <span className="flex h-[48px] min-w-0 flex-1 flex-col gap-[4px]">
                    <span className="flex h-[22px] items-baseline">
                      <span className="min-w-0 flex-1 truncate text-[14px] leading-[22px] tracking-[0.014px] text-black">{email.sender}</span>
                      <span className="shrink-0 pl-[12px] text-[14px] leading-[22px] tracking-[0.014px] text-black">{email.time}</span>
                    </span>
                    <span className="flex h-[22px] min-w-0 gap-[8px]">
                      <span className="w-[480px] max-w-full min-w-0 shrink-0 truncate text-[14px] leading-[22px] tracking-[0.014px] text-black">{email.title}</span>
                      <span className="min-w-0 flex-1 truncate text-[14px] leading-[22px] tracking-[0.014px] text-black">{email.body}</span>
                    </span>
                  </span>
                </button>
              );
            })}
            {!visibleEmails.length && <p className="py-[40px] text-center text-[14px] text-[rgba(0,0,0,0.38)]">没有匹配的邮件</p>}
          </div>
        ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,178px),1fr))] gap-x-[8px] gap-y-[16px]">
          {visibleFiles.map(item => {
            const name = `${source}-${item.name}`;
            const selected = attachments.some(attachment => attachment.name === name);
            const pending = pendingName === name;
            return (
              <button key={name} type="button" aria-label={item.name} aria-pressed={selected} aria-busy={pending} title={name} onClick={() => void selectFile(item)} className={`relative flex h-[56px] min-w-0 cursor-pointer items-center gap-[8px] rounded-[8px] border bg-[#f7f7f7] px-[8px] text-left font-normal ${selected ? "border-[#1c61f1]" : "border-transparent hover:border-[#1c61f1]"} ${pending ? "opacity-60" : ""}`}>
                {item.kind === "image" ? (
                  <PickerImage file={item} />
                ) : (
                  <img src={getAttachmentIcon(item.extension)} alt="" className="shrink-0" />
                )}
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">{item.name}</span>
                  <span className="truncate text-[12px] leading-[20px] tracking-[0.012px] text-[rgba(0,0,0,0.38)]">{pending ? "读取中" : `${item.extension.toUpperCase()} · ${formatFileSize(item.blob ? item.blob.size : item.size)}`}</span>
                </span>
                {selected && <img src="/assets/43df7.svg" alt="" className="absolute right-[2px] top-[2px]" />}
              </button>
            );
          })}
        {!visibleFiles.length && <p className="py-[40px] text-center text-[14px] text-[rgba(0,0,0,0.38)]">没有匹配的文件</p>}
        </div>
        )}
      </div>
      <span className="sr-only">当前使用本地示例文件，选中文件会添加到输入框附件。</span>
    </PopoverContent>
  );
}
