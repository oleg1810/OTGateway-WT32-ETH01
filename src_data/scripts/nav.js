(() => {
  const pages = [
    { path: '/', key: 'index.title' },
    { path: '/dashboard.html', key: 'dashboard.name' },
    { path: '/network.html', key: 'network.name' },
    { path: '/settings.html', key: 'settings.name' },
    { path: '/sensors.html', key: 'sensors.name' },
    { path: '/upgrade.html', key: 'upgrade.name' }
  ];

  const currentPath = window.location.pathname || '/';
  const header = document.querySelector('header');
  if (!header || header.querySelector('.portal-page-nav')) {
    return;
  }

  const nav = document.createElement('nav');
  nav.className = 'portal-page-nav';
  nav.setAttribute('aria-label', 'Portal navigation');

  const list = document.createElement('ul');

  pages.forEach(({ path, key }) => {
    const item = document.createElement('li');
    const link = document.createElement('a');

    link.href = path;
    link.setAttribute('role', 'button');
    link.setAttribute('data-i18n', key);

    if (path === currentPath) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.add('outline');
    }

    item.appendChild(link);
    list.appendChild(item);
  });

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
    @media (max-width: 700px) {
      .portal-page-nav ul {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .portal-page-nav a[role="button"] {
        display: block;
        width: 100%;
        text-align: center;
      }
    }
  `;
  document.head.appendChild(style);
})();
