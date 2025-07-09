// Configuration
const SPREADSHEET_ID = '1pdArucPc5Owp9PuhUafA4c-H-pfH9UVgfWJX-V8ZK-0';
const API_KEY = 'AIzaSyBuS8ED3511rJU5KVhJyi39-HFoTcCj7u0';
const SHEETS = {
    updates: {
        range: 'Updates!A2:B',
        columns: ['Update', 'Button Text'],
        sheetId: 0
    },
    slideshow: { 
        range: 'Slideshow!A2:C', 
        columns: ['Image URL', 'Title', 'Description'],
        sheetId: 0
    },
    events: { 
        range: 'Events!A2:F', 
        columns: ['Image URL', 'Title', 'Date', 'Time', 'Description', 'Tags'],
        sheetId: 0
    },
    news: {
        range: 'News!A2:D',
        columns: ['Image URL', 'Title', 'Date', 'Description'],
        sheetId: 0
    },
    videos: {
        range: 'Videos!A2:C',
        columns: ['Video URL', 'Title', 'Description'],
        sheetId: 0
    },
    gallery: { 
        range: 'Gallery!A2:C', 
        columns: ['Image URL', 'Description', 'Tags'],
        sheetId: 0
    },
    brands: {
        range: 'Brands!A2:B',
        columns: ['Logo URL', 'Name'],
        sheetId: 0
    }
};

// Initialize Swiper
let swiper;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Load all data
    loadUpdates();
    loadSlideshow();
    loadEvents();
    loadNews();
    loadVideos();
    loadGallery();
    loadBrands();
});

// Load latest updates
async function loadUpdates() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEETS.updates.range}?key=${API_KEY}`
        );
        const data = await response.json();
        
        if (data.values && data.values.length > 0) {
            const latestUpdate = data.values[0]; // Get the first row (most recent)
            document.getElementById('latest-update').textContent = latestUpdate[0];
            document.getElementById('update-btn').textContent = latestUpdate[1] || 'Register Now';
        }
    } catch (error) {
        console.error('Error loading updates:', error);
    }
}

// Load slideshow
async function loadSlideshow() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEETS.slideshow.range}?key=${API_KEY}`
        );
        const data = await response.json();
        const container = document.getElementById('slideshow-container');
        
        if (data.values) {
            container.innerHTML = '';
            
            data.values.forEach(row => {
                const [imageUrl, title, description] = row;
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.style.backgroundImage = `url(${imageUrl})`;
                slide.innerHTML = `
                    <div class="slide-content">
                        <h3>${title}</h3>
                        <p>${description}</p>
                    </div>
                `;
                container.appendChild(slide);
            });
            
            // Initialize Swiper after slides are loaded
            swiper = new Swiper('.swiper', {
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        }
    } catch (error) {
        console.error('Error loading slideshow:', error);
        container.innerHTML = '<div class="error">Error loading slideshow</div>';
    }
}

// Load events
async function loadEvents() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEETS.events.range}?key=${API_KEY}`
        );
        const data = await response.json();
        const container = document.getElementById('events-container');
        
        if (data.values) {
            container.innerHTML = '';
            
            data.values.forEach(row => {
                const [imageUrl, title, date, time, description, tags] = row;
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card';
                eventCard.innerHTML = `
                    <div class="event-image" style="background-image: url(${imageUrl})"></div>
                    <div class="event-info">
                        <h3>${title}</h3>
                        <span class="date">${date} at ${time}</span>
                        <p>${description}</p>
                        <div class="tags">
                            ${tags ? tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('') : ''}
                        </div>
                    </div>
                `;
                container.appendChild(eventCard);
            });
        }
    } catch (error) {
        console.error('Error loading events:', error);
        container.innerHTML = '<div class="error">Error loading events</div>';
    }
}

// Load news
async function loadNews() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEETS.news.range}?key=${API_KEY}`
        );
        const data = await response.json();
        const container = document.getElementById('news-container');
        
        if (data.values) {
            container.innerHTML = '';
            
            data.values.forEach(row => {
                const [imageUrl, title, date, description] = row;
                const newsCard = document.createElement('div');
                newsCard.className = 'news-card';
                newsCard.innerHTML = `
                    <div class="news-image" style="background-image: url(${imageUrl})"></div>
                    <div class="news-info">
                        <h3>${title}</h3>
                        <span class="date">${date}</span>
                        <p>${description}</p>
                    </div>
                `;
                container.appendChild(newsCard);
            });
        }
    } catch (error) {
        console.error('Error loading news:', error);
        container.innerHTML = '<div class="error">Error loading news</div>';
    }
}

// Load videos
async function loadVideos() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEETS.videos.range}?key=${API_KEY}`
        );
        const data = await response.json();
        const container = document.getElementById('video-container');
        
        if (data.values) {
            container.innerHTML = '';
            
            data.values.forEach(row => {
                const [videoUrl, title, description] = row;
                const videoId = extractYouTubeId(videoUrl);
                const videoCard = document.createElement('div');
                videoCard.className = 'video-card';
                videoCard.innerHTML = `
                    <iframe src="https://www.youtube.com/embed/${videoId}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                            title="${title}"></iframe>
                `;
                container.appendChild(videoCard);
            });
        }
    } catch (error) {
        console.error('Error loading videos:', error);
        container.innerHTML = '<div class="error">Error loading videos</div>';
    }
}

// Extract YouTube video ID from URL
function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Load gallery
async function loadGallery() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEETS.gallery.range}?key=${API_KEY}`
        );
        const data = await response.json();
        const container = document.getElementById('gallery-container');
        
        if (data.values) {
            container.innerHTML = '';
            
            data.values.forEach(row => {
                const [imageUrl, description, tags] = row;
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.innerHTML = `
                    <div class="gallery-image" style="background-image: url(${imageUrl})"></div>
                    <div class="gallery-info">
                        <p>${description}</p>
                        <div class="tags">
                            ${tags ? tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('') : ''}
                        </div>
                    </div>
                `;
                container.appendChild(galleryItem);
            });
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
        container.innerHTML = '<div class="error">Error loading gallery</div>';
    }
}

// Load brands
async function loadBrands() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEETS.brands.range}?key=${API_KEY}`
        );
        const data = await response.json();
        const container = document.getElementById('brands-container');
        
        if (data.values) {
            container.innerHTML = '';
            
            data.values.forEach(row => {
                const [logoUrl, name] = row;
                const brandLogo = document.createElement('img');
                brandLogo.className = 'brand-logo';
                brandLogo.src = logoUrl;
                brandLogo.alt = name;
                container.appendChild(brandLogo);
            });
        }
    } catch (error) {
        console.error('Error loading brands:', error);
        container.innerHTML = '<div class="error">Error loading partners</div>';
    }
}