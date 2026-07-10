// ===================== NAVIGATION =====================
let lastScrollY = 0;
const navEl = document.querySelector('.site-nav');
if (navEl) {
    window.addEventListener('scroll', () => {
        const currentY = window.pageYOffset;
        navEl.classList.toggle('hidden', currentY > lastScrollY && currentY > 80);
        lastScrollY = currentY;
    }, { passive: true });
}

function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('open');
}

document.querySelectorAll('#navMenu a').forEach(link => {
    link.addEventListener('click', () => {
        const menu = document.getElementById('navMenu');
        if (menu) menu.classList.remove('open');
    });
});

// ===================== SCROLL ANIMATIONS =====================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ===================== STATS COUNTERS =====================
document.querySelectorAll('[data-count]').forEach(el => {
    const selector = el.getAttribute('data-count');
    el.textContent = document.querySelectorAll(selector).length;
});

// ===================== LIGHTBOX =====================
const lightbox = document.getElementById('lightbox');
if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');

    document.querySelectorAll('.entry-image img').forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') lightbox.classList.remove('active');
    });

    // ===================== SIMPLE CSV + CAROUSEL FOR PROJECTS =====================
    function parseCSV(text) {
        const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
        if (lines.length < 1) return [];
        const headers = lines[0].split(';').map(h => h.trim());
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(';').map(v => v.trim());
            const row = {};
            headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
            data.push(row);
        }
        return data;
    }

    async function fetchCSV(path) {
        try {
            const res = await fetch(path);
            if (!res.ok) return [];
            const text = await res.text();
            return parseCSV(text);
        } catch (e) {
            return [];
        }
    }

    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function escapeAttr(str) {
        return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
    }

    function openLightbox(src) {
        const lb = document.getElementById('lightbox');
        const img = document.getElementById('lightboxImg');
        if (img && lb) {
            img.src = src;
            lb.classList.add('active');
        }
    }

    function closeLightbox() {
        const lb = document.getElementById('lightbox');
        if (lb) lb.classList.remove('active');
    }

    function buildProjectCard(row) {
        const date = row['Date'] || '';
        const title = row['Title'] || '';
        const description = row['Description'] || '';
        const photos = ['Photo1','Photo2','Photo3'].map(k => row[k] || '').filter(p => p);
        const firstPhoto = photos.length > 0 ? photos[0] : '';

        let html = `<div class="bivouac-card">`;
        if (firstPhoto) {
            html += `<div class="bivouac-photos single">`;
            html += `<img src="${escapeHtml(firstPhoto)}" alt="${escapeHtml(title)}" onclick="openLightbox('${escapeAttr(firstPhoto)}')" onerror="this.style.display='none'">`;
            html += `</div>`;
        } else {
            html += `<div class="no-photo">Pas de photo</div>`;
        }
        html += `
            <div class="card-body">
                <div class="date">${escapeHtml(date)}</div>
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(description)}</p>
            </div>
        </div>`;

        return html;
    }

    function renderProjects(data, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        if (data.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Aucun projet trouvé.</p></div>';
            return;
        }

        const pageSize = 1;
        const pageCount = Math.ceil(data.length / pageSize);
        let pageIndex = 0;

        container.innerHTML = `
            <div class="bivouacs-carousel">
                <button class="carousel-btn" id="${containerId}Prev" aria-label="Précédent">&#8592;</button>
                <div class="carousel-track"></div>
                <button class="carousel-btn" id="${containerId}Next" aria-label="Suivant">&#8594;</button>
            </div>
            <div class="carousel-counter" id="${containerId}Counter"></div>
        `;

        const track = container.querySelector('.carousel-track');
        const counter = document.getElementById(`${containerId}Counter`);

        function show(page) {
            pageIndex = (page + pageCount) % pageCount;
            const start = pageIndex * pageSize;
            const items = data.slice(start, start + pageSize);
            track.innerHTML = items.map(buildProjectCard).join('');
            if (counter) counter.textContent = `${pageIndex + 1} / ${pageCount}`;
        }

        container.querySelector(`#${containerId}Prev`).addEventListener('click', () => show(pageIndex - 1));
        container.querySelector(`#${containerId}Next`).addEventListener('click', () => show(pageIndex + 1));

        show(0);
    }

    // auto-load finance and tech CSVs
    document.addEventListener('DOMContentLoaded', async () => {
        const [finance, tech] = await Promise.all([
            fetchCSV('finance_projects.csv'),
            fetchCSV('tech_projects.csv')
        ]);
        renderProjects(finance, 'financeContent');
        renderProjects(tech, 'techContent');
    });
}
