import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'product-card';

    const cells = [...row.children];
    const mediaDiv = document.createElement('div');
    mediaDiv.className = 'product-card-media';

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'product-card-body';

    cells.forEach((cell) => {
      const pictures = cell.querySelectorAll('picture');
      if (pictures.length > 0) {
        pictures.forEach((pic, i) => {
          const img = pic.querySelector('img');
          if (img) {
            const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            if (i > 0) optimized.classList.add('product-card-alt');
            mediaDiv.append(optimized);
          }
        });
      } else {
        [...cell.children].forEach((child) => {
          bodyDiv.append(child.cloneNode(true));
        });
      }
    });

    const badge = bodyDiv.querySelector('.badge');
    if (badge) {
      const badgeEl = document.createElement('span');
      badgeEl.className = 'product-card-badge';
      badgeEl.textContent = badge.textContent;
      mediaDiv.append(badgeEl);
      badge.remove();
    }

    li.append(mediaDiv);
    li.append(bodyDiv);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  block.replaceChildren(ul);
}
