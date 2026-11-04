import { DiagArrow } from '../ui/Parts.jsx';

// CLONE_SPEC-PAGES §1.5. Rows reuse the shared .list_row border hover (#CECECE → #120DF7,
// 500ms) and the §0.5 diagonal-arrow pair. Motion: one reveal on the list, rows staggered
// 0.25s (opacity + width 50% → 100%); arrow hover a-31/a-32 is Animation's.
export default function Products({ heading, items }) {
  return (
    <section className="section_our_products">
      <div className="padding-global">
        <div className="container-main">
          <div className="our_products_element">
            <div className="our_products_header">
              <h2 className="text-size-h2 caps">{heading}</h2>
            </div>
            <div className="our_products_list" data-motion="products-list">
              {items.map((it) => (
                <a key={it.name} href={it.href} target={it.target} className="product_link list_row" data-motion="product-link">
                  <div className="product_name_wrapper">
                    <div className="text-size-medium">{it.name}</div>
                  </div>
                  <div className="text-size-regular">{it.desc}</div>
                  <div className="our_products_arrow_wrapper">
                    <DiagArrow iconClass="products_arrow_icon" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
