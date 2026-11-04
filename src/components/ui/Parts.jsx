import { ArrowNE, ArrowNESmall, ArrowRight } from './Icons.jsx';

// §0.5 button_v2: label + sliding right-arrow pair + 1px underline.
// Motion hooks: .button_v2, .button_line, .btn_v2_arrow_wrapper, .arrow_mid.left/.right
export function ButtonV2({ label, href = '#', className = '', as: Tag = 'a' }) {
  const props = Tag === 'a' ? { href } : {};
  return (
    <Tag className={`button_v2 ${className}`} data-motion="button" {...props}>
      <span className="text-size-medium">{label}</span>
      <span className="btn_v2_arrow_wrapper" data-motion="button-arrow">
        <ArrowRight className="arrow_mid left text-accent" />
        <ArrowRight className="arrow_mid right text-ink" />
      </span>
      <span className="button_line" data-motion="button-line" />
    </Tag>
  );
}

// §0.5 diagonal-arrow pair. sizeClass sets the box (12px default).
// bottomVariant reproduces two quirks of the original award list: 'black' (the hover
// arrow is the black file) and 'small' (the hover arrow is arrow_icon.svg).
export function DiagArrow({ sizeClass = 'w-12 h-12', iconClass = '', bottomVariant }) {
  const Bottom = bottomVariant === 'small' ? ArrowNESmall : ArrowNE;
  return (
    <span className={`arrow_pair ${sizeClass}`} data-motion="diag-arrow">
      <ArrowNE className={`default ${iconClass}`} />
      <Bottom className={`bottom ${iconClass} ${bottomVariant === 'black' ? '!text-ink' : ''}`} />
    </span>
  );
}

// Brand: logo mark (16×24.875) + two-line text wordmark (80×28).
export function Brand({ className = '', wordmarkClass = 'w-wordmark', href = '/' }) {
  return (
    <a href={href} className={`brand flex items-start gap-8 text-ink ${className}`}>
      <img src="/images/6a8827216cb56caa7e99ca33_logo.svg" alt="" className="logo_img h-logo w-logo" data-motion="logo" />
      <span className={`brand_wordmark block h-28 text-brand ${wordmarkClass}`}>
        Right
        <br />
        Hemisphere
      </span>
    </a>
  );
}
