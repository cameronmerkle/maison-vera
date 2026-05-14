export default function decorate(block) {
  const rows = [...block.children];
  const picture = block.querySelector('picture');
  const content = document.createElement('div');
  content.className = 'hero-content';

  rows.forEach((row) => {
    [...row.children].forEach((cell) => {
      if (!cell.querySelector('picture')) {
        [...cell.children].forEach((child) => content.append(child));
      }
    });
  });

  const h1 = content.querySelector('h1');
  content.querySelectorAll('p').forEach((p) => {
    if (p.classList.contains('button-wrapper') || p.querySelector('a.button')) return;
    const text = p.textContent.trim();
    if (!text) return;
    const isBeforeH1 = h1 && h1.compareDocumentPosition(p) === Node.DOCUMENT_POSITION_PRECEDING;
    if (isBeforeH1) {
      p.className = 'hero-eyebrow';
    } else if (h1 && !p.classList.contains('hero-eyebrow')) {
      p.className = 'hero-description';
    }
  });

  block.textContent = '';
  if (picture) block.append(picture);
  block.append(content);
}
