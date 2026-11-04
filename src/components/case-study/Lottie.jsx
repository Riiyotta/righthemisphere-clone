import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

// Webflow lottie element (data-animation-type="lottie"): svg renderer, loop, autoplay.
// `lazy` mirrors data-loading="lazy" (load when near the viewport); eager loads on mount.
// Local copies of the original JSONs live in public/lottie/ (same filenames).
const localPath = (src) => `/lottie/${src.split('/').pop()}`;

export default function Lottie({ className, src, loop = true, autoplay = true, renderer = 'svg', lazy = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let anim;
    const load = () => {
      anim = lottie.loadAnimation({ container: el, renderer, loop, autoplay, path: localPath(src) });
    };
    if (!lazy || !('IntersectionObserver' in window)) {
      load();
      return () => anim && anim.destroy();
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (anim) anim.destroy();
    };
  }, [src, loop, autoplay, renderer, lazy]);

  return (
    <div
      ref={ref}
      className={className}
      data-animation-type="lottie"
      data-src={src}
      data-loop={loop ? '1' : '0'}
      data-autoplay={autoplay ? '1' : '0'}
      data-renderer={renderer}
      data-loading={lazy ? 'lazy' : 'eager'}
    />
  );
}
