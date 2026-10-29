import React, { useEffect, useRef, useState } from 'react';
import './IsoviaHologram.css';

export default function IsoviaHologram({ className = '' }) {
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (reducedMotion || failed) return;
    const playback = videoRef.current?.play();
    playback?.catch(() => setFailed(true));
  }, [reducedMotion, failed]);
  return <span className={`iso-brand-hologram ${className}`} aria-hidden="true">
    {reducedMotion || failed
      ? <img src="/images/logo.png" alt="" />
      : <video ref={videoRef} src="/media/isovia-hologram.webm" autoPlay muted loop playsInline preload="auto" disablePictureInPicture onError={() => setFailed(true)} tabIndex={-1} />}
  </span>;
}
