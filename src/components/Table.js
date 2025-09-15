
import { h } from "https://esm.sh/preact@10.23.1";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(h);

export default function Table({ columns, rows, empty='No data' }){
  return html`
    <table class="table">
      <thead>
        <tr>
          ${columns.map(c => html`<th>${c.label}</th>`)}
        </tr>
      </thead>
      <tbody>
        ${rows.length? rows.map(r => html`
          <tr>
            ${columns.map(c => html`<td>${typeof c.render==='function' ? c.render(r) : r[c.key]}</td>`)}
          </tr>
        `): html`<tr><td colSpan=${columns.length} style="color:var(--muted)">${empty}</td></tr>`}
      </tbody>
    </table>
  `;
}
