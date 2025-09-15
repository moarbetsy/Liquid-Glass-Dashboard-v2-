
import { h } from "https://esm.sh/preact@10.23.1";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(h);

import { exportJSON, importJSON, resetAll } from "../utils/store.js";

export default function Settings(){
  const doExport = () => {
    const blob = exportJSON();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'lgd-data.json'; a.click();
    URL.revokeObjectURL(url);
  };
  const doImport = async (e) => {
    const file = e.target.files[0];
    if(file) await importJSON(file);
    alert('Imported.');
  };

  return html`
    <div class="row">
      <div class="card">
        <h3>Data</h3>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button class="btn" onClick=${doExport}>Export JSON</button>
          <label class="btn">
            Import JSON <input type="file" accept="application/json" style="display:none" onChange=${doImport} />
          </label>
          <button class="btn danger" onClick=${()=> { if(confirm('Reset all data?')) resetAll(); }}>Reset</button>
        </div>
      </div>
      <div class="card">
        <h3>About</h3>
        <p style="color:var(--muted); margin-top:6px;">Buildless Preact + HTM dashboard with a “liquid glass” design. Save data locally via localStorage.</p>
      </div>
    </div>
  `;
}
