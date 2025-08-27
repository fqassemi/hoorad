// components/nuway-loader.jsx
"use client";
import { useEffect } from "react";

export default function NuwayLoader() {
  useEffect(() => {
    // if already appended, do nothing
    if (document.getElementById("nuway-chatbot-script-js")) return;

    const s = document.createElement("script");
    s.src = "https://staging.nuway.co/js/chatbot-loader.js";
    s.defer = true;
    s.id = "nuway-chatbot-script-js";
    s.setAttribute("nuway-company-id", "5668737373962240"); // your real id
    s.setAttribute("nuway-url", "https://staging.nuway.co"); // your real url
    document.body.appendChild(s);

    // optional cleanup if you ever unmount
    return () => {
      const el = document.getElementById("nuway-chatbot-script-js");
      if (el) el.remove();
    };
  }, []);

  return null;
}
