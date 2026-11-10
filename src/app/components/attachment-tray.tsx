import { useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { OperationMenu } from "./operation-menu";

export type AttachmentStatus = "uploading" | "processing" | "ready" | "failed" | "parse-error" | "expired";

export type ChatAttachment = {
  id: string;
  file: File;
  name: string;
  size: number;
  extension: string;
  image: boolean;
  previewUrl?: string;
  status: AttachmentStatus;
};

export const MAX_ATTACHMENTS = 10;

const SIZE_LIMITS_MB: Record<string, number> = {
  png: 20,
  jpg: 20,
  jpeg: 20,
  pdf: 100,
  ppt: 100,
  pptx: 100,
  doc: 50,
  docx: 50,
  xls: 50,
  xlsx: 50,
  csv: 50,
  txt: 20,
  md: 20,
  html: 20,
  eml: 50,
  msg: 50,
};

export function getAttachmentExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function getAttachmentValidationError(file: File): "format" | "size" | "empty" | null {
  if (!file.size) return "empty";
  const extension = getAttachmentExtension(file.name);
  const limit = SIZE_LIMITS_MB[extension];
  if (!limit) return "format";
  if (file.size > limit * 1024 * 1024) return "size";
  return null;
}

export function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))}K`;
  const megabytes = size / (1024 * 1024);
  return `${Number.isInteger(megabytes) ? megabytes : megabytes.toFixed(1)}M`;
}

export function getAttachmentIcon(extension: string) {
  if (extension === "pdf") return "/assets/attachment-pdf.svg";
  if (["doc", "docx"].includes(extension)) return "/assets/attachment-word.svg";
  if (["xls", "xlsx", "csv"].includes(extension)) return "/assets/attachment-excel.svg";
  if (["eml", "msg"].includes(extension)) return "/assets/attachment-email.svg";
  if (extension === "html") return "/assets/79f75.svg";
  return "/assets/attachment-file.svg";
}

function statusLabel(status: AttachmentStatus) {
  if (status === "uploading") return "上传中";
  if (status === "processing") return "解析中";
  if (status === "failed") return "上传失败";
  if (status === "parse-error") return "解析失败";
  if (status === "expired") return "文件已失效";
  return null;
}

function AttachmentTile({
  attachment,
  onRemove,
  imageSize,
  fileWidth,
  compact = false,
}: {
  attachment: ChatAttachment;
  onRemove: (id: string) => void;
  imageSize: number;
  fileWidth: number | string;
  compact?: boolean;
}) {
  const label = statusLabel(attachment.status);
  const hasError = ["failed", "parse-error", "expired"].includes(attachment.status);
  const isPending = attachment.status === "uploading" || attachment.status === "processing";
  const removeIcon = "/assets/attachment-remove.svg";

  if (attachment.image && !compact) {
    return (
      <div
        className="attachment-image group relative shrink-0"
        style={{ width: imageSize, height: imageSize }}
        title={`${attachment.name}${label ? ` · ${label}` : ""}`}
      >
        {attachment.previewUrl ? (
          <img src={attachment.previewUrl} alt={attachment.name} className="size-full rounded-[8px] object-cover" />
        ) : (
          <div className="size-full rounded-[8px] bg-[#f7f7f7]" />
        )}
        {label && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center gap-[4px] rounded-[8px] bg-black/45 text-[11px] text-white ${hasError ? "bg-[#fff4f0]/95 text-[#fc5926]" : ""}`}>
            {hasError ? <TriangleAlert size={16} /> : <LoaderCircle size={16} className="animate-spin" />}
            <span>{label}</span>
          </div>
        )}
        <button
          type="button"
          aria-label={`移除附件 ${attachment.name}`}
          title="移除附件"
          onClick={() => onRemove(attachment.id)}
          className={`absolute -right-[8px] -top-[8px] z-10 flex size-[16px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 ${hasError ? "opacity-100" : ""}`}
        >
          <img src={removeIcon} alt="" width="16" height="16" className="block group-hover:hidden group-focus-within:hidden" />
          <img src="/assets/attachment-remove-hover.svg" alt="" width="16" height="16" className="hidden group-hover:block group-focus-within:block" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`attachment-file group relative flex h-[56px] min-w-0 shrink-0 items-center gap-[8px] rounded-[8px] bg-[#f7f7f7] px-[8px] ${compact ? "w-full" : ""}`}
      style={compact ? undefined : { width: fileWidth }}
      title={`${attachment.name}${label ? ` · ${label}` : ""}`}
    >
      {isPending ? (
        <img src="/assets/attachment-loading-file.svg" alt="" width="32" height="32" className="shrink-0" />
      ) : attachment.image ? (
        <img src={attachment.previewUrl} alt="" className={`shrink-0 rounded-[4px] object-cover ${compact ? "size-[40px]" : "size-[40px]"}`} />
      ) : (
        <img src={getAttachmentIcon(attachment.extension)} alt="" width="32" height="32" className="shrink-0" />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">{attachment.name}</span>
        {isPending ? (
          <span className="flex min-w-0 items-center gap-[4px] text-[12px] leading-[20px] tracking-[0.012px] text-[#1e63f5]">
            <img src="/assets/attachment-loading.svg" alt="" width="16" height="16" className="shrink-0" />
            <span className="truncate">{label}</span>
          </span>
        ) : (
          <span className={`truncate text-[12px] leading-[20px] tracking-[0.012px] ${hasError ? "text-[#fc5926]" : "text-[rgba(0,0,0,0.38)]"}`}>
            {label ?? `${attachment.extension.toUpperCase()} · ${formatFileSize(attachment.size)}`}
          </span>
        )}
      </div>
      <button
        type="button"
        aria-label={`移除附件 ${attachment.name}`}
        title="移除附件"
        onClick={() => onRemove(attachment.id)}
        className={`absolute -right-[8px] -top-[8px] z-10 flex size-[16px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 ${hasError ? "opacity-100" : ""}`}
      >
        <img src={removeIcon} alt="" width="16" height="16" className="block group-hover:hidden group-focus-within:hidden" />
        <img src="/assets/attachment-remove-hover.svg" alt="" width="16" height="16" className="hidden group-hover:block group-focus-within:block" />
      </button>
    </div>
  );
}

const ATTACHMENT_GAP = 8;
const OVERFLOW_WIDTH = 32;
const MIN_FILE_WIDTH = 178;
const MAX_FILE_WIDTH = 280;

function getVisibleLayout(width: number, attachments: ChatAttachment[]) {
  if (!width || !attachments.length) return { count: attachments.length, fileWidth: MIN_FILE_WIDTH, imageSize: 56 };

  const hasFiles = attachments.some(item => !item.image);
  const imageSize = hasFiles
    ? 56
    : Math.min(120, Math.max(56, (width - ATTACHMENT_GAP * (attachments.length - 1)) / attachments.length));

  for (let count = attachments.length; count >= 0; count--) {
    const hasOverflow = count < attachments.length;
    const visible = attachments.slice(0, count);
    const imageCount = visible.filter(item => item.image).length;
    const fileCount = visible.length - imageCount;
    const itemCount = count + (hasOverflow ? 1 : 0);
    const gapsWidth = Math.max(0, itemCount - 1) * ATTACHMENT_GAP;
    const fixedWidth = imageCount * imageSize + (hasOverflow ? OVERFLOW_WIDTH : 0) + gapsWidth;
    const calculatedFileWidth = fileCount ? (width - fixedWidth) / fileCount : MIN_FILE_WIDTH;

    if (calculatedFileWidth >= MIN_FILE_WIDTH || fileCount === 0) {
      return {
        count,
        fileWidth: Math.min(MAX_FILE_WIDTH, calculatedFileWidth),
        imageSize,
      };
    }
  }

  return { count: 0, fileWidth: MIN_FILE_WIDTH, imageSize };
}

export function AttachmentTray({
  attachments,
  onRemove,
}: {
  attachments: ChatAttachment[];
  onRemove: (id: string) => void;
}) {
  const trayRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState(0);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const orderedAttachments = useMemo(
    () => [...attachments.filter(item => item.image), ...attachments.filter(item => !item.image)],
    [attachments],
  );
  const { count: visibleCount, fileWidth, imageSize } = getVisibleLayout(width, orderedAttachments);
  const visibleAttachments = orderedAttachments.slice(0, visibleCount);
  const hiddenAttachments = orderedAttachments.slice(visibleCount);

  useEffect(() => {
    const element = trayRef.current;
    if (!element) return;
    setWidth(element.getBoundingClientRect().width);
    const observer = new ResizeObserver(entries => setWidth(entries[0]?.contentRect.width ?? 0));
    observer.observe(element);
    return () => observer.disconnect();
  }, [attachments.length > 0]);

  useEffect(() => {
    if (!overflowOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!overflowRef.current?.contains(event.target as Node)
        && !(event.target instanceof Element && event.target.closest("[data-operation-menu]"))) {
        setOverflowOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [overflowOpen]);

  useEffect(() => {
    if (!hiddenAttachments.length) setOverflowOpen(false);
  }, [hiddenAttachments.length]);

  if (!attachments.length) return null;

  const trayError = hiddenAttachments.some(item => ["failed", "parse-error", "expired"].includes(item.status));
  const trayLoading = hiddenAttachments.some(item => item.status === "uploading" || item.status === "processing");
  const expandedAttachments = [...orderedAttachments].sort((a, b) => {
    const priority: Record<AttachmentStatus, number> = {
      failed: 0,
      "parse-error": 0,
      expired: 0,
      uploading: 1,
      processing: 1,
      ready: 2,
    };
    return priority[a.status] - priority[b.status];
  });

  return (
    <div ref={trayRef} className="relative mb-[8px] flex w-full items-center gap-[8px] overflow-visible">
      {visibleAttachments.map(attachment => (
        <AttachmentTile
          key={attachment.id}
          attachment={attachment}
          onRemove={onRemove}
          imageSize={imageSize}
          fileWidth={fileWidth}
        />
      ))}
      {hiddenAttachments.length > 0 && (
        <>
          <button
            ref={overflowRef}
            type="button"
            aria-label={`查看另外 ${hiddenAttachments.length} 个附件`}
            aria-expanded={overflowOpen}
            onClick={() => setOverflowOpen(open => !open)}
            className={`flex h-[56px] w-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] bg-[#f7f7f7] text-[12px] ${trayError ? "text-[#fc5926]" : "text-[rgba(0,0,0,0.6)]"}`}
          >
            {trayLoading && !trayError ? <LoaderCircle size={16} className="animate-spin" /> : `+${hiddenAttachments.length}`}
          </button>
          {overflowOpen && (
            <OperationMenu
              anchor={overflowRef.current}
              className="w-[360px] max-w-[calc(100vw-16px)] overflow-hidden rounded-[12px] border border-[#f2f2f2] bg-white shadow-[0_0_12px_rgba(0,0,0,0.12)]"
            >
              <div className="max-h-[320px] overflow-y-auto p-[8px]">
                <div className="flex flex-col gap-[8px]">
                  {expandedAttachments.map(attachment => (
                    <AttachmentTile
                      key={attachment.id}
                      attachment={attachment}
                      onRemove={onRemove}
                      imageSize={56}
                      fileWidth="100%"
                      compact
                    />
                  ))}
                </div>
              </div>
            </OperationMenu>
          )}
        </>
      )}
    </div>
  );
}
