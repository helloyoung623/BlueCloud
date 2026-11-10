import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { MAX_ATTACHMENTS, formatFileSize, getAttachmentIcon } from "./attachment-tray";
import type { ChatAttachment } from "./attachment-tray";
import { OperationMenu } from "./operation-menu";
import { PopoverContent } from "./ui/popover";
import type { ProjectFiles } from "./project-files";

export type AttachmentSource = "OneDrive" | "项目资料" | "产物";
type FileKind = "all" | "image" | "document" | "email";

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
      className="z-[350] flex h-[420px] max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] flex-col gap-[16px] overflow-hidden rounded-[20px] border border-[#f2f2f2] bg-white px-[16px] pt-0 pb-[12px] shadow-[0_0_12px_rgba(0,0,0,0.08)]"
    >
      <div role="tablist" aria-label="文件来源" className="flex h-[48px] shrink-0 gap-[24px] overflow-x-auto border-b border-[#e6e6e6]">
        {(["Outlook", "OneDrive", "项目资料", "产物"] as const).filter(tab => tab !== "项目资料" || hasProject).map(tab => (
          <button
            key={tab}
            id={`${id}-${tab}`}
            type="button"
            role="tab"
            aria-selected={source === tab}
            aria-controls={`${id}-files`}
            onClick={() => {
              if (tab === "Outlook") {
                toast.info("Outlook 文件添加暂未接入");
                return;
              }
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
      <div className="flex shrink-0 items-center gap-[12px]">
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
      <div id={`${id}-files`} role="tabpanel" aria-labelledby={`${id}-${source}`} className="min-h-0 flex-1 overflow-y-auto">
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
        </div>
        {!visibleFiles.length && <p className="py-[40px] text-center text-[14px] text-[rgba(0,0,0,0.38)]">没有匹配的文件</p>}
      </div>
      <span className="sr-only">当前使用本地示例文件，选中文件会添加到输入框附件。</span>
    </PopoverContent>
  );
}
