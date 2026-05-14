import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  const wrapper = document.createElement('div');
  wrapper.className = 'promo-inner';

  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const picture = cell.querySelector('picture');
      if (picture) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'promo-image';
        const img = picture.querySelector('img');
        if (img) {
          imgWrap.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]));
        }
        wrapper.append(imgWrap);
      } else {
        const copy = document.createElement('div');
        copy.className = 'promo-copy';
        const h2 = cell.querySelector('h2');
        [...cell.children].forEach((child) => {
          const isPlainP = child.tagName === 'P'
            && !child.querySelector('a')
            && !child.classList.contains('button-wrapper');
          if (isPlainP) {
            const text = child.textContent.trim();
            const before = h2 && h2.compareDocumentPosition(child)
              === Node.DOCUMENT_POSITION_PRECEDING;
            if (before && text) {
              child.className = 'promo-eyebrow';
            } else if (text && !child.classList.contains('promo-eyebrow')) {
              child.className = 'promo-description';
            }
          }
          copy.append(child);
        });
        wrapper.append(copy);
      }
    });
  });

  block.replaceChildren(wrapper);
}
