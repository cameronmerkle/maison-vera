import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const cols = footer.querySelector('.columns');
  if (cols && cols.classList.contains('columns-1-cols')) {
    const cell = cols.querySelector('.columns > div > div');
    if (cell) {
      const grid = document.createElement('div');
      grid.className = 'footer-grid';
      let col = null;

      [...cell.children].forEach((child) => {
        const isH5 = child.tagName === 'H5';
        const isBrandP = !col && child.tagName === 'P';
        if (isH5 || isBrandP) {
          if (isBrandP && !col) {
            col = document.createElement('div');
            col.className = 'footer-col footer-brand';
            grid.append(col);
          } else if (isH5) {
            col = document.createElement('div');
            col.className = 'footer-col';
            grid.append(col);
          }
        }
        if (col) col.append(child);
      });

      const wrapper = cols.closest('.columns-wrapper') || cols.parentElement;
      wrapper.replaceChildren(grid);
    }
  }

  const bottomSection = footer.querySelector('.section:last-child .default-content-wrapper');
  if (bottomSection) bottomSection.classList.add('footer-bottom');

  block.append(footer);
}
