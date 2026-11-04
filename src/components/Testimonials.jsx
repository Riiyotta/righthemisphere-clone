import { useState } from 'react';
import { ArrowRight } from './ui/Icons.jsx';

// §9. 6 slides.
const HEADING = 'Testimonials';
const SLIDES = [
  {
    quote:
      '"Working with Right Hemisphere was undeniably, one of our best collaborative work experiences so far. Their depth of knowledge, a knack for problem-solving, sincerity and integrity in work; and above all, a keen attention to detail made them an absolute pleasure to work with!"',
    author: 'Co-founder, Pigeon & Co',
  },
  {
    quote: '"Right Hemisphere\u2019s design was not only pleasing but their experimental approach ensured our site looked different"',
    author: 'Franchise Owner, Cafe Mocha',
  },
  {
    quote:
      '"Right Hemisphere\u2019s design practice is unmatched. The team\'s dedication to client satisfaction sets them apart. We couldn\'t be more pleased with the outcome."',
    author: 'CEO, Lynchpin',
  },
  {
    quote:
      '"Right Hemisphere transformed our online presence! Their website design and development expertise exceeded our expectations. The team\'s professionalism and attention to detail made the process seamless."',
    author: 'CEO, GlobalReach',
  },
  {
    quote:
      '"Website visitors increased month by month due to our social media campaigns. They are extremely knowledgeable in digital marketing and highly enthusiastic. The team has the ability to think outside the box and I would definitely recommend them to others."',
    author: 'CEO, SRD Group',
  },
  {
    quote: '"Love what you guys did for Esah. A lot of our customers appreciate your work."',
    author: 'CEO, Esah tea',
  },
];
const PREV = 'Prev';
const NEXT = 'Next';

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const go = (d) => setIndex((i) => (i + d + SLIDES.length) % SLIDES.length); // infinite, no autoplay

  return (
    <section className="section_testimonials">
      <div className="padding-global">
        <div className="container-main">
          <div className="testimonial_element grid grid-cols-six items-start py-112 md:py-96 sm:flex sm:flex-col">
            <div className="testimonial_header col-start-1 col-end-3 row-start-1 pb-40 md:col-end-4">
              <h2 className="text-size-h2 caps">{HEADING}</h2>
            </div>

            <div className="testimonails_wrapper relative col-start-1 col-end-3 row-start-2 sm:w-full md:col-start-3 md:col-end-7 md:row-start-1">
              <div className="slider relative" data-motion="slider" data-index={index}>
                <div className="slider_mask relative grid h-mask overflow-hidden border-b border-solid border-rule">
                  {SLIDES.map((s, i) => (
                    <div
                      key={i}
                      className={`slide col-start-1 row-start-1 transition-opacity duration-250 ease-[ease] ${
                        // Webflow "outin" 500ms: current fades out over 250ms, then the next fades in
                        i === index ? 'opacity-100 delay-[250ms]' : 'pointer-events-none opacity-0'
                      }`}
                      aria-hidden={i !== index}
                      data-active={i === index}
                    >
                      <div className="testimonial_slide_element flex flex-col items-start gap-32 pb-4">
                        {/* only the first quote is .long-para on the original (line-split reveal); the rest get
                            the plain .text-size-medium fade while hidden, and nothing replays on slide change */}
                        <p className={i === 0 ? 'text-size-medium long-para' : 'text-size-medium'}>{s.quote}</p>
                        <div className="text-size-small color-grey">{s.author}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="testimonial_left_arrow slider_arrow absolute left-0 top-300.9 flex h-19 w-61 items-center gap-8 overflow-hidden uppercase"
                  onClick={() => go(-1)}
                  aria-label="Previous testimonial"
                >
                  <span className="arrow_pair h-14 w-14">
                    <ArrowRight className="prev default block h-full w-full rotate-180 text-ink" />
                    <ArrowRight className="prev right absolute left-full top-0 h-full w-full rotate-180 text-accent" />
                  </span>
                  <span className="slider_label text-size-regular caps">{PREV}</span>
                </button>
                <button
                  type="button"
                  className="testimonial_right_arrow slider_arrow absolute right-0 top-300.9 flex h-19 w-61 items-center justify-end gap-8 overflow-hidden uppercase"
                  onClick={() => go(1)}
                  aria-label="Next testimonial"
                >
                  <span className="slider_label text-size-regular caps">{NEXT}</span>
                  <span className="arrow_pair h-14 w-14">
                    <ArrowRight className="slider_icon default" />
                    <ArrowRight className="slider_icon left" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
