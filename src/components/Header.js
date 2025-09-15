
import { h } from "https://esm.sh/preact@10.23.1";
import { useEffect, useState } from "https://esm.sh/preact@10.23.1/hooks";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(h);

export default function Header(){
  const [theme, setTheme] = useState(localStorage.getItem('lgd_theme')||'auto');
  useEffect(()=>{
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('lgd_theme', theme);
  }, [theme]);

  return html`
    <header class="header">
      <div style="font-weight:600;">Liquid Glass Dashboard</div>
      <div style="display:flex; gap:10px; align-items:center;">
        <label>Theme:</label>
        <select class="select" value=${theme} onChange=${e=>setTheme(e.target.value)}>
          <option value="auto">Auto</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </header>
  `;
}
