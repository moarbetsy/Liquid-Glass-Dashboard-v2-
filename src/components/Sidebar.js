
import { h } from "https://esm.sh/preact@10.23.1";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(h);

const links = [
  ['#/', 'Dashboard', '🏠'],
  ['#pos', 'POS', '🧾'],
  ['#orders', 'Orders', '📦'],
  ['#clients', 'Clients', '👥'],
  ['#products', 'Products', '🍬'],
  ['#expenses', 'Expenses', '💸'],
  ['#settings', 'Settings', '⚙️']
];

export default function Sidebar({ route }){
  return html`
    <aside class="sidebar">
      <div class="brand">🍭 Liquid Glass</div>
      <nav class="nav">
        ${links.map(([href, label, icon]) => html`
          <a href=${href} class=${route===href?'active':''}>${icon} ${label}</a>
        `)}
      </nav>
      <div style="margin-top:24px; font-size:12px; color:var(--muted)">
        <div><b>Version:</b> v2</div>
        <div><b>Theme:</b> auto (toggle in header)</div>
      </div>
    </aside>
  `;
}
