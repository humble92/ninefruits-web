// Function to load HTML components
async function loadComponent(elementId, filePath) {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        const html = await response.text();
        element.innerHTML = html;

        // Initialize component logic after loading
        if (elementId === 'header-placeholder') {
            initHeader();
        }
        if (elementId === 'footer-placeholder') {
            initFooter();
        }
    } catch (error) {
        console.error(error);
    }
}

// Initialize header functionality (Mobile menu, Active state)
function initHeader() {
    // 1. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 2. Handle same-page navigation links (clear hash properly)
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const linkUrl = new URL(link.href);
            const currentPath = window.location.pathname;
            
            // If clicking a link to the same page with empty or # hash
            if (linkUrl.pathname === currentPath && (!linkUrl.hash || linkUrl.hash === '#')) {
                e.preventDefault();
                // Clear the hash and update URL
                history.pushState(null, '', linkUrl.pathname);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                updateActiveState();
            }
        });
    });

    // 3. Active Link Highlighting
    updateActiveState();
}

// Update active state based on current URL (can be called on hash change)
function updateActiveState() {
    const currentPath = window.location.pathname;
    // Normalize hash: treat "#" (empty hash) as empty string
    const currentHash = window.location.hash === '#' ? '' : window.location.hash;
    const links = document.querySelectorAll('nav a');

    links.forEach(link => {
        const linkUrl = new URL(link.href);
        const linkPath = linkUrl.pathname;
        // Normalize hash: treat "#" as empty string
        const linkHash = linkUrl.hash === '#' ? '' : linkUrl.hash;
        
        let isActive = false;

        const onAppsSection = currentPath === '/apps' || currentPath.startsWith('/apps/');
        const linkIsApps = linkPath.endsWith('/apps/index.html');

        if (linkIsApps && onAppsSection) {
            isActive = true;
        } else if (linkPath === currentPath) {
            if (linkHash) {
                // Link has a meaningful hash (like #about) - must match exactly
                isActive = (linkHash === currentHash);
            } else {
                // Link has no hash - active if current URL also has no meaningful hash
                isActive = (!currentHash || currentHash === '');
            }
        }

        // Reset all styles first, then apply active
        link.classList.remove('text-primary');
        link.classList.add('text-slate-600', 'dark:text-gray-300');
        
        if (isActive) {
            link.classList.add('text-primary');
            link.classList.remove('text-slate-600', 'dark:text-gray-300');
        }
    });
}

// Initialize footer functionality (Share button)
function initFooter() {
    const shareBtn = document.getElementById('share-btn');
    const copyToast = document.getElementById('copy-toast');

    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const pageUrl = window.location.href;
            const pageTitle = document.title;

            // Try Web Share API first (supported on mobile and some desktop browsers)
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: pageTitle,
                        url: pageUrl
                    });
                    return; // Success, no need to show toast
                } catch (err) {
                    // User cancelled or error - fall back to copy
                    if (err.name === 'AbortError') return; // User cancelled
                }
            }

            // Fallback: Copy URL to clipboard
            try {
                await navigator.clipboard.writeText(pageUrl);
                showCopyToast(copyToast);
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = pageUrl;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showCopyToast(copyToast);
            }
        });
    }
}

// Show toast notification
function showCopyToast(toast) {
    if (!toast) return;
    toast.classList.remove('opacity-0');
    toast.classList.add('opacity-100');
    
    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
    }, 2000);
}

// Initialize apps filter functionality (for apps/index.html)
function initAppsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const appCards = document.querySelectorAll('.app-card');

    if (filterButtons.length === 0 || appCards.length === 0) return;

    // Active button styles
    const activeStyles = 'bg-primary text-background-dark shadow-lg shadow-primary/20';
    const inactiveStyles = 'bg-surface-dark border border-border-dark text-gray-300';

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update button styles
            filterButtons.forEach(b => {
                b.classList.remove('bg-primary', 'text-background-dark', 'shadow-lg', 'shadow-primary/20', 'active');
                b.classList.add('bg-surface-dark', 'border', 'border-border-dark');
                // Reset icon and text colors
                const icon = b.querySelector('.material-symbols-outlined');
                const text = b.querySelector('p');
                if (icon) icon.classList.add('text-gray-400');
                if (text) text.classList.remove('text-background-dark', 'font-bold');
                if (text) text.classList.add('text-gray-300', 'font-medium');
            });

            // Set active button styles
            btn.classList.remove('bg-surface-dark', 'border', 'border-border-dark');
            btn.classList.add('bg-primary', 'text-background-dark', 'shadow-lg', 'shadow-primary/20', 'active');
            const activeIcon = btn.querySelector('.material-symbols-outlined');
            const activeText = btn.querySelector('p');
            if (activeIcon) activeIcon.classList.remove('text-gray-400');
            if (activeText) {
                activeText.classList.remove('text-gray-300', 'font-medium');
                activeText.classList.add('text-background-dark', 'font-bold');
            }

            // Filter cards with animation
            appCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-placeholder', '/components/header.html');
    loadComponent('footer-placeholder', '/components/footer.html');
    
    // Initialize apps filter if on apps page
    initAppsFilter();
});

// Listen for hash changes (same-page anchor navigation)
window.addEventListener('hashchange', updateActiveState);
