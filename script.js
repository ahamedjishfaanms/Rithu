// Configuration
const SPREADSHEET_ID = '1pdArucPc5Owp9PuhUafA4c-H-pfH9UVgfWJX-V8ZK-0';
const API_KEY = 'AIzaSyBuS8ED3511rJU5KVhJyi39-HFoTcCj7u0';
const SHEETS = {
    updates: {
        range: 'Updates!A2:A',
        sheetId: 0
    },
    slideshow: { 
        range: 'Slideshow!A2:C', 
        columns: ['Image URL', 'Title', 'Description'],
        sheetId: 0
    },
    events: { 
        range: 'Events!A2:H',
        columns: ['Image URL', 'Title', 'Date', 'Time', 'Description', 'Tags', 'Button Text', 'Button Link'],
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

// Global variables
let swiper;
let updateInterval;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    loadAllData();
    initSmoothScrolling();
    initAnimations();
});

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links-container');

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                hamburger.classList.remove('active');
                navLinksContainer.classList.remove('active');
                document.body.style.overflow = '';

                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    setTimeout(() => {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }, 300);
                }

                e.preventDefault();
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!navLinksContainer.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}


function initAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all sections with animation class
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

function loadAllData() {
    loadUpdates();
    loadSlideshow();
    loadEvents();
    loadNews();
    loadVideos();
    loadGallery();
    loadBrands();
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Load latest updates with rotation
async function loadUpdates() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEETS.updates.range}?key=${API_KEY}`
        );
        const data = await response.json();
        
        if (data.values && data.values.length > 0) {
            const updates = data.values;
            const updateElement = document.getElementById('latest-update');
            
            // Clear any existing interval
            if (updateInterval) clearInterval(updateInterval);
            
            // Function to rotate updates
            let currentIndex = 0;
            const rotateUpdates = () => {
                updateElement.style.opacity = 0;
                setTimeout(() => {
                    updateElement.textContent = updates[currentIndex][0];
                    updateElement.style.opacity = 1;
                    currentIndex = (currentIndex + 1) % updates.length;
                }, 500);
            };
            
            // Show first update immediately
            updateElement.textContent = updates[0][0];
            updateElement.style.opacity = 1;
            currentIndex = 1;
            
            // Rotate updates every 5 seconds
            updateInterval = setInterval(rotateUpdates, 5000);
        }
    } catch (error) {
        console.error('Error loading updates:', error);
        document.getElementById('latest-update').textContent = 'Early bird registrations now open!';
    }
}

// Load slideshow with Swiper
async function loadSlideshow() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEETS.slideshow.range}?key=${API_KEY}`
        );
        const data = await response.json();
        const container = document.getElementById('slideshow-container');
        
        if (data.values && data.values.length > 0) {
            container.innerHTML = '';
            
            data.values.forEach(row => {
                const [imageUrl, title, description] = row;
                if (imageUrl) {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    slide.style.backgroundImage = `url(${imageUrl})`;
                    slide.innerHTML = `
                        <div class="slide-content">
                            <h3>${title || ''}</h3>
                            <p>${description || ''}</p>
                        </div>
                    `;
                    container.appendChild(slide);
                }
            });
            
            // Initialize Swiper
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
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                }
            });
        } else {
            showError(container, 'No slideshow data available');
        }
    } catch (error) {
        console.error('Error loading slideshow:', error);
        showError(document.getElementById('slideshow-container'), 'Error loading slideshow');
    }
}

// Load events with dynamic buttons
async function loadEvents() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEETS.events.range}?key=${API_KEY}`
        );
        const data = await response.json();
        const container = document.getElementById('events-container');
        
        if (data.values && data.values.length > 0) {
            container.innerHTML = '';
            
            data.values.forEach((row, index) => {
                const [imageUrl, title, date, time, description, tags, buttonText, buttonLink] = row;
                
                if (imageUrl && title) {
                    const eventCard = document.createElement('div');
                    eventCard.className = 'event-card';
                    eventCard.style.animationDelay = `${index * 0.1}s`;
                    eventCard.innerHTML = `
                        <div class="event-image" style="background-image: url(${imageUrl})"></div>
                        <div class="event-info">
                            <h3>${title}</h3>
                            ${date ? `<span class="date">${date}${time ? ` at ${time}` : ''}</span>` : ''}
                            ${description ? `<p>${description}</p>` : ''}
                            ${tags ? `
                            <div class="tags">
                                ${tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
                            </div>` : ''}
                            ${buttonText ? `
                            <div class="event-actions">
                                <a href="${buttonLink || '#'}" class="event-btn">
                                    ${buttonText}
                                    <i class="fas fa-arrow-right"></i>
                                </a>
                            </div>` : ''}
                        </div>
                    `;
                    container.appendChild(eventCard);
                }
            });
        } else {
            showError(container, 'No events scheduled yet');
        }
    } catch (error) {
        console.error('Error loading events:', error);
        showError(document.getElementById('events-container'), 'Error loading events');
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
        
        if (data.values && data.values.length > 0) {
            container.innerHTML = '';
            
            data.values.forEach((row, index) => {
                const [imageUrl, title, date, description] = row;
                if (imageUrl && title) {
                    const newsCard = document.createElement('div');
                    newsCard.className = 'news-card';
                    newsCard.style.animationDelay = `${index * 0.1}s`;
                    newsCard.innerHTML = `
                        <div class="news-image" style="background-image: url(${imageUrl})"></div>
                        <div class="news-info">
                            <h3>${title}</h3>
                            ${date ? `<span class="date">${date}</span>` : ''}
                            ${description ? `<p>${description}</p>` : ''}
                        </div>
                    `;
                    container.appendChild(newsCard);
                }
            });
        } else {
            showError(container, 'No news available');
        }
    } catch (error) {
        console.error('Error loading news:', error);
        showError(document.getElementById('news-container'), 'Error loading news');
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
        
        if (data.values && data.values.length > 0) {
            container.innerHTML = '';
            
            data.values.forEach((row, index) => {
                const [videoUrl, title, description] = row;
                const videoId = extractYouTubeId(videoUrl);
                
                if (videoId) {
                    const videoCard = document.createElement('div');
                    videoCard.className = 'video-card';
                    videoCard.style.animationDelay = `${index * 0.1}s`;
                    videoCard.innerHTML = `
                        <iframe src="https://www.youtube.com/embed/${videoId}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen
                                title="${title || 'Festival Video'}"></iframe>
                        <div class="video-info">
                            ${title ? `<h3>${title}</h3>` : ''}
                            ${description ? `<p>${description}</p>` : ''}
                        </div>
                    `;
                    container.appendChild(videoCard);
                }
            });
        } else {
            showError(container, 'No videos available');
        }
    } catch (error) {
        console.error('Error loading videos:', error);
        showError(document.getElementById('video-container'), 'Error loading videos');
    }
}

// Load gallery
async function loadGallery() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEETS.gallery.range}?key=${API_KEY}`
        );
        const data = await response.json();
        const container = document.getElementById('gallery-container');
        
        if (data.values && data.values.length > 0) {
            container.innerHTML = '';
            
            data.values.forEach((row, index) => {
                const [imageUrl, description, tags] = row;
                
                if (imageUrl) {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    galleryItem.style.animationDelay = `${index * 0.1}s`;
                    galleryItem.innerHTML = `
                        <div class="gallery-image" style="background-image: url(${imageUrl})"></div>
                        <div class="gallery-info">
                            ${description ? `<p>${description}</p>` : ''}
                            ${tags ? `
                            <div class="tags">
                                ${tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
                            </div>` : ''}
                        </div>
                    `;
                    container.appendChild(galleryItem);
                }
            });
        } else {
            showError(container, 'No gallery items available');
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
        showError(document.getElementById('gallery-container'), 'Error loading gallery');
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
        
        if (data.values && data.values.length > 0) {
            container.innerHTML = '';
            
            data.values.forEach((row, index) => {
                const [logoUrl, name] = row;
                
                if (logoUrl) {
                    const brandLogo = document.createElement('div');
                    brandLogo.className = 'brand-logo-container';
                    brandLogo.style.animationDelay = `${index * 0.1}s`;
                    brandLogo.innerHTML = `
                        <img src="${logoUrl}" 
                             alt="${name || 'Partner Logo'}" 
                             class="brand-logo" 
                             loading="lazy">
                        ${name ? `<span class="brand-name">${name}</span>` : ''}
                    `;
                    container.appendChild(brandLogo);
                }
            });
        } else {
            showError(container, 'No partners to display');
        }
    } catch (error) {
        console.error('Error loading brands:', error);
        showError(document.getElementById('brands-container'), 'Error loading partners');
    }
}

// Helper functions
function extractYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function showError(container, message) {
    if (container) {
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (updateInterval) clearInterval(updateInterval);
    if (swiper) swiper.destroy();
});
