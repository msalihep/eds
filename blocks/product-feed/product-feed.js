import { getConfig } from '../../scripts/ak.js';

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:9080/api/v1/web/event-appbuilder/products'
  : 'https://<namespace>.adobeio-static.net/api/v1/web/event-appbuilder/products';

const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const getRows = (el) => Object.fromEntries([...el.children].map((row) => {
  const [key, value] = row.children;
  return [key?.textContent.trim().toLowerCase(), value?.textContent.trim()];
}));

function renderItems(items) {
  const ul = document.createElement('ul');
  ul.append(...items.map(({ name, price: amount }) => {
    const li = document.createElement('li');
    const title = document.createElement('p');
    title.className = 'product-feed-name';
    title.textContent = name;
    const cost = document.createElement('p');
    cost.className = 'product-feed-price';
    cost.textContent = price.format(amount);
    li.append(title, cost);
    return li;
  }));
  return ul;
}

export default async function init(el) {
  const { category = 'coffee' } = getRows(el);
  const status = document.createElement('p');
  status.className = 'product-feed-status';
  status.textContent = 'Loading products…';
  el.replaceChildren(status);

  try {
    const resp = await fetch(`${API_URL}?category=${encodeURIComponent(category)}`);
    if (!resp.ok) throw new Error(`Product feed returned ${resp.status}`);
    const { items } = await resp.json();
    if (!items.length) {
      status.textContent = 'No products found.';
      return;
    }
    status.replaceWith(renderItems(items));
  } catch (ex) {
    status.textContent = 'Products are unavailable right now.';
    getConfig().log(ex, el);
  }
}
