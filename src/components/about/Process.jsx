// CLONE_SPEC-PAGES §1.3
export default function Process({ heading, text }) {
  return (
    <section className="section_our_process">
      <div className="padding-global">
        <div className="container-main">
          <div className="our_process_element">
            <div className="our_process_header">
              <h2 className="text-size-h2 caps">{heading}</h2>
            </div>
            <div className="text-size-medium">{text}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
