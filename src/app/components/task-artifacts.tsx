import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { OperationMenu } from "./operation-menu";

export type TaskArtifactExtension = "pdf" | "docx" | "xlsx" | "pptx" | "html" | "eml";
export type TaskArtifact = { id: string; name: string; extension: TaskArtifactExtension; size: string };
export type LocatedTaskArtifact = TaskArtifact & { messageIndex: number };

const ARTIFACT_ICONS: Record<TaskArtifactExtension, string> = {
  pdf: "/assets/418be.svg",
  docx: "/assets/38bd7.svg",
  xlsx: "/assets/1d052.svg",
  eml: "/assets/77217.svg",
  pptx: "/assets/fe2e1.svg",
  html: "/assets/03e9e.svg",
};

const ARTIFACT_LABELS: Record<TaskArtifactExtension, string> = {
  pdf: "PDF",
  docx: "Word",
  xlsx: "Excel",
  eml: "EML",
  pptx: "PPT",
  html: "HTML",
};

export function SmallTip({ label, side = "bottom", children }: { label: string; side?: "top" | "bottom"; children: ReactNode }) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={4}
            collisionPadding={8}
            className="z-[500] rounded-[4px] bg-[#181818] px-[8px] py-[4px] font-['PingFang_SC:Regular'] text-[12px] font-normal leading-[20px] tracking-[0.012px] whitespace-nowrap text-[rgba(255,255,255,0.98)] drop-shadow-[0_0_6px_rgba(0,0,0,0.08)]"
          >
            {label}
            <TooltipPrimitive.Arrow asChild width={27} height={4}>
              <span className="relative block h-[4px] w-[27px]">
                <span className="absolute inset-[-182.84%_0_0_0]">
                  <img alt="" className="block size-full max-w-none" src="/assets/453fe.svg" />
                </span>
              </span>
            </TooltipPrimitive.Arrow>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

function ArtifactIconButton({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <SmallTip label={label} side="top">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className="flex size-[24px] shrink-0 cursor-pointer items-start rounded-[4px] p-[4px] hover:bg-[#ebf4ff] focus-visible:bg-[#ebf4ff] focus-visible:outline-none"
      >
        <span aria-hidden className="relative size-[16px] shrink-0">
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={icon} />
        </span>
      </button>
    </SmallTip>
  );
}

function ArtifactFileInfo({ artifact }: { artifact: TaskArtifact }) {
  return (
    <>
      <span aria-hidden className="relative size-[32px] shrink-0">
        <img alt="" className="absolute inset-0 block size-full max-w-none" src={ARTIFACT_ICONS[artifact.extension]} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start whitespace-nowrap font-['PingFang_SC:Regular'] font-normal">
        <span className="w-full truncate text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)]">{artifact.name}</span>
        <span className="w-full truncate text-[12px] leading-[20px] tracking-[0.012px] text-[rgba(0,0,0,0.38)]">
          {ARTIFACT_LABELS[artifact.extension]} · {artifact.size}
        </span>
      </span>
    </>
  );
}

export function ArtifactFileCard({ artifact, onDownload }: { artifact: TaskArtifact; onDownload: (artifact: TaskArtifact) => void }) {
  return (
    <div data-artifact-id={artifact.id} className="group flex h-[50px] min-w-0 items-center gap-[8px] rounded-[8px] bg-[#f7f7f7] px-[8px] transition-colors">
      <ArtifactFileInfo artifact={artifact} />
      <span className="hidden group-hover:flex group-focus-within:flex">
        <ArtifactIconButton label="下载" icon="/assets/2aa92.svg" onClick={() => onDownload(artifact)} />
      </span>
    </div>
  );
}

export function TaskArtifactsButton({ artifacts, onLocate, onDownload }: {
  artifacts: LocatedTaskArtifact[];
  onLocate: (artifact: LocatedTaskArtifact) => void;
  onDownload: (artifact: TaskArtifact) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest("[data-radix-popper-content-wrapper]")) return;
      setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <SmallTip label="产物">
        <button
          ref={triggerRef}
          type="button"
          aria-label="产物"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(current => !current)}
          className={`flex size-[24px] shrink-0 cursor-pointer items-start overflow-clip rounded-[4px] border p-[3px] ${open ? "border-white bg-[#f2f2f2]" : "border-transparent hover:bg-[#f7f7f7]"}`}
        >
          <span aria-hidden className="relative size-[16px] shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src="/assets/2e4bf.svg" />
          </span>
        </button>
      </SmallTip>
      {open && (
        <OperationMenu
          ref={panelRef}
          anchor={triggerRef.current}
          align="end"
          gap={2}
          role="dialog"
          aria-label="产物"
          className={`flex w-[256px] flex-col gap-[12px] rounded-[8px] border border-[#f2f2f2] bg-white p-[12px] drop-shadow-[0_0_6px_rgba(0,0,0,0.08)] ${artifacts.length ? "items-start" : "items-center"}`}
        >
          {artifacts.length ? artifacts.map(artifact => (
            <div key={artifact.id} className="group flex h-[56px] w-full shrink-0 items-center gap-[8px] rounded-[8px] bg-[#f7f7f7] px-[8px]">
              <ArtifactFileInfo artifact={artifact} />
              <span className="hidden items-center gap-[8px] group-hover:flex group-focus-within:flex">
                <ArtifactIconButton label="定位到消息位置" icon="/assets/b120a.svg" onClick={() => { setOpen(false); onLocate(artifact); }} />
                <ArtifactIconButton label="下载" icon="/assets/2aa92.svg" onClick={() => onDownload(artifact)} />
              </span>
            </div>
          )) : (
            <div className="flex w-[200px] shrink-0 flex-col items-center justify-end">
              <div className="relative mb-[-22px] size-[200px] shrink-0 overflow-clip">
                <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src="/assets/c0d09.png" />
              </div>
              <p className="whitespace-nowrap font-['PingFang_SC:Regular'] text-[14px] font-normal leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.38)]">暂无文件</p>
            </div>
          )}
        </OperationMenu>
      )}
    </>
  );
}
