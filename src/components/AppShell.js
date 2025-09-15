
import { h } from "https://esm.sh/preact@10.23.1";
import { useEffect, useState } from "https://esm.sh/preact@10.23.1/hooks";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(h);

import Sidebar from "./Sidebar.js";
import Header from "./Header.js";

import Dashboard from "../pages/Dashboard.js";
import POS from "../pages/POS.js";
import Orders from "../pages/Orders.js";
import Clients from "../pages/Clients.js";
import Products from "../pages/Products.js";
import Expenses from "../pages/Expenses.js";
import Settings from "../pages/Settings.js";

const routes = {
  '#/': Dashboard,
  '#pos': POS,
  '#orders': Orders,
  '#clients': Clients,
  '#products': Products,
  '#expenses': Expenses,
  '#settings': Settings
};

export default function AppShell(){
  const [route, setRoute] = useState(location.hash || '#/');
  useEffect(()=>{
    const onHash = () => setRoute(location.hash || '#/');
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);

  const Page = routes[route] || Dashboard;

  // theme override
  const theme = localStorage.getItem('lgd_theme') || 'auto';
  useEffect(()=>{
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return html`
    <div class="app">
      <${Sidebar} route=${route} />
      <div>
        <${Header} />
        <main class="main">
          <${Page} />
        </main>
      </div>
    </div>
  `;
}
