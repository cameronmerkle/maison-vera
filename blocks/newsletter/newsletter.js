export default function decorate(block) {
  const heading = block.querySelector('h2');
  const desc = block.querySelector('p:not(.button-wrapper)');

  const wrapper = document.createElement('div');
  wrapper.className = 'newsletter-inner';

  if (heading) wrapper.append(heading);
  if (desc) wrapper.append(desc);

  const form = document.createElement('form');
  form.className = 'newsletter-form';
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.textContent = 'Thank you!';
    setTimeout(() => { btn.textContent = 'Subscribe →'; }, 2000);
  });

  const input = document.createElement('input');
  input.type = 'email';
  input.placeholder = 'your@email.com';
  input.required = true;

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = 'Subscribe →';

  form.append(input);
  form.append(btn);
  wrapper.append(form);

  block.replaceChildren(wrapper);
}
