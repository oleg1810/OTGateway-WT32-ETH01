document.addEventListener('DOMContentLoaded', () => {
  const pages = [
    { path: '/', key: 'index.title', short: 'Головна' },
    { path: '/dashboard.html', key: 'dashboard.name', short: 'Панель' },
    { path: '/network.html', key: 'network.name', short: 'Мережа' },
    { path: '/settings.html', key: 'settings.name', short: 'Налашт.' },
    { path: '/sensors.html', key: 'sensors.name', short: 'Датчики' },
    { path: '/upgrade.html', key: 'upgrade.name', short: 'Оновлення' }
  ];

  const header = document.querySelector('header');
  if (!header || header.querySelector('.portal-page-nav')) {
    return;
  }

  // Turn the old text badge into a compact, non-clickable wordmark.
  const logoLink = header.querySelector('nav:first-child a[href="/"]');
  const logo = logoLink?.querySelector('.logo');
  if (logo) {
    logoLink.removeAttribute('href');
    logo.removeAttribute('data-i18n');
    logo.innerHTML = '<span class="portal-logo-mark">OT</span><span class="portal-logo-name">Gateway</span>';
  }

  const nav = document.createElement('nav');
  nav.className = 'portal-page-nav';
  nav.setAttribute('aria-label', 'Portal navigation');

  const list = document.createElement('ul');
  const currentPath = window.location.pathname || '/';

  pages.forEach(({ path, key, short }) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const fullLabel = document.createElement('span');
    const shortLabel = document.createElement('span');

    link.href = path;
    link.setAttribute('role', 'button');

    fullLabel.setAttribute('data-i18n', key);
    fullLabel.className = 'portal-nav-full';
    shortLabel.className = 'portal-nav-short';
    shortLabel.textContent = short;

    link.appendChild(fullLabel);
    link.appendChild(shortLabel);

    if (path === currentPath) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.add('outline');
    }

    item.appendChild(link);
    list.appendChild(item);
  });

  // Move the existing language selector into the same navigation row.
  const lang = document.getElementById('lang');
  if (lang) {
    const item = document.createElement('li');
    item.className = 'portal-page-nav-lang';
    item.appendChild(lang);
    list.appendChild(item);
  }

  nav.appendChild(list);
  header.appendChild(nav);

  const style = document.createElement('style');
  style.textContent = `
    header.container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    header.container > nav:first-child {
      flex: 0 0 auto;
      margin: 0;
    }
    header.container > nav:first-child > ul {
      margin: 0;
    }
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0;
      background: none;
      border-radius: 0;
      color: var(--pico-color);
      font-family: inherit;
      font-size: 1.2rem;
      font-weight: 700;
      white-space: nowrap;
    }
    .portal-logo-mark {
      display: inline-grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border: 2px solid currentColor;
      border-radius: 0.55rem;
      font-family: var(--pico-font-family-monospace);
      font-size: 0.82rem;
      line-height: 1;
      letter-spacing: -0.06em;
    }
    .portal-logo-name {
      letter-spacing: -0.02em;
    }
    .portal-page-nav {
      flex: 1 1 auto;
      margin: 0;
    }
    .portal-page-nav ul {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: 0.4rem;
      padding: 0;
      margin: 0;
      list-style: none;
    }
    .portal-page-nav li {
      margin: 0;
      padding: 0;
    }
    .portal-page-nav a[role="button"] {
      margin: 0;
      padding: 0.4rem 0.7rem;
      font-size: 0.88rem;
      white-space: nowrap;
    }
    .portal-page-nav .portal-nav-short {
      display: none;
    }
    .portal-page-nav-lang select {
      margin: 0;
      padding: 0.4rem 0.6rem;
      height: auto;
      font-size: 0.88rem;
    }
    html[lang="uk"] .portal-page-nav .portal-nav-full {
      display: none;
    }
    html[lang="uk"] .portal-page-nav .portal-nav-short {
      display: inline;
    }
    @media (max-width: 700px) {
      header.container {
        display: block;
        text-align: center;
      }
      header.container > nav:first-child {
        margin-bottom: 0.45rem;
      }
      .portal-page-nav ul {
        justify-content: center;
        gap: 0.25rem;
      }
      .portal-page-nav a[role="button"],
      .portal-page-nav-lang select {
        display: inline-block;
        width: auto;
        text-align: center;
        padding: 0.35rem 0.55rem;
        font-size: 0.82rem;
      }
    }
  `;
  document.head.appendChild(style);
});
