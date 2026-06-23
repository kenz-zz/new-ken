// Data Script (File scripts diganti dengan kategori monetloader & cleo)
const database = [
    {
        id: 1,
        title: "Custom Chat System Premium V3",
        category: "monetloader",
        youtubeId: "dQw4w9WgXcQ", // Masukkan ID Video YouTube-mu di sini
        uploadDate: "09 Juni 2026",
        link: "#"
    },
    {
        id: 2,
        title: "Wall Climbing System Smooth Script",
        category: "cleo",
        youtubeId: "D63gsq3l8yw", // Masukkan ID Video YouTube-mu di sini
        uploadDate: "08 Juni 2026",
        link: "#"
    },
    {
        id: 3,
        title: "Custom Hotbar UI Mobile & PC Optimized",
        category: "monetloader",
        youtubeId: "tPEE9ZwTmy0", // Masukkan ID Video YouTube-mu di sini
        uploadDate: "05 Juni 2026",
        link: "#"
    }
];

// Mapping Elemen DOM
const htmlDoc = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const navContent = document.getElementById('nav-content');
const searchContainer = document.getElementById('search-container');
const searchBtn = document.getElementById('search-btn');
const closeSearchBtn = document.getElementById('close-search');
const searchInput = document.getElementById('search-input');
const catButtons = document.querySelectorAll('.cat-btn');
const scriptContainer = document.getElementById('script-container');

// 1. Logika Fitur Ganti Tema (Awalnya Dark Mode)
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlDoc.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        htmlDoc.setAttribute('data-theme', 'light');

        themeToggleBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {
        htmlDoc.setAttribute('data-theme', 'dark');

        themeToggleBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';
    }
});

// 2. Logika Search Bar Meluas & Menyembunyikan Navbar
searchBtn.addEventListener('click', () => {
    navContent.style.display = 'none';
    searchContainer.classList.remove('hidden');
    searchInput.focus();
});

closeSearchBtn.addEventListener('click', () => {
    searchContainer.classList.add('hidden');
    navContent.style.display = 'flex';
    searchInput.value = '';
    const activeFilter = document.querySelector('.cat-btn.active').getAttribute('data-filter');
    renderScripts(activeFilter, '');
});

// 3. Mesin Rendering Script Card Otomatis
function renderScripts(filterCategory, searchQuery = '') {
    scriptContainer.innerHTML = '';

    const filteredData = database.filter(item => {
        const matchCategory = filterCategory === 'all' || item.category === filterCategory;
        const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    if (filteredData.length === 0) {
        scriptContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">
                No results found for "${searchQuery}"
            </div>`;
        return;
    }

    filteredData.forEach(item => {
        // Mengambil Cover Otomatis dari Thumbnail YouTube berdasarkan ID
        const thumbnailUrl = `https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`;
        
        const card = document.createElement('div');
        card.className = 'script-card';
        
        card.innerHTML = `
            <div class="card-cover">
                <img src="${thumbnailUrl}" alt="${item.title}" onerror="this.onerror=null; this.src='https://via.placeholder.com/640x360?text=No+Thumbnail';">
            </div>
            <div class="card-details">
                <h3 class="card-title">${item.title}</h3>
                <div class="card-meta">
                    <span class="card-label">${item.category}</span>
                    <span class="card-date">${item.uploadDate}</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            if (item.link !== '#') {
                window.location.href = item.link;
            }
        });
        
        scriptContainer.appendChild(card);
    });
}

// 4. Filter Tombol Kategori (Toggle System)
catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        catButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const selectedFilter = btn.getAttribute('data-filter');
        renderScripts(selectedFilter, searchInput.value);
    });
});

// 5. Fitur Pencarian Real-time Saat Mengetik
searchInput.addEventListener('input', (e) => {
    const activeFilter = document.querySelector('.cat-btn.active').getAttribute('data-filter');
    renderScripts(activeFilter, e.target.value);
});

// Booting awal saat halaman pertama kali dibuka
renderScripts('all');
