// UI glyphs inlined from the original SVG files (public/images/*.svg) so they
// keep currentColor for the hover colour swaps. Geometry is the original's.

// Right arrow, 20x20 viewBox ("black/blue test foward.svg").
export function ArrowRight({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M14.7147 11.1283H0.965821L0.96582 8.86975H14.7147L8.39079 2.54583L10 0.964844L19.0342 9.99902L10 19.0332L8.39079 17.4522L14.7147 11.1283Z" />
    </svg>
  );
}

// Diagonal (north-east) arrow, 20x20 viewBox ("black/blue test.svg").
export function ArrowNE({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M15.2277 6.61641L4.01271 17.8314L2.17041 15.9891L13.3854 4.77412H3.06853L3.09156 2.17188H17.8299V16.9102L15.2277 16.9333V6.61641Z" />
    </svg>
  );
}

// Diagonal arrow, 16x16 viewBox ("arrow_icon.svg"): hero button, one award row.
export function ArrowNESmall({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M13.0573 4.44454L1.8423 15.6595L0 13.8172L11.215 2.60224H0.898119L0.921148 0H15.6595V14.7384L13.0573 14.7614V4.44454Z" />
    </svg>
  );
}

// Plus, 24x24 viewBox ("add.svg").
export function Plus({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11 21V13H3V11H11V3H13V11H21V13H13V21H11Z" />
    </svg>
  );
}

// Minus, 24x24 viewBox ("subtract.svg").
export function Minus({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 13V11H21V13H3Z" />
    </svg>
  );
}

// Menu, 10x10 ("menu_icon.svg"). Inline <svg> clips to its viewport, matching the original clipPath.
export function MenuGlyph({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
      <rect width="10" height="0.921875" />
      <rect y="4.53906" width="10" height="0.921875" />
      <rect y="9.07812" width="10" height="0.921875" />
    </svg>
  );
}

// Close, 10x10 ("menu_close.svg").
export function CloseGlyph({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
      <rect x="0.84668" y="0.195312" width="12.6154" height="0.921875" transform="rotate(45 0.84668 0.195312)" />
      <rect width="12.6154" height="0.921875" transform="matrix(-0.707107 0.707107 0.707107 0.707107 9.13379 0.214844)" />
    </svg>
  );
}
