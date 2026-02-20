// Mobile menu functionality
function initMobileMenu() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const menuGrid = document.querySelector('.mobile-menu-grid');

    function toggleMobileMenu() {
        if (menuGrid) {
            menuGrid.classList.toggle('menu-grid-open');
        }
    }

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleMobileMenu);
    }

    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (menuGrid) {
                menuGrid.classList.remove('menu-grid-open');
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (menuGrid && menuGrid.classList.contains('menu-grid-open')) {
            if (hamburgerMenu && !hamburgerMenu.contains(event.target) && !menuGrid.contains(event.target)) {
                menuGrid.classList.remove('menu-grid-open');
            }
        }
    });
}
