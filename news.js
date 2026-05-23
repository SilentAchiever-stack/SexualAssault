/* ============================================
   PERSPECTIVE NEWS — Shared JS
   Footer · Reveal · Guardian News Feed
   ============================================ */

// ─── Disclaimer Footer ───────────────────────
const initFooter = () => {
  const title = document.getElementById('disclaimer-title');
  const content = document.getElementById('disclaimer-content');
  if (title) title.textContent = 'Disclaimer:';
  if (content) content.textContent =
    'We do not own the copyright to any of the news articles, images, videos, or content featured on this platform. All content is sourced from external sources and is used for informational purposes only. For copyright inquiries, please contact the original source.';
};

// ─── Scroll Reveal ────────────────────────────
const initReveal = () => {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
};

// ─── Guardian News Feed ───────────────────────
// Replace with your free key from open-platform.theguardian.com
const GUARDIAN_API_KEY = '009d5ab8-84d8-476a-aaef-eff4baceb637'; // 'test' gives limited results; replace with your real key

const fetchNews = async (query, containerId, limit = 5) => {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = '<p class="news-loading">Loading latest coverage…</p>';

  try {
const baseUrl = "https://content.guardianapis.com/search";
const query = encodeURIComponent('"sexual abuse"');

const url = `${baseUrl}?q=${query}&order-by=newest&api-key=${GUARDIAN_API_KEY}&page-size=${limit}`;

// Use fetch to get the data
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data.response.results))
  .catch(error => console.error('Error:', error));
    const res = await fetch(url);
    const data = await res.json();

    if (!data.response?.results?.length) {
      el.innerHTML = '<p class="news-loading">No recent articles found.</p>';
      return;
    }

    el.innerHTML = data.response.results.map(article => {
      const date = new Date(article.webPublicationDate).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
      const section = article.sectionName || 'World';
      return `
        <a class="news-article-card" href="${article.webUrl}" target="_blank" rel="noopener">
          <div>
            <span class="card-section-tag">${section}</span>
            <div class="card-title">${article.webTitle}</div>
          </div>
          <div class="card-date">${date}</div>
        </a>
      `;
    }).join('');

  } catch (err) {
    el.innerHTML = '<p class="news-loading">Unable to load latest news. Check your API key or connection.</p>';
    console.error('Guardian API error:', err);
  }
};

initFooter();
initReveal();