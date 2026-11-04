// CLONE_SPEC-PAGES §2.2. Row/header scroll interactions are dont-animate on every
// breakpoint in the original, so rows are static. Whole table: load-timeline hook only.
export default function ServicesTable({ header, services }) {
  return (
    <section className="section_services_detail">
      <div className="padding-global">
        <div className="container-main">
          <div className="services_in_detail_list_element" data-motion="services-table">
            <div className="services_in_detail_wrapper">
              <div className="services_in_detail_header">
                {header.map((h) => (
                  <div key={h} className="text-size-small color-grey">
                    {h}
                  </div>
                ))}
              </div>
              <div className="services_in_detail_list">
                {services.map((s) => (
                  <div key={s.num} className="service_in_detail_item">
                    <div className="service_in_detail_name">
                      <div className="service_in_detail_number">{s.num}</div>
                      <div className="text-size-medium">{s.name}</div>
                    </div>
                    <div className="service_in_detail_deliverable">
                      <div className="text-size-regular">{s.deliverables}</div>
                    </div>
                    <div className="service_in_detail_cost">
                      <div className="service_cost_wrapper">
                        <div className="text-size-regular color-grey">{s.costLabel}</div>
                      </div>
                      <div className="text-size-regular">{s.cost}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
