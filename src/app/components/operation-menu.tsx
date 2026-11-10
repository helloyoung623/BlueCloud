import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, HTMLAttributes } from "react";
import { createPortal } from "react-dom";

type OperationMenuProps = HTMLAttributes<HTMLDivElement> & {
  anchor: HTMLElement | null;
  submenu?: boolean;
  gap?: number;
  align?: "start" | "end";
};

export function getSubmenuPlacement(
  anchor: Pick<DOMRect, "left" | "top" | "bottom">,
  parent: Pick<DOMRect, "left" | "right">,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
) {
  const padding = 8;
  const gap = 4;
  const availableHeight = Math.max(0, viewportHeight - padding * 2);
  if (parent.right + gap + width <= viewportWidth - padding) {
    return { side: "right", left: parent.right + gap, top: anchor.top, availableHeight };
  }
  if (parent.left - gap - width >= padding) {
    return { side: "left", left: parent.left - gap - width, top: anchor.top, availableHeight };
  }
  const above = Math.max(0, anchor.top - gap - padding);
  if (height <= above) {
    return { side: "top", left: anchor.left, top: anchor.top - gap - height, availableHeight: above };
  }
  const below = Math.max(0, viewportHeight - anchor.bottom - gap - padding);
  return { side: "bottom", left: anchor.left, top: anchor.bottom + gap, availableHeight: below };
}

export const OperationMenu = forwardRef<HTMLDivElement, OperationMenuProps>(
  ({ anchor, submenu = false, gap = 0, align = "start", children, style, onMouseDown, ...props }, forwardedRef) => {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState<CSSProperties>({ visibility: "hidden" });

    useLayoutEffect(() => {
      if (!anchor || !menuRef.current) return;
      const menu = menuRef.current;
      const update = () => {
        const rect = anchor.getBoundingClientRect();
        const padding = 8;
        const viewportHeight = window.innerHeight;
        const below = Math.max(0, viewportHeight - rect.bottom - padding - gap);
        const above = Math.max(0, rect.top - padding - gap);
        const height = menu.scrollHeight + menu.offsetHeight - menu.clientHeight;
        const opensAbove = height > below;
        const width = Math.min(menu.offsetWidth, window.innerWidth - padding * 2);
        const parent = anchor.closest("[data-operation-menu]");
        const placement = submenu
          ? getSubmenuPlacement(rect, parent?.getBoundingClientRect() ?? rect, width, height, window.innerWidth, viewportHeight)
          : null;
        const available = placement?.availableHeight ?? (opensAbove ? above : below);
        const renderedHeight = Math.min(height, available);
        const top = placement?.top ?? (opensAbove ? rect.top - gap - renderedHeight : rect.bottom + gap);
        setPosition({
          position: "fixed",
          left: Math.max(padding, Math.min(placement?.left ?? (align === "end" ? rect.right - width : rect.left), window.innerWidth - width - padding)),
          top: Math.max(padding, Math.min(top, viewportHeight - renderedHeight - padding)),
          maxWidth: window.innerWidth - padding * 2,
          maxHeight: available,
          overflowY: height > available ? "auto" : undefined,
          pointerEvents: "auto",
          visibility: "visible",
        });
      };
      update();
      const observer = new ResizeObserver(update);
      observer.observe(menu);
      observer.observe(anchor);
      window.addEventListener("resize", update);
      window.addEventListener("scroll", update, true);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", update);
        window.removeEventListener("scroll", update, true);
      };
    }, [anchor, submenu, gap, align]);

    return createPortal(
      <div
        {...props}
        data-operation-menu=""
        data-operation-submenu={submenu || undefined}
        ref={node => {
          menuRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        style={{ ...style, ...position, zIndex: 400 }}
        onMouseDown={event => {
          event.stopPropagation();
          onMouseDown?.(event);
        }}
      >
        {children}
      </div>,
      document.body,
    );
  },
);
OperationMenu.displayName = "OperationMenu";
