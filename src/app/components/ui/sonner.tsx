"use client";

import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";
import "./sonner.css";

const Toaster = ({ className, icons, toastOptions, ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      className={["toaster", className].filter(Boolean).join(" ")}
      icons={{
        success: <img src="/assets/3486a.svg" alt="" />,
        error: <img src="/assets/c60ad.svg" alt="" />,
        warning: <img src="/assets/ad55b.svg" alt="" />,
        info: <img src="/assets/c6dca.svg" alt="" />,
        loading: <img className="toast-loading-icon" src="/assets/afd96.svg" alt="" />,
        close: <img src="/assets/ec4ff.svg" alt="" />,
        ...icons,
      }}
      toastOptions={{ closeButtonAriaLabel: "关闭提示", ...toastOptions }}
      {...props}
    />
  );
};

export { Toaster };
