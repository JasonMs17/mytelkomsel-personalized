/**
 * MyTelkomsel Clone - Modern JavaScript
 * No Framework - Pure Vanilla JS
 */

// ============================================
// CONSTANTS
// ============================================
const ANIMATION_DELAYS = {
    FADE_OUT: 150,
    RIPPLE_REMOVE: 600,
    POPUP_CLOSE: 200,
    NOTIFICATION_AUTO_CLOSE: 3000,
    NOTIFICATION_FADE_OUT: 300,
    BUTTON_LOADING: 1000,
};

const CATEGORY_NAMES = {
    'youtube': 'YouTube',
    'zoom': 'Zoom',
    'streaming': 'Streaming',
    'education': 'Belajar',
    'netflix': 'Netflix',
};

const TAB_CATEGORY_NAMES = {
    'internet': 'Hyper 5G',
    'darurat': 'Paket Darurat',
    'roaming': 'Paket Roaming',
    'hiburan': 'Paket Hiburan',
    'telepon-sms': 'Paket Telepon & SMS',
};

// ============================================
// DATA
// ============================================
const packageData = {
    'special': [
        { id: 1, name: 'Berlangganan kuota belajar/ilmupedia', data: '22 GB', duration: '7 Hari', type: 'Sekali Beli', price: 'Rp13.500', category: 'education', isSubscription: true },
        { id: 2, name: 'Berlangganan Paket Zoom Pro', data: '1.5 GB', duration: '3 Hari', type: 'Sekali Beli', price: 'Rp25.000', category: 'zoom', isSubscription: true },
        { id: 3, name: 'Berlangganan Google Play Pass', data: '2 GB', duration: '30 Hari', type: 'Berlangganan', price: 'Rp30.000', category: 'entertainment', isSubscription: true },
        { id: 4, name: 'Berlangganan Paket Streaming', data: '5 GB', duration: '7 Hari', type: 'Berlangganan', price: 'Rp30.000', category: 'entertainment', isSubscription: true },
    ],
    'kamu-banget': [
        { id: 5, name: 'kuota belajar/ilmupedia', data: '22 GB', duration: '7 Hari', type: 'Sekali Beli', price: 'Rp13.500', category: 'education' },
        { id: 6, name: 'Paket Zoom Pro', data: '1.5 GB', duration: '3 Hari', type: 'Sekali Beli', price: 'Rp25.000', category: 'zoom' },
        { id: 7, name: 'Google Play Pass', data: '2 GB', duration: '30 Hari', type: 'Berlangganan', price: 'Rp30.000', category: 'entertainment', isSubscription: true },
        { id: 8, name: 'Paket Streaming', data: '5 GB', duration: '7 Hari', type: 'Berlangganan', price: 'Rp30.000', category: 'entertainment', isSubscription: true },
    ],
    'internet': [
        { id: 9, name: 'Super Seru 5G', data: '22 GB', duration: '28 Hari', type: 'Sekali Beli', price: '', category: 'internet' },
        { id: 10, name: 'Super Seru 5G', data: '30 GB', duration: '28 Hari', type: 'Sekali Beli', price: 'Rp60.000', category: 'internet' },
        { id: 11, name: 'Super Seru 5G', data: '40 GB', duration: '28 Hari', type: 'Sekali Beli', price: 'Rp75.000', category: 'internet' },
        { id: 12, name: 'Super Seru 5G', data: '55 GB', duration: '28 Hari', type: 'Sekali Beli', price: '', category: 'internet' },
        { id: 13, name: 'Super Seru 5G', data: '90 GB', duration: '28 Hari', type: 'Sekali Beli', price: 'Rp110.000', category: 'internet' },
        { id: 14, name: 'Super Seru 5G', data: '110 GB', duration: '28 Hari', type: 'Sekali Beli', price: 'Rp140.000', category: 'internet' },
        { id: 15, name: 'Super Seru 5G', data: '140 GB', duration: '28 Hari', type: 'Sekali Beli', price: '', category: 'internet' },
        { id: 16, name: 'Internet 5G', data: '8 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp35.000', category: 'internet' },
        { id: 17, name: 'Internet 5G', data: '12 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp50.000', category: 'internet' },
        { id: 18, name: 'Internet 5G', data: '30 GB', duration: '30 Hari', type: 'Sekali Beli', price: '', category: 'internet' },
        { id: 19, name: 'Internet 5G', data: '120 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp200.000', category: 'internet' },
    ],
    'darurat': [
        { id: 20, name: 'Paket Darurat 1GB', data: '1 GB', duration: '1 Hari', type: 'Sekali Beli', price: 'Rp10.000', category: 'emergency' },
        { id: 21, name: 'Paket Darurat 2GB', data: '2 GB', duration: '1 Hari', type: 'Sekali Beli', price: 'Rp15.000', category: 'emergency' },
        { id: 22, name: 'Paket Darurat 5GB', data: '5 GB', duration: '3 Hari', type: 'Sekali Beli', price: 'Rp25.000', category: 'emergency' },
    ],
    'roaming': [
        { id: 23, name: 'Roaming Asia', data: '3 GB', duration: '7 Hari', type: 'Sekali Beli', price: 'Rp150.000', category: 'roaming' },
        { id: 24, name: 'Roaming Global', data: '5 GB', duration: '7 Hari', type: 'Sekali Beli', price: 'Rp250.000', category: 'roaming' },
    ],
    'hiburan': [
        { id: 25, name: 'Paket YouTube', data: '10 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp25.000', category: 'youtube' },
        { id: 26, name: 'Paket Netflix', data: '15 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp35.000', category: 'netflix' },
        { id: 27, name: 'Paket Streaming All', data: '20 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp50.000', category: 'streaming' },
    ],
    'telepon-sms': [
        { id: 28, name: 'Paket Telepon', data: '100 Menit', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp20.000', category: 'call' },
        { id: 29, name: 'Paket SMS', data: '100 SMS', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp15.000', category: 'sms' },
        { id: 30, name: 'Paket Combo', data: '50 Menit + 50 SMS', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp25.000', category: 'combo' },
    ],
    'rekomendasi-utama': [
        { id: 31, name: 'Paket YouTube Premium', data: '5 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp30.000', category: 'youtube', usage: '3 GB' },
        { id: 32, name: 'Paket Zoom Pro', data: '3 GB', duration: '7 Hari', type: 'Sekali Beli', price: 'Rp35.000', category: 'zoom', usage: '2.5 GB' },
        { id: 33, name: 'Paket Streaming', data: '10 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp40.000', category: 'streaming', usage: '8 GB' },
        { id: 34, name: 'Paket Belajar', data: '15 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp35.000', category: 'education', usage: '12 GB' },
    ],
    'waktu-terbatas': [
        { id: 35, name: 'Paket Begadang', data: '10 GB', duration: '1 Malam', type: 'Sekali Beli', price: 'Rp15.000', category: 'night', timeLimited: true },
        { id: 36, name: 'Paket Malam Spesial', data: '20 GB', duration: '1 Malam', type: 'Sekali Beli', price: 'Rp25.000', category: 'night', timeLimited: true },
        { id: 37, name: 'Paket Tengah Malam', data: '15 GB', duration: '1 Malam', type: 'Sekali Beli', price: 'Rp20.000', category: 'night', timeLimited: true },
    ],
};

const usageData = {
    'youtube': { used: '3 GB', period: 'bulan lalu' },
    'zoom': { used: '2.5 GB', period: 'bulan lalu' },
    'streaming': { used: '8 GB', period: 'bulan lalu' },
    'education': { used: '12 GB', period: 'bulan lalu' },
    'netflix': { used: '5 GB', period: 'bulan lalu' },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getCategoryName(category) {
    return CATEGORY_NAMES[category] || category;
}

function generateRecommendationMessage(packageItem) {
    const category = packageItem.category;
    const usage = usageData[category];
    
    if (usage) {
        return `Kamu menghabiskan ${usage.used} di ${getCategoryName(category)} ${usage.period}, mau tambah paket ${packageItem.name} ${packageItem.data}?`;
    }
    
    return `Berdasarkan pemakaianmu, paket ${packageItem.name} ${packageItem.data} cocok untuk kamu. Mau tambahkan?`;
}

function createRippleEffect(event, element) {
    try {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: rgba(237, 28, 36, 0.2);
            transform: scale(0);
            animation: rippleAnimation 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, ANIMATION_DELAYS.RIPPLE_REMOVE);
    } catch (error) {
        console.warn('Failed to create ripple effect:', error);
    }
}

// ============================================
// DOM MANIPULATION FUNCTIONS
// ============================================

function createPackageCard(packageItem, showSubscriptionBadge = false, isGrid = false, index = 0) {
    const card = document.createElement('div');
    card.className = isGrid ? 'package-card-grid' : 'package-card';
    card.dataset.packageId = packageItem.id;
    card.dataset.category = packageItem.category;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Paket ${packageItem.name} - ${packageItem.data}`);
    
    const staggerIndex = Math.min(index % 5 + 1, 5);
    card.classList.add(`stagger-${staggerIndex}`);
    
    let badgeHtml = '';
    if (showSubscriptionBadge && (packageItem.isSubscription || showSubscriptionBadge)) {
        badgeHtml = '<div class="package-badge">Berlangganan</div>';
    }
    
    const priceHtml = packageItem.price 
        ? `<div class="package-price">${packageItem.price}</div>` 
        : '';
    
    const nameClass = badgeHtml ? 'package-name' : 'package-name no-badge';
    
    card.innerHTML = `
        ${badgeHtml}
        <div class="${nameClass}">${packageItem.name}</div>
        <div class="package-data">${packageItem.data}</div>
        <div class="package-duration">${packageItem.duration}</div>
        <div class="package-type">${packageItem.type}</div>
        ${priceHtml}
    `;
    
    const handleClick = (e) => {
        createRippleEffect(e, card);
        setTimeout(() => {
            showAIRecommendation(packageItem);
        }, 200);
    };
    
    card.addEventListener('click', handleClick);
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e);
        }
    });
    
    return card;
}

function renderPackages(containerId, packages, showSubscriptionBadge = false, isGrid = false) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container with ID "${containerId}" not found`);
        return;
    }
    
    if (!Array.isArray(packages) || packages.length === 0) {
        container.innerHTML = '<p style="color: var(--gray-500);">Tidak ada paket tersedia.</p>';
        return;
    }
    
    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        container.innerHTML = '';
        
        if (isGrid) {
            container.className = 'packages-grid';
        } else {
            container.className = 'cards-container';
        }
        
        packages.forEach((pkg, index) => {
            const card = createPackageCard(pkg, showSubscriptionBadge, isGrid, index);
            container.appendChild(card);
        });
        
        requestAnimationFrame(() => {
            container.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        });
    }, ANIMATION_DELAYS.FADE_OUT);
}

function switchTab(tabName) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
        setTimeout(() => {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-selected', 'true');
        }, 50);
    }
    
    const tabContent = document.getElementById('tabContent');
    if (!tabContent) {
        console.error('Tab content container not found');
        return;
    }
    
    const packages = packageData[tabName] || [];
    
    tabContent.style.opacity = '0';
    tabContent.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        if (tabName === 'kamu-banget') {
            tabContent.innerHTML = `
                <div class="tab-content-section">
                    <h3 class="tab-content-title">Rekomendasi Utama</h3>
                    <p class="tab-content-subtitle">Berdasarkan pemakaianmu bulan lalu</p>
                    <div class="cards-container" id="rekomendasiUtama" role="region" aria-label="Rekomendasi paket utama"></div>
                </div>
                <div class="tab-content-section">
                    <h3 class="tab-content-title">Spesial Waktu Terbatas</h3>
                    <p class="tab-content-subtitle">Paket begadang/malam</p>
                    <div class="cards-container" id="waktuTerbatas" role="region" aria-label="Paket waktu terbatas"></div>
                </div>
            `;
            
            renderPackages('rekomendasiUtama', packageData['rekomendasi-utama'], false);
            renderPackages('waktuTerbatas', packageData['waktu-terbatas'], false);
        } else {
            const categoryName = TAB_CATEGORY_NAMES[tabName] || 'Paket';
            
            tabContent.innerHTML = `
                <div class="tab-content-section">
                    <h3 class="tab-content-title">${categoryName}</h3>
                    <div class="packages-grid" id="packageGrid" role="region" aria-label="${categoryName}"></div>
                </div>
            `;
            
            renderPackages('packageGrid', packages, false, true);
        }
        
        requestAnimationFrame(() => {
            tabContent.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            tabContent.style.opacity = '1';
            tabContent.style.transform = 'translateY(0)';
        });
    }, ANIMATION_DELAYS.FADE_OUT);
}

// ============================================
// POPUP FUNCTIONS
// ============================================

function showAIRecommendation(packageItem) {
    const popup = document.getElementById('aiPopup');
    const messageEl = document.getElementById('popupMessage');
    
    if (!popup || !messageEl) {
        console.error('Popup elements not found');
        return;
    }
    
    messageEl.textContent = generateRecommendationMessage(packageItem);
    
    popup.classList.remove('hidden');
    popup.setAttribute('aria-hidden', 'false');
    
    document.body.style.overflow = 'hidden';
    
    const firstButton = popup.querySelector('button');
    if (firstButton) {
        setTimeout(() => firstButton.focus(), 100);
    }
}

function closePopup() {
    const popup = document.getElementById('aiPopup');
    
    if (!popup) {
        return;
    }
    
    popup.setAttribute('aria-hidden', 'true');
    
    setTimeout(() => {
        popup.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, ANIMATION_DELAYS.POPUP_CLOSE);
}

// ============================================
// NOTIFICATION FUNCTIONS
// ============================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#10b981' : '#ef4444';
    
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 1rem;
        background-color: ${bgColor};
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
        max-width: 400px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, ANIMATION_DELAYS.NOTIFICATION_FADE_OUT);
    }, ANIMATION_DELAYS.NOTIFICATION_AUTO_CLOSE);
}

// ============================================
// EVENT HANDLERS
// ============================================

function handleAcceptRecommendation() {
    const btn = document.getElementById('acceptRecommendation');
    if (!btn) return;
    
    const originalText = btn.textContent;
    btn.textContent = 'Memproses...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        closePopup();
        showNotification('Paket berhasil ditambahkan!', 'success');
    }, ANIMATION_DELAYS.BUTTON_LOADING);
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        const popup = document.getElementById('aiPopup');
        if (popup && !popup.classList.contains('hidden')) {
            closePopup();
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    try {
        renderPackages('specialPackages', packageData.special, true);
        switchTab('kamu-banget');
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                if (tabName) {
                    switchTab(tabName);
                }
            });
        });
        
        const closeBtn = document.getElementById('closePopup');
        const acceptBtn = document.getElementById('acceptRecommendation');
        const rejectBtn = document.getElementById('rejectRecommendation');
        const popup = document.getElementById('aiPopup');
        
        if (closeBtn) closeBtn.addEventListener('click', closePopup);
        if (acceptBtn) acceptBtn.addEventListener('click', handleAcceptRecommendation);
        if (rejectBtn) rejectBtn.addEventListener('click', closePopup);
        
        if (popup) {
            popup.addEventListener('click', (e) => {
                if (e.target.id === 'aiPopup') {
                    closePopup();
                }
            });
        }
        
        document.addEventListener('keydown', handleEscapeKey);
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

