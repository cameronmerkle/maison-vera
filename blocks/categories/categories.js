import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const items = document.createElement('div');
  items.className = 'categories-grid';

  [...block.children].forEach((row) => {
    const card = document.createElement('a');
    card.className = 'category-card';
    card.href = '#';

    const cells = [...row.children];
    cells.forEach((cell) => {
      const picture = cell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '800' }]);
          card.append(optimized);
        }
      } else {
        const label = document.createElement('div');
        label.className = 'category-label';
        const heading = cell.querySelector('h3, h4, h5, h6');
        if (heading) {
          const name = document.createElement('h3');
          name.className = 'category-name';
          name.textContent = heading.textContent;
          label.append(name);
        }
        const link = cell.querySelector('a');
        const linkText = document.createElement('span');
        linkText.className = 'category-link';
        linkText.textContent = link ? link.textContent : 'Shop now';
        label.append(linkText);

        if (link) card.href = link.href;
        card.append(label);
      }
    });

    items.append(card);
  });

  block.replaceChildren(items);
}
