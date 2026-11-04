import { useState } from 'react';

// CLONE_SPEC-PAGES §4.2. Native HTML5 validation only (all four fields required).
// LOCAL STUB: the original AJAX-posts to Webflow (Turnstile, data-redirect="/") and then
// navigates home. Here submit is prevented, nothing is sent, and after a valid submit the
// page navigates to "/" (the original's redirect). Set data-state="done"/"fail" on
// .contact_form_block to preview the success / #FFDEDE error blocks.
export default function ContactForm({ form }) {
  const [state, setState] = useState(null);
  const [name, email, budget, description, submit] = form.fields;

  const onSubmit = (e) => {
    e.preventDefault();
    // Stub of Webflow's success path: data-redirect wins over the .w-form-done block.
    if (form.redirect) {
      window.location.href = form.redirect;
    } else {
      setState('done');
    }
  };

  return (
    <section className="section_contact">
      <div className="padding-global">
        <div className="container-main">
          <div className="contact_page_form_element">
            <div className="contact_form_block w-form" data-state={state ?? undefined} data-motion="contact-form-block">
              <form
                id={form.name}
                name={form.name}
                data-name="Email Form"
                method={form.method}
                data-redirect={form.redirect}
                className="contact_form"
                onSubmit={onSubmit}
              >
                <div className="contact_form_lement_title_wrap">
                  <div className="text-size-large" data-motion="contact-form-title">
                    {form.title}
                  </div>
                </div>
                <div className="contact_foem_block_1">
                  <input
                    className="text_field contact mobile_ul w-input"
                    maxLength={256}
                    name={name.name}
                    data-name={name.dataName}
                    placeholder={name.placeholder}
                    type={name.type}
                    id={name.name}
                    required
                  />
                  <input
                    className="text_field contact w-input"
                    maxLength={256}
                    name={email.name}
                    data-name={email.dataName}
                    placeholder={email.placeholder}
                    type={email.type}
                    id={email.name}
                    required
                  />
                  <div className="line" />
                </div>
                <div className="contact_foem_block_1">
                  <select
                    id={budget.name}
                    name={budget.name}
                    data-name={budget.dataName}
                    required
                    className="select_field w-select"
                    defaultValue=""
                  >
                    {budget.options.map((o) => (
                      <option key={o.label} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <div className="line" />
                </div>
                <div className="contact_foem_block_2">
                  <textarea
                    required
                    placeholder={description.placeholder}
                    maxLength={5000}
                    id={description.name}
                    name={description.name}
                    data-name={description.dataName}
                    className="text_area mobile_ul w-input"
                  />
                  <input type="submit" data-wait="Please wait..." className="btn_submit w-button" value={submit.value} />
                  <div className="line" />
                </div>
                {/* Webflow injects an (invisible) Cloudflare Turnstile container here; it is a
                    zero-height flex item that still adds one 40px gap. Inert placeholder. */}
                <div className="turnstile_placeholder" aria-hidden="true">
                  <div />
                </div>
              </form>
              <div className="success-message w-form-done">
                <div className="text-size-large">
                  {form.success.split('\n')[0]}
                  <br />
                  {form.success.split('\n')[1]}
                </div>
              </div>
              <div className="w-form-fail">
                <div>{form.error}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
