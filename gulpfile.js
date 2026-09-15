const { src, dest, series, parallel } = require('gulp');
const concat = require('gulp-concat');
const gzip = require('gulp-gzip');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const jsonminify = require('gulp-jsonminify');
const htmlmin = require('gulp-html-minifier-terser');
const replace = require('gulp-replace');

// Paths for tasks
let paths = {
  styles: {
    dest: 'data/static/',
    bundles: {
      'app.css': [
        'src_data/styles/pico.min.css',
        'src_data/styles/iconly.css',
        'src_data/styles/app.css'
      ]
    }
  },
  scripts: {
    dest: 'data/static/',
    bundles: {
      'app.js': [
        'src_data/scripts/i18n.min.js',
        'src_data/scripts/lang.js',
        'src_data/scripts/utils.js'
      ],
      'chart.js': [
        'src_data/scripts/chart.js'
      ]
    }
  },
  json: [
    {
      src: 'src_data/locales/*.json',
      dest: 'data/static/locales/'
    },
    {
      src: 'src_data/*.json',
      dest: 'data/static/'
    }
  ],
  static: [
    {
      src: 'src_data/fonts/*.*',
      dest: 'data/static/fonts/'
    },
    {
      src: 'src_data/images/*.*',
      dest: 'data/static/images/'
    },
    {
      src: 'src_data/*.txt',
      dest: 'data/static/'
    }
  ],
  pages: {
    src: 'src_data/pages/*.html',
    dest: 'data/pages/'
  }
};

const portalHeader = `
    <header class="container portal-header">
      <div class="logo portal-logo">
        <span class="portal-logo-mark">OT</span><span class="portal-logo-name">Gateway</span>
      </div>
      <nav class="portal-page-nav" aria-label="Portal navigation">
        <ul>
          <li><a href="/" data-i18n>index.title</a></li>
          <li><a href="/dashboard.html" data-i18n>dashboard.name</a></li>
          <li><a href="/network.html" data-i18n>network.name</a></li>
          <li><a href="/settings.html" data-i18n>settings.name</a></li>
          <li><a href="/sensors.html" data-i18n>sensors.name</a></li>
          <li><a href="/upgrade.html" data-i18n>upgrade.name</a></li>
          <li class="portal-page-nav-lang">
            <select id="lang" aria-label="Lang">
              <option value="en" selected>EN</option>
              <option value="cn">CN</option>
              <option value="it">IT</option>
              <option value="nl">NL</option>
              <option value="ru">RU</option>
              <option value="uk">UK</option>
            </select>
          </li>
        </ul>
      </nav>
      <style>
        header.portal-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        header.portal-header > .portal-logo {
          flex: 0 0 auto;
          margin: 0;
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
        header.portal-header > .portal-page-nav {
          flex: 1 1 auto;
          margin: 0;
        }
        .portal-page-nav > ul {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          gap: 0.4rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .portal-page-nav > ul > li {
          margin: 0;
          padding: 0;
        }
        .portal-page-nav > ul > li > a {
          margin: 0;
          padding: 0.4rem 0.7rem;
          font-size: 0.88rem;
          white-space: nowrap;
        }
        .portal-page-nav-lang select {
          margin: 0;
          padding: 0.4rem 0.6rem;
          height: auto;
          font-size: 0.88rem;
        }
        @media (max-width: 700px) {
          header.portal-header {
            display: block;
            text-align: center;
          }
          header.portal-header > .portal-logo {
            justify-content: center;
            margin-bottom: 0.45rem;
          }
          .portal-page-nav > ul {
            justify-content: center;
            gap: 0.25rem;
          }
          .portal-page-nav > ul > li > a,
          .portal-page-nav-lang select {
            display: inline-block;
            width: auto;
            text-align: center;
            padding: 0.35rem 0.55rem;
            font-size: 0.82rem;
          }
        }
      </style>
    </header>
`;

// Tasks
const styles = (cb) => {
  for (let name in paths.styles.bundles) {
    const items = paths.styles.bundles[name];

    src(items)
      .pipe(replace(
        "{BUILD_TIME}",
        Math.floor(Date.now() / 1000)
      ))
      .pipe(postcss([
        cssnano({ preset: 'advanced' })
      ]))
      .pipe(concat(name))
      .pipe(gzip({
        append: true
      }))
      .pipe(dest(paths.styles.dest));
  }

  cb();
}

const scripts = (cb) => {
  for (let name in paths.scripts.bundles) {
    const items = paths.scripts.bundles[name];

    src(items)
      .pipe(replace(
        "{BUILD_TIME}",
        Math.floor(Date.now() / 1000)
      ))
      .pipe(terser().on('error', console.error))
      .pipe(concat(name))
      .pipe(gzip({
        append: true
      }))
      .pipe(dest(paths.scripts.dest));
  }

  cb();
}

const jsonFiles = (cb) => {
  for (let i in paths.json) {
    const item = paths.json[i];

    src(item.src)
      .pipe(replace(
        "{BUILD_TIME}",
        Math.floor(Date.now() / 1000)
      ))
      .pipe(jsonminify())
      .pipe(gzip({
        append: true
      }))
      .pipe(dest(item.dest));
  }

  cb();
}

const staticFiles = (cb) => {
  for (let i in paths.static) {
    const item = paths.static[i];

    src(item.src, { encoding: false })
      .pipe(gzip({
        append: true
      }))
      .pipe(dest(item.dest));
  }

  cb();
}

const pages = () => {
  return src(paths.pages.src)
    .pipe(replace(
      /<header class="container">[\s\S]*?<\/header>/,
      portalHeader
    ))
    .pipe(replace(
      "{BUILD_TIME}",
      Math.floor(Date.now() / 1000)
    ))
    .pipe(htmlmin({
      html5: true,
      caseSensitive: true,
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      conservativeCollapse: true,
      removeComments: true,
      minifyJS: true
    }))
    .pipe(gzip({
      append: true
    }))
    .pipe(dest(paths.pages.dest));
}

exports.build_styles = styles;
exports.build_scripts = scripts;
exports.build_json = jsonFiles;
exports.build_static = staticFiles;
exports.build_pages = pages;
exports.build_all = parallel(styles, scripts, jsonFiles, staticFiles, pages);