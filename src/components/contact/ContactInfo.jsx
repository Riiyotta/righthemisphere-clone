// CLONE_SPEC-PAGES §4.1. Load hook: .contact_info_wrapper opacity (contact-info).
const CLASSES = ['contact_phone_info', 'contact_email_info', 'contact_address_info'];

const lines = (v) =>
  v.split('\n').map((l, i) => (
    <span key={i}>
      {l}
      <br />
    </span>
  ));

export default function ContactInfo({ info }) {
  return (
    <section className="section_contact_info">
      <div className="padding-global">
        <div className="container-main">
          <div className="contact_info_wrapper" data-motion="contact-info">
            {info.map((it, i) => (
              <div key={it.label} className={CLASSES[i]}>
                <div className="text-size-small color-grey">{it.label}</div>
                {it.href ? (
                  <a href={it.href} className="text-size-regular">
                    {lines(it.value)}
                  </a>
                ) : (
                  <div className="text-size-regular">{lines(it.value)}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
