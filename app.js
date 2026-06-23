// Variable Global untuk menampung data
let database = [];

const htmlDoc = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const navContent = document.getElementById('nav-content');
const searchContainer = document.getElementById('search-container');
const searchBtn = document.getElementById('search-btn');
const closeSearchBtn = document.getElementById('close-search');
const searchInput = document.getElementById('search-input');
const catButtons = document.querySelectorAll('.cat-btn');
const scriptContainer = document.getElementById('script-container');

// ==========================================
// FITUR TEMA TERSIMPAN (LOCALSTORAGE)
// ==========================================
// Fungsi untuk mengecek dan memasang tema saat web pertama kali dibuka/direfresh
function initTheme() {
    // Cek apakah sebelumnya user sudah menyimpan tema di localStorage, jika tidak, default ke 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Terapkan tema yang tersimpan ke HTML
    htmlDoc.setAttribute('data-theme', savedTheme);
    
    // Ubah icon sesuai tema yang tersimpan
    if (savedTheme === 'light') {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
}
// Jalankan fungsi initTheme langsung saat file JS terbaca
initTheme();

// Logika Tombol Ganti Tema (Menyimpan pilihan ke localStorage)
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlDoc.getAttribute('data-theme');
    let newTheme = 'dark';
    
    if (currentTheme === 'dark') {
        newTheme = 'light';
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        newTheme = 'dark';
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
    
    // Ubah tema di HTML
    htmlDoc.setAttribute('data-theme', newTheme);
    
    // Simpan tema baru ke memori browser (localStorage)
    localStorage.setItem('theme', newTheme);
});


// ==========================================
// PENERJEMAH TANGGAL (DUA BAHASA)
// ==========================================
// Mengubah tanggal (ID/EN) menjadi angka waktu agar bisa diurutkan
function parseIndoDate(dateString) {
    if (!dateString) return 0;
    
    // Kamus bulan gabungan Indonesia & Inggris
    const months = {
        "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3,
        "Mei": 4, "May": 4, 
        "Jun": 5, "Jul": 6, 
        "Agu": 7, "Aug": 7, 
        "Sep": 8, 
        "Okt": 9, "Oct": 9, 
        "Nov": 10, 
        "Des": 11, "Dec": 11
    };
    
    const parts = dateString.trim().split(" ");
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const monthName = parts[1];
        const month = months[monthName] !== undefined ? months[monthName] : 0;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day).getTime();
    }
    return 0; 
}

// ==========================================
// FUNGSI LOAD DATA + SORTING
// ==========================================
async function loadDatabase() {
    try {
        const timestamp = new Date().getTime(); // Anti-Cache
        const response = await fetch(`database.json?v=${timestamp}`);
        const data = await response.json();
        
        database = []; 
        
        for (const category in data) {
            for (const scriptId in data[category]) {
                const item = data[category][scriptId];
                database.push({
                    id: scriptId,          
                    title: item.title,
                    category: category, 
                    cover: item.cover,  
                    uploadDate: item.uploaded, 
                    visibility: item.visibility || "Public", // Mengambil status Public/Private
                    link: `${category}/${scriptId}/` 
                });
            }
        }
        
        // MENGURUTKAN DATA: Dari tanggal terbaru ke terlama
        database.sort((a, b) => parseIndoDate(b.uploadDate) - parseIndoDate(a.uploadDate));
        
        renderScripts('all');
        
    } catch (error) {
        console.error("Gagal memuat database!", error);
    }
}

// ==========================================
// HELPER: Perbaikan Link YouTube & Gambar
// ==========================================
function getThumbnailUrl(coverUrl) {
    const fallbackImage = 'https://placehold.co/640x360/1e1e1e/888888?text=No+Cover';

    if (!coverUrl || coverUrl.trim() === "") {
        return fallbackImage;
    }
    
    if (coverUrl.includes('youtu.be') || coverUrl.includes('youtube.com')) {
        let videoId = '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = coverUrl.match(regExp);
        
        if (match && match[2].length === 11) {
            videoId = match[2];
            // Pakai hqdefault agar tidak dapat gambar abu-abu 3 titik
            return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
    }
    
    return coverUrl;
}

// ==========================================
// LOGIKA SEARCH BAR & CATEGORY
// ==========================================
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

// ==========================================
// MESIN RENDER SCRIPT CARD
// ==========================================
function renderScripts(filterCategory, searchQuery = '') {
    scriptContainer.innerHTML = '';

    const filteredData = database.filter(item => {
        const matchCategory = filterCategory === 'all' || item.category === filterCategory;
        const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const isVisible = item.visibility !== 'Private'; // Filter: Hanya tampilkan yang bukan Private
        
        return matchCategory && matchSearch && isVisible;
    });

    if (filteredData.length === 0) {
        scriptContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">
                No results found for "${searchQuery}"
            </div>`;
        return;
    }

    filteredData.forEach(item => {
        const thumbnailUrl = getThumbnailUrl(item.cover);
        
        const card = document.createElement('div');
        card.className = 'script-card';
        
        card.innerHTML = `
            <div class="card-cover">
                <img src="${thumbnailUrl}" alt="${item.title}" onerror="this.onerror=null; this.src='https://placehold.co/640x360/1e1e1e/888888?text=Image+Error';">
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

// Filter Kategori
catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        catButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const selectedFilter = btn.getAttribute('data-filter');
        renderScripts(selectedFilter, searchInput.value);
    });
});

// Fitur Search Real-time
searchInput.addEventListener('input', (e) => {
    const activeFilter = document.querySelector('.cat-btn.active').getAttribute('data-filter');
    renderScripts(activeFilter, e.target.value);
});

// ==========================================
// FITUR DELAY KLIK FOOTER SOSMED
// ==========================================
document.querySelectorAll('.footer-socials a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); 
        const url = this.getAttribute('href');
        const target = this.getAttribute('target');
        
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = ''; 
            if (url !== "#") { 
                if (target === '_blank') {
                    window.open(url, '_blank');
                } else {
                    window.location.href = url;
                }
            }
        }, 300); 
    });
});

// Boot awal web!
loadDatabase();
