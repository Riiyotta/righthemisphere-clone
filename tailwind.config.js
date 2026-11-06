/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

// CLONE_SPEC §0.2 fluid scale. Desktop formulas apply at every width unless
// an override is listed for ≤991 / ≤767.
const fluid = {
  base: {
    '--t10': 'clamp(8px, 5.347px + 0.2674vw, 10px)',
    '--t12': 'clamp(10px, 4.694px + 0.5348vw, 14px)',
    '--t14': 'clamp(10px, 3.986px + 0.607vw, 14px)',
    '--t16': 'clamp(12px, 5.986px + 0.607vw, 16px)',
    '--t20': 'clamp(16px, 9.986px + 0.607vw, 20px)',
    '--t24': 'clamp(20px, 13.986px + 0.607vw, 24px)',
    '--t32': 'clamp(24px, 11.970px + 1.214vw, 32px)',
    '--display': 'clamp(52px, 0.69px + 5.1724vw, 100px)',
    '--hero-sub': 'clamp(17px, 1.8103vw - 0.958px, 33.8px)',
  },
  md: {
    '--t14': '14px',
    '--t16': '14.4px',
    '--t20': '16px',
    '--t24': '20px',
    '--t32': '24px',
    '--display': 'clamp(40px, 29.485px + 2.6756vw, 56px)',
    '--hero-sub': '17px',
  },
  // .text-size-regular drops to .875rem only at ≤479 (measured 14.4px at 767).
  xs: {
    '--t16': '14px',
  },
};

// Exact px spacing scale (replaces Tailwind's rem scale). Keys are px values.
const px = (list) => Object.fromEntries(list.map((n) => [String(n), `${n}px`]));
const spacing = {
  0: '0px',
  ...px([
    1, 2, 2.4, 3.2, 3.36, 4, 4.8, 8, 10, 12, 14, 16, 19, 20, 23.5, 24, 26, 28, 32, 40, 44, 61, 64, 80,
    96, 104, 112, 128, 131, 160, 192, 208, 224, 240, 280, 288, 300.9, 320, 449.5, 480, 496, 479,
  ]),
};

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Desktop-first: Webflow main ≥992, medium 768–991, small 480–767, tiny ≤479.
    // Ordered largest → smallest so smaller overrides win.
    screens: {
      md: { max: '991px' },
      sm: { max: '767px' },
      xs: { max: '479px' },
    },
    spacing,
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ink: '#000000',
      'ink-h1': '#1A1A1A',
      grey: '#7A7A7A',
      rule: '#CECECE',
      accent: '#120DF7',
      'accent-alt': '#211CF7',
      paper: '#FFFFFF',
      'white-0': 'rgba(255,255,255,0)',
      overlay: 'rgba(0,0,0,0.5)',
      // Project tile fills (§0.1 / §3)
      project: {
        black: '#000000',
        navy: '#0F2844',
        violet: '#6165AF',
        teal: '#3E7170',
        orange: '#FF7136',
        amber: '#FB9920',
        forest: '#193526',
        olive: '#5B5B45',
        cyan: '#176C77',
        // /work-only fills (CLONE_SPEC-PAGES §3; original .project_image_wrap modifiers)
        'yellow-green': '#E1D327',
        beige: '#DFD9C4',
        grey: '#363638',
        'blue-grey': '#F0F3F6',
      },
    },
    fontFamily: {
      sans: ['"PP Mori"', 'Inter', 'sans-serif'],
    },
    fontWeight: { normal: '400' },
    extend: {
      fontSize: {
        t10: ['var(--t10)', { lineHeight: '1.3' }],
        t12: ['var(--t12)', { lineHeight: '1.3' }],
        t14: ['var(--t14)', { lineHeight: '1.3' }],
        t16: ['var(--t16)', { lineHeight: '1.3' }],
        t20: ['var(--t20)', { lineHeight: '1.3' }],
        t24: ['var(--t24)', { lineHeight: '1.3' }],
        t32: ['var(--t32)', { lineHeight: '1.2' }],
        display: ['var(--display)', { lineHeight: '1.2' }],
        'hero-sub': ['var(--hero-sub)', { lineHeight: '1' }],
        brand: ['14px', { lineHeight: '14px' }],
        'menu-label': ['14px', { lineHeight: '18.2px' }],
        'client-md': ['16px', { lineHeight: '20.8px' }],
      },
      letterSpacing: {
        h1: '-0.9px',
        h2: '-0.4px',
      },
      lineHeight: {
        body: '120%',
        year: '0.9',
      },
      maxWidth: {
        container: '1648px',
        detail: '160px',
        'detail-sm': '112px',
        service: '208px',
        media: '288px',
      },
      width: {
        logo: '16px',
        wordmark: '80px',
        badge: '128px',
        'arrow-12': '12px',
        'arrow-14': '14px',
        'arrow-16': '16px',
        'v-t14': 'var(--t14)',
        'v-t20': 'var(--t20)',
        // §3 ≤991 card widths: 26px is left free for the vertical year label
        'card-85': '85%',
        'card-sm': 'calc(100% - 26px)',
      },
      margin: {
        'card-push': 'calc(50% - 26px)', // §3 991: 449.5px at 951 content
      },
      height: {
        nav: '44px',
        logo: '24.875px',
        badge: '25.86px',
        mask: '272px',
        'v-t14': 'var(--t14)',
        'v-t20': 'var(--t20)',
      },
      gridTemplateColumns: {
        six: 'repeat(6, 1fr)',
        four: 'repeat(4, 1fr)',
        three: 'repeat(3, 1fr)',
        two: 'repeat(2, 1fr)',
        one: '1fr',
      },
      gridTemplateRows: {
        faq: 'auto',
      },
      zIndex: { nav: '998', overlay: '999', 5: '5' },
      transitionTimingFunction: {
        // All Webflow IX2 hover eases (§14.5)
        quart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
      },
      transitionDuration: { 250: '250ms', 400: '400ms', 500: '500ms' },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': fluid.base,
        '@media (max-width: 991px)': { ':root': fluid.md },
        '@media (max-width: 479px)': { ':root': fluid.xs },
      });
    }),
  ],
};
