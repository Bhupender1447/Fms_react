import { useEffect } from 'react';

// Reference counts protect shared styles when route shells overlap or StrictMode
// mounts twice. Only nodes created by this module are removed on cleanup.
const styles = new Map();
export function acquireStylesheets(hrefs, owner) {
  const keys = [...new Set(hrefs)].map((href) => new URL(href, document.baseURI).href);
  keys.forEach((key) => {
    const existing = styles.get(key);
    if (existing) { existing.references += 1; return; }
    const borrowed = [...document.querySelectorAll('link[rel="stylesheet"]')].find((link) => link.href === key);
    const node = borrowed || document.createElement('link');
    if (!borrowed) {
      node.rel = 'stylesheet'; node.href = key; node.dataset.isoLayoutStyle = owner;
      document.head.appendChild(node);
    }
    styles.set(key, { node, owned: !borrowed, references: 1 });
  });
  let released = false;
  return () => {
    if (released) return;
    released = true;
    keys.forEach((key) => {
      const entry = styles.get(key);
      if (!entry) return;
      entry.references -= 1;
      if (entry.references === 0) {
        if (entry.owned) entry.node.remove();
        styles.delete(key);
      }
    });
  };
}

export function useLayoutStyles(hrefs, owner) {
  useEffect(() => acquireStylesheets(hrefs, owner), [hrefs, owner]);
}

const scripts = new Map();
export function loadLayoutScript(src) {
  if (scripts.has(src)) return scripts.get(src);
  const request = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => { scripts.delete(src); script.remove(); reject(new Error('Layout script could not load.')); };
    document.body.appendChild(script);
  });
  scripts.set(src, request);
  return request;
}
