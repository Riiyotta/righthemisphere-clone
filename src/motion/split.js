// SplitText with IX3's generated class names, plus a React-safe restore.
// GSAP's own revert() rewrites innerHTML, which would orphan the text nodes React owns
// (e.g. the MENU/CLOSE label). restore() puts the exact original nodes back instead.
import { SplitText } from './core.js';

const CLASSES = {
  wordsClass: 'gsap_split_word',
  charsClass: 'gsap_split_letter',
  linesClass: 'gsap_split_line',
};

function snapshot(root) {
  const els = [];
  const texts = [];
  const walk = (node) => {
    if (node.nodeType === 3) texts.push([node, node.nodeValue]);
    else if (node.nodeType === 1 && node.namespaceURI !== 'http://www.w3.org/2000/svg') {
      els.push([node, Array.from(node.childNodes)]);
      node.childNodes.forEach(walk);
    }
  };
  walk(root);
  const aria = [root.getAttribute('aria-label'), root.getAttribute('aria-hidden')];
  let done = false;
  return () => {
    if (done) return;
    done = true;
    texts.forEach(([n, v]) => {
      n.nodeValue = v;
    });
    els.forEach(([el, kids]) => el.replaceChildren(...kids));
    aria[0] === null ? root.removeAttribute('aria-label') : root.setAttribute('aria-label', aria[0]);
    aria[1] === null ? root.removeAttribute('aria-hidden') : root.setAttribute('aria-hidden', aria[1]);
  };
}

/**
 * split(el, { type: 'chars' | 'lines' | 'words', mask })
 * Returns { chars, words, lines, targets, restore }. `targets` is the array IX3 animates.
 */
export function split(el, { type, mask } = {}) {
  const restore = snapshot(el);
  const t = type === 'chars' ? 'words,chars' : type;
  const s = SplitText.create(el, { type: t, mask, ...CLASSES, aria: 'auto' });
  const targets = type === 'chars' ? s.chars : type === 'lines' ? s.lines : s.words;
  return { chars: s.chars, words: s.words, lines: s.lines, targets, restore };
}
