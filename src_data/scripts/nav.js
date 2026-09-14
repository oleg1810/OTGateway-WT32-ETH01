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

  // The logo is decorative, not a navigation link. Direct page navigation is below it.
  const logoLink = header.querySelector(':not(.portal-page-nav) a[href="/"]');
  if (logoLink) {
    logoLink.removeAttribute('href');
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
    .portal-page-nav {
      margin: 0 0 1rem;
    }
    .portal-page-nav ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
      padding: 0;
      margin: 0;
      list-style: none;
    }
    .portal-page-nav li {
      margin: 0;
    }
    .portal-page-nav a[role="button"] {
      margin: 0;
      padding: 0.45rem 0.8rem;
      font-size: 0.9rem;
      white-space: nowrap;
    }
    .portal-page-nav .portal-nav-short {
      display: none;
    }
    .portal-page-nav-lang select {
      margin: 0;
      padding: 0.45rem 0.7rem;
      height: auto;
      font-size: 0.9rem;
    }
    html[lang="uk"] .portal-page-nav .portal-nav-full {
      display: none;
    }
    html[lang="uk"] .portal-page-nav .portal-nav-short {
      display: inline;
    }
    @media (max-width: 700px) {
      .portal-page-nav ul {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .portal-page-nav a[role="button"],
      .portal-page-nav-lang select {
        display: block;
        width: 100%;
        text-align: center;
      }
    }
  `;
  document.head.appendChild(style);
});
