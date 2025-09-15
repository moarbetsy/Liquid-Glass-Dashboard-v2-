
import { h } from "https://esm.sh/preact@10.23.1";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(h);

export default function Modal({ open, title, onClose, children }){
  if(!open) return null;
  return html`
    <div class="modal-backdrop" role="dialog" aria-modal="true">
      <div class="modal">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h2 style="margin:0; font-size:16px">${title}</h2>
          <button class="btn" onClick=${onClose}>✕</button>
        </div>
        <div>${children}</div>
      </div>
    </div>
  `;
}
