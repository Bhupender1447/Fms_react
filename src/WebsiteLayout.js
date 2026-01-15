import React, { useEffect, useState } from "react";
import "./Websitelayout.css";

const WebsiteLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ---- CSS CDN Links ----
    const cssLinks = [
      "/websitecss/ISOVIA.CSS",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css",
      "https://unpkg.com/aos@2.3.1/dist/aos.css",
      "/websitecss/responsive.css",
      "/websitecss/responsiv-481-767.css",
      "/websitecss/responsive-768-1020.css",
    ];

    cssLinks.forEach((href) => {
      if (!document.querySelector(`link[to="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      }
    });

    // ---- JS Loader ----
    const loadScript = (src) =>
      new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });

    const jsScripts = [
      "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
      "https://unpkg.com/aos@2.3.1/dist/aos.js",
    ];

    (async () => {
      for (let src of jsScripts) {
        await loadScript(src);
      }

      // AOS Init
      if (window.AOS) {
        window.AOS.init({
          once: true,
          duration: 900,
          offset: 80,
        });
      }

      // GSAP ScrollTrigger enable
      if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
      }

      // ---- Hide Loader ----
      setTimeout(() => setLoading(false), 500);
    })();

    // ---- Tawk.to Chat ----
    const tawk = document.createElement("script");
    tawk.async = true;
    tawk.src = "https://embed.tawk.to/678b22ce3a8427326070e02b/1ihrnvtm2";
    tawk.charset = "UTF-8";
    tawk.setAttribute("crossorigin", "*");
    document.body.appendChild(tawk);

  }, []);

  return (
    <>
      {/* ---- Page Loader ---- */}
      {loading && (
        <div className="page-loader">
          <div className="spinner"></div>
        </div>
      )}

      <div className={`website-wrapper ${loading ? "blur-content" : ""}`}>
        {children}
      </div>
    </>
  );
};

export default WebsiteLayout;
