import { imgProps } from '../../data/content.js';
import ArrowIcon from '../shared/ArrowIcon.jsx';

// CLONE_SPEC-PAGES §1.2. Each .team_item is a 6-col grid: list row at cols 1–2, the hidden
// hover image at col 4. Motion: .team_item scroll reveal (opacity + width 20% → 100%),
// row hover a-10/a-11 (image scale 0 → 1, border → #000).
export default function Team({ heading, members }) {
  return (
    <section className="section_team">
      <div className="padding-global">
        <div className="container-main">
          <div className="about_element">
            <div className="about_us_element">
              <div className="about_detail_wrapper">
                <h2 className="text-size-h2 caps">{heading}</h2>
              </div>
            </div>
            <div className="team_detail_grid">
              <div className="team_list-wrapper">
                <div role="list" className="team_list">
                  {members.map((m) => (
                    <div role="listitem" key={m.num} className="team_item" data-motion="team-item">
                      <div className="team_list_item" data-motion="team-row">
                        <div className="team_name_element">
                          <div className="text-size-medium lh-115">{m.name}</div>
                          <div className="text-size-small">{m.role}</div>
                          <a href={m.link.href} target={m.link.target} className="team_social_link">
                            <div className="text-size-small">{m.link.text}</div>
                            <ArrowIcon className="team_arrow_icon" />
                          </a>
                        </div>
                        <div className="team_number_element">
                          <div className="text-size-medium lh-115">{m.num}</div>
                        </div>
                      </div>
                      <div className="team_image_grid" data-motion="team-image">
                        <img {...imgProps(m.image)} className="team_img" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
