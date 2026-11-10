import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "./ui/dialog";
import { OperationMenu } from "./operation-menu";
import { getAvatarInitial } from "./avatar-initial";

export type ProjectMember = {
  id: string;
  name: string;
  color: string;
  role: "管理员" | "使用者";
};

const EXAMPLE_MEMBERS: ProjectMember[] = [
  { id: "example-1", name: "吴那", color: "#1e63f5", role: "使用者" },
  { id: "example-2", name: "钱桂英", color: "#00bfc4", role: "使用者" },
  { id: "example-3", name: "赵玉芝", color: "#00c853", role: "使用者" },
  { id: "example-4", name: "李冠英", color: "#ff2442", role: "使用者" },
  { id: "example-5", name: "赵轩海", color: "#ffcc00", role: "使用者" },
  { id: "example-6", name: "吴金根", color: "#9254ff", role: "使用者" },
];

function SettingsDialog({ title, closeIcon, rounded, onClose, onSave, disabled = false, children }: {
  title: string;
  closeIcon: string;
  rounded: string;
  onClose: () => void;
  onSave: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent aria-describedby={undefined} className={`flex max-h-[calc(100dvh-32px)] w-[720px] max-w-[calc(100%-32px)] flex-col gap-0 overflow-hidden border-0 bg-white p-0 shadow-[0_0_12px_rgba(0,0,0,0.08)] sm:max-w-[calc(100%-32px)] ${rounded} [&>button]:hidden`}>
        <div className="relative shrink-0 px-[24px] py-[16px]">
          <DialogTitle className="text-[16px] font-medium leading-[24px] tracking-[0.016px] text-[rgba(0,0,0,0.88)]">{title}</DialogTitle>
          <DialogClose asChild>
            <button type="button" aria-label={`关闭${title}弹窗`} className="absolute right-[24px] top-[16px] flex size-[24px] items-center justify-center rounded-[4px] hover:bg-[#f7f7f7]">
              <img src={closeIcon} alt="" />
            </button>
          </DialogClose>
        </div>
        {children}
        <div className="flex shrink-0 items-center justify-end gap-[24px] p-[24px]">
          <DialogClose asChild>
            <button type="button" className="rounded-[4px] px-[4px] py-[3px] text-[14px] font-normal leading-[22px] text-[rgba(0,0,0,0.6)] hover:bg-[#f7f7f7]">取消</button>
          </DialogClose>
          <button type="button" disabled={disabled} onClick={onSave} className="rounded-[4px] bg-[#1e63f5] px-[16px] py-[5px] text-[14px] font-normal leading-[22px] text-white hover:bg-[#4788ff] active:bg-[#0e45cf] disabled:bg-[#99c3ff] disabled:text-white/55">确定</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectInstructionDialog({ instruction, onClose, onSave }: {
  instruction: string;
  onClose: () => void;
  onSave: (instruction: string) => void;
}) {
  const [draft, setDraft] = useState(instruction);
  return (
    <SettingsDialog title="指令" closeIcon="/assets/f802d.svg" rounded="rounded-[12px]" onClose={onClose} onSave={() => onSave(draft.trim())} disabled={draft.trim() === instruction.trim()}>
      <div className="min-h-0 px-[24px]" style={{ height: 466 }}>
        <div className="relative flex h-full flex-col overflow-hidden rounded-[8px] border border-[#e6e6e6] focus-within:border-[#1e63f5]">
          <textarea aria-label="项目指令" maxLength={1000} value={draft} onChange={event => setDraft(event.target.value)} placeholder="为项目内所有会话设定共同遵守的规则" className="block min-h-0 w-full flex-1 resize-none overflow-y-auto bg-white p-[12px] text-[14px] leading-[22px] tracking-[0.014px] text-[rgba(0,0,0,0.88)] outline-none placeholder:text-[rgba(0,0,0,0.26)]" />
          <div className="relative h-[32px] shrink-0">
            <span aria-live="polite" className="absolute bottom-[4px] right-[20px] text-[12px] leading-[20px] tracking-[0.012px] text-[rgba(0,0,0,0.38)]">{draft.length}/1000</span>
            <img src="/assets/166cb.svg" alt="" className="pointer-events-none absolute bottom-[4px] right-[4px]" />
          </div>
        </div>
      </div>
    </SettingsDialog>
  );
}

export function ProjectMemberTag({ member }: { member: Pick<ProjectMember, "name" | "color"> }) {
  return (
    <span className="inline-flex h-[24px] max-w-full items-center gap-[4px] rounded-[16px] bg-[#f7f7f7] pl-[2px] pr-[8px] text-[12px] font-normal leading-[20px] tracking-[0.012px] text-[rgba(0,0,0,0.6)]">
      <span className="flex size-[20px] shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: member.color }}>{getAvatarInitial(member.name)}</span>
      <span className="truncate">{member.name}</span>
    </span>
  );
}

export function ProjectMembersDialog({ members, onClose, onSave }: {
  members: ProjectMember[];
  onClose: () => void;
  onSave: (members: ProjectMember[]) => void;
}) {
  const [draft, setDraft] = useState(members);
  const [search, setSearch] = useState("");
  const [roleMenu, setRoleMenu] = useState<{ id: string; anchor: HTMLButtonElement } | null>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);
  const matches = EXAMPLE_MEMBERS.filter(member => member.name.includes(search.trim()));

  useEffect(() => {
    if (!roleMenu) return;
    const close = (event: MouseEvent) => {
      if (!roleMenu.anchor.contains(event.target as Node) && !roleMenuRef.current?.contains(event.target as Node)) setRoleMenu(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [roleMenu]);

  return (
    <SettingsDialog title="选择成员" closeIcon="/assets/db1cc.svg" rounded="rounded-[8px]" onClose={onClose} onSave={() => onSave(draft)}>
      <div className="min-h-0 overflow-y-auto px-[24px]">
        <div className="flex h-[312px] overflow-hidden rounded-[8px] border border-[#f2f2f2] max-[560px]:h-auto max-[560px]:min-h-[312px] max-[560px]:flex-col">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="shrink-0 border-b border-black/5 px-[16px] py-[8px]">
              <label className="flex h-[32px] items-center gap-[8px] rounded-[4px] bg-[#f7f7f7] pl-[8px] pr-[16px]">
                <img src="/assets/11400.svg" alt="" className="shrink-0" />
                <input aria-label="搜索成员" value={search} onChange={event => setSearch(event.target.value)} placeholder="搜索" className="min-w-0 flex-1 bg-transparent text-[14px] leading-[22px] outline-none placeholder:text-[rgba(0,0,0,0.38)]" />
              </label>
            </div>
            <div className="min-h-0 max-h-[264px] overflow-y-auto px-[8px]">
              {matches.map(member => {
                const selected = draft.some(item => item.id === member.id);
                return (
                  <button key={member.id} type="button" aria-label={`选择${member.name}`} aria-pressed={selected} onClick={() => setDraft(current => selected ? current.filter(item => item.id !== member.id) : [...current, member])} className="flex h-[44px] w-full items-center justify-between rounded-[8px] px-[8px] py-[10px] hover:bg-[#f7f7f7]">
                    <ProjectMemberTag member={member} />
                    {selected && <img src="/assets/ecd73.svg" alt="" />}
                  </button>
                );
              })}
              {matches.length === 0 && <p role="status" className="px-[8px] py-[10px] text-[14px] leading-[22px] text-[rgba(0,0,0,0.38)]">暂无匹配成员</p>}
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col border-l border-[#f2f2f2] px-[16px] max-[560px]:border-l-0 max-[560px]:border-t">
            <p aria-live="polite" className="shrink-0 pb-[16px] pt-[16px] text-[14px] leading-[22px] text-[rgba(0,0,0,0.6)]">已选：{draft.length}个</p>
            <div className="flex min-h-0 max-h-[264px] flex-col gap-[16px] overflow-y-auto pb-[8px]">
              {draft.map(member => (
                <div key={member.id} className="flex min-h-[28px] items-center gap-[16px]">
                  <div className="min-w-0 flex-1"><ProjectMemberTag member={member} /></div>
                  <div className="flex shrink-0 items-center gap-[10px]">
                    <button type="button" aria-label={`${member.name}角色：${member.role}`} aria-haspopup="menu" aria-expanded={roleMenu?.id === member.id} onClick={event => setRoleMenu(roleMenu?.id === member.id ? null : { id: member.id, anchor: event.currentTarget })} className="flex items-center gap-[8px] rounded-[4px] px-[4px] py-[3px] text-[14px] font-normal leading-[22px] text-[rgba(0,0,0,0.88)] hover:bg-[#f7f7f7]">
                      {member.role}<img src="/assets/27bf2.svg" alt="" />
                    </button>
                    <button type="button" aria-label={`移除${member.name}`} onClick={() => { setDraft(current => current.filter(item => item.id !== member.id)); setRoleMenu(null); }} className="flex size-[24px] items-center justify-center rounded-[4px] hover:bg-[#f7f7f7]"><img src="/assets/6bde7.svg" alt="" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {roleMenu && (
        <OperationMenu ref={roleMenuRef} role="menu" anchor={roleMenu.anchor} className="w-[168px] rounded-[12px] border border-[#f2f2f2] bg-white p-[8px] shadow-[0_0_12px_rgba(0,0,0,0.08)]">
          {(["管理员", "使用者"] as const).map(role => (
            <button key={role} type="button" role="menuitem" onClick={() => { setDraft(current => current.map(member => member.id === roleMenu.id ? { ...member, role } : member)); setRoleMenu(null); }} className="w-full rounded-[8px] px-[8px] py-[11px] text-left text-[14px] font-normal leading-[22px] text-[rgba(0,0,0,0.88)] hover:bg-[#f7f7f7]">{role}</button>
          ))}
        </OperationMenu>
      )}
    </SettingsDialog>
  );
}
