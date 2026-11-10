import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { OperationMenu } from "./operation-menu";
import { EXAMPLE_FILES } from "./attachment-picker";
import { formatFileSize, getAttachmentExtension, getAttachmentValidationError } from "./attachment-tray";

export type SourceStatus = "enabled" | "disabled" | "failed" | "processing";
export type ProjectFile = {
  id: string;
  name: string;
  owner: string;
  createdAt: number;
  status: SourceStatus;
} & ({ blob: Blob; url?: never; size?: never } | { url: string; size: number; blob?: never });
export type ProjectFiles = { sources: ProjectFile[]; artifacts: ProjectFile[] };

const statuses: SourceStatus[] = ["enabled", "processing", "disabled", "failed", "enabled"];
export const DEMO_PROJECT_FILES: ProjectFiles = {
  sources: EXAMPLE_FILES.map((file, index) => ({
    ...file, id: `source-${index}`, owner: ["Aiden Chen", "Maya Lin", "Ethan Wu", "Sophie Zhang", "Liam Huang"][index],
    createdAt: new Date(2021, 6, 8).getTime(), status: statuses[index],
  })),
  artifacts: EXAMPLE_FILES.map((file, index) => ({
    ...file, id: `artifact-${index}`, owner: index < 3 ? ["Aiden Chen", "Maya Lin", "Ethan Wu"][index] : "任务名称",
    createdAt: new Date(2021, 6, 8).getTime(), status: "enabled",
  })),
};

const STATUS_LABELS: Record<SourceStatus, string> = { enabled: "已启用", disabled: "停用", failed: "失败", processing: "处理中" };
const STATUS_ICONS: Record<SourceStatus, string> = { enabled: "eb6f2", disabled: "6c389", failed: "7a72a", processing: "f798a" };

export function getSourceActions(status: SourceStatus) {
  if (status === "processing") return ["删除"];
  if (status === "failed") return ["重试", "删除"];
  return [status === "enabled" ? "停用" : "启用", "下载", "删除"];
}

function fileIcon(name: string) {
  const extension = getAttachmentExtension(name);
  if (extension === "pdf") return "18532";
  if (["doc", "docx"].includes(extension)) return "7957f";
  if (["xls", "xlsx", "csv"].includes(extension)) return "569df";
  if (["ppt", "pptx"].includes(extension)) return "d14e7";
  if (["html", "md"].includes(extension)) return "ea65a";
  if (["jpg", "jpeg", "png"].includes(extension)) return "23ed1";
  return "75599";
}

export function ProjectFilesPanel({ kind, files, onChange }: {
  kind: "sources" | "artifacts";
  files: ProjectFiles;
  onChange: (files: ProjectFiles) => void;
}) {
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState<{ id: string; anchor: HTMLButtonElement } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [downloading, setDownloading] = useState(false);
  const source = kind === "sources";
  const records = files[kind];
  const visible = records.filter(file => file.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const selected = records.find(file => file.id === menu?.id);

  useEffect(() => {
    if (!menu) return;
    const close = (event: PointerEvent) => {
      if (event.target instanceof Node && !menu.anchor.contains(event.target) && !menuRef.current?.contains(event.target)) setMenu(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menu]);

  const download = async (file: ProjectFile) => {
    setDownloading(true);
    try {
      let blob = file.blob;
      if (file.url) {
        const response = await fetch(file.url);
        if (!response.ok) throw new Error(`下载失败 (${response.status})`);
        blob = await response.blob();
      }
      if (!blob?.size) throw new Error("文件内容不存在，无法下载");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "下载失败，请重试");
    } finally {
      setDownloading(false);
    }
  };

  const operate = (action: string, file: ProjectFile) => {
    if (action === "下载") void download(file);
    else if (action === "删除") onChange({ ...files, [kind]: records.filter(item => item.id !== file.id) });
    else if (action === "上传到项目资料") {
      if (files.sources.some(item => item.id === `uploaded-${file.id}`)) toast.info("该文件已在项目资料中");
      else {
        onChange({ ...files, sources: [...files.sources, { ...file, id: `uploaded-${file.id}`, owner: "我", createdAt: Date.now(), status: "enabled" }] });
        toast.success("已上传到项目资料");
      }
    } else {
      onChange({ ...files, sources: records.map(item => item.id === file.id ? { ...item, status: action === "停用" ? "disabled" : action === "重试" ? "processing" : "enabled" } : item) });
    }
    setMenu(null);
  };

  const actions = selected ? source ? getSourceActions(selected.status) : ["上传到项目资料", "下载", "删除"] : [];
  const columns = source ? "minmax(240px,1fr) 120px 120px 120px 120px" : "minmax(240px,1fr) 120px 120px 120px";

  return (
    <div className="flex min-h-0 flex-1 flex-col" data-project-files={kind}>
      {(records.length > 0 || source) && (
        <div className="flex h-[56px] shrink-0 items-center justify-between gap-[12px]">
          <label className="flex h-[32px] w-[256px] min-w-0 items-center gap-[8px] rounded-[4px] bg-[#f7f7f7] pl-[8px] pr-[16px]">
            <img src="/assets/11400.svg" alt="" className="shrink-0" />
            <input aria-label="搜索文件名称" placeholder="搜索文件名称" value={query} onChange={event => { setQuery(event.target.value); setMenu(null); }} className="min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-[22px] outline-none placeholder:text-[rgba(0,0,0,0.38)]" />
          </label>
          {source && (
            <button type="button" onClick={() => uploadRef.current?.click()} className="flex h-[32px] w-[117px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[4px] border border-[#1e63f5] px-[16px] text-[14px] font-normal leading-[22px] text-[#1e63f5]">
              <img src="/assets/72ef3.svg" alt="" />上传文件
            </button>
          )}
        </div>
      )}
      <input ref={uploadRef} aria-label="上传项目来源文件" type="file" multiple hidden onChange={event => {
        const additions: ProjectFile[] = [];
        for (const file of Array.from(event.target.files ?? [])) {
          const error = getAttachmentValidationError(file);
          if (error) {
            toast.error(`${file.name}：${error === "format" ? "不支持该文件格式" : error === "empty" ? "文件为空" : "文件大小超出限制"}`);
            continue;
          }
          additions.push({ id: crypto.randomUUID(), name: file.name, blob: file, owner: "我", createdAt: Date.now(), status: "enabled" });
        }
        if (additions.length) onChange({ ...files, sources: [...files.sources, ...additions] });
        event.target.value = "";
      }} />
      {visible.length > 0 ? (
        <div className="min-h-0 flex-1 overflow-auto">
          <table className={`w-full table-fixed border-collapse text-left text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)] ${source ? "min-w-[720px]" : "min-w-[600px]"}`}>
            <thead>
              <tr className="grid h-[40px] items-center text-[rgba(0,0,0,0.6)]" style={{ gridTemplateColumns: columns }}>
                {["文件名", source ? "上传人" : "来源", source ? "上传时间" : "生成时间", ...(source ? ["状态"] : []), "大小"].map(label => <th key={label} className="px-[8px] font-normal">{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {visible.map(file => (
                <tr key={file.id} data-project-file={file.id} data-file-status={file.status} className={`group relative grid h-[48px] items-center border-t border-[#f2f2f2] hover:z-[1] hover:bg-white hover:shadow-[0_0_8px_rgba(0,0,0,0.08)] focus-within:z-[1] focus-within:shadow-[0_0_8px_rgba(0,0,0,0.08)] ${menu?.id === file.id ? "z-[1] shadow-[0_0_8px_rgba(0,0,0,0.08)]" : ""}`} style={{ gridTemplateColumns: columns }}>
                  <td className="flex min-w-0 items-center gap-[8px] px-[8px]">
                    <span className="size-[16px] shrink-0"><span className={`inline-flex origin-top-left ${fileIcon(file.name) === "18532" ? "size-[24px] scale-[0.666667]" : ""}`}><img src={`/assets/${fileIcon(file.name)}.svg`} alt="" className="max-w-none" /></span></span>
                    <span className="truncate" title={file.name}>{file.name}</span>
                  </td>
                  <td className="truncate px-[8px]" title={file.owner}>{file.owner}</td>
                  <td className="px-[8px]">{new Date(file.createdAt).toLocaleDateString("sv-SE").replace(/-/g, "/")}</td>
                  {source && <td className={`flex items-center gap-[8px] px-[8px] ${file.status === "processing" ? "text-[#1e63f5]" : ""}`}><img src={`/assets/${STATUS_ICONS[file.status]}.svg`} alt="" className={file.status === "processing" ? "animate-spin" : ""} />{STATUS_LABELS[file.status]}</td>}
                  <td className="relative px-[8px] pr-[32px]">
                    {formatFileSize(file.blob ? file.blob.size : file.size)}
                    <button type="button" aria-label={`文件操作 ${file.name}`} aria-haspopup="menu" aria-expanded={menu?.id === file.id} onClick={event => setMenu(menu?.id === file.id ? null : { id: file.id, anchor: event.currentTarget })} className={`absolute top-1/2 right-[8px] flex size-[24px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-[4px] bg-[#f7f7f7] group-hover:visible group-focus-within:visible [@media(hover:none)]:visible ${menu?.id === file.id ? "visible" : "invisible"}`}>
                      <img src="/assets/64110.svg" alt="" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`flex flex-col items-center ${records.length ? "pt-[4px]" : source ? "-mt-[40px]" : "pt-[16px]"}`}>
          <img src="/assets/c0d09.png" alt="" className="size-[320px] max-w-full object-contain" />
          <p className="-mt-[54px] pb-[32px] text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.38)]">{records.length ? "没有匹配的文件" : "暂无文件"}</p>
        </div>
      )}
      {menu && selected && (
        <OperationMenu ref={menuRef} anchor={menu.anchor} gap={8} role="menu" aria-label={source ? "来源文件操作" : "产物文件操作"} onKeyDown={event => {
          if (event.key === "Escape") { menu.anchor.focus(); setMenu(null); }
        }} className="w-[192px] rounded-[12px] border border-[#f2f2f2] bg-white px-[8px] py-[4px] shadow-[0_0_12px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col py-[4px]">
            {actions.map(action => (
              <button key={action} type="button" role="menuitem" disabled={downloading && action === "下载"} onClick={() => operate(action, selected)} className="flex w-full cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] py-[11px] text-left text-[14px] font-normal leading-[22px] tracking-[0.014px] hover:bg-[#f7f7f7] disabled:opacity-40">
                <img src={`/assets/${action === "停用" ? "415d1" : action === "重试" ? "6863e" : action === "启用" ? "c7dee" : action === "下载" ? "1d2af" : action === "删除" ? "5ff6b" : "d6cab"}.svg`} alt="" />{action}
              </button>
            ))}
          </div>
        </OperationMenu>
      )}
    </div>
  );
}
