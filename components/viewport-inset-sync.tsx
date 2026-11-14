"use client";

import { useEffect } from "react";

/**
 * 把软键盘高度写进 CSS 变量 --kb-inset。
 *
 * Android WebView / Chrome 弹出键盘时布局视口（100lvh / 100dvh）不会变化，
 * 底部输入栏会被键盘直接盖住。这里用 visualViewport 算出键盘占掉的高度，
 * 交给 CSS 收缩手机屏幕高度。
 */
export function ViewportInsetSync() {
  useEffect(() => {
    const root = document.documentElement;
    const vv = window.visualViewport;
    if (!vv) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      const inset = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      root.style.setProperty("--kb-inset", `${inset}px`);
      if (inset > 80) root.setAttribute("data-keyboard-open", "");
      else root.removeAttribute("data-keyboard-open");
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    vv.addEventListener("resize", schedule);
    vv.addEventListener("scroll", schedule);
    window.addEventListener("orientationchange", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      vv.removeEventListener("resize", schedule);
      vv.removeEventListener("scroll", schedule);
      window.removeEventListener("orientationchange", schedule);
      root.style.removeProperty("--kb-inset");
      root.removeAttribute("data-keyboard-open");
    };
  }, []);

  return null;
}
