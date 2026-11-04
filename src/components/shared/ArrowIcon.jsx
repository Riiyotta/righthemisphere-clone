// The original's arrow_icon.svg as an <img> (team links, project links, 404-free icons).
export const ARROW_ICON = '/images/6a8827216cb56caa7e99ca4e_arrow_icon.svg';
export default function ArrowIcon({ className = '' }) {
  return <img src={ARROW_ICON} alt="" loading="lazy" className={className} />;
}
