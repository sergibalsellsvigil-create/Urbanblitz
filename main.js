/* ==========================================================================
    SISTEMA DE INTERACCIÓN - URBANBLITZ (VERSIÓN PROFESIONAL)
   ========================================================================== */

// 1. VARIABLE GLOBAL DEL CARRITO (Con validación de seguridad)
let cartList = JSON.parse(localStorage.getItem('urbanblitz_cart_list')) || [];

// 2. FUNCIÓN PARA ACTUALIZAR EL CONTADOR (Sincronizado)
function updateCartDisplay() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartList.length;
        
        // Efecto visual de "latido" al actualizar
        cartCountElement.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.3)', color: '#ff0000' },
            { transform: 'scale(1)' }
        ], { duration: 200 });
    }
}

// 3. FUNCIÓN PARA AÑADIR AL CARRITO
function addToCart(nombre, precio, imagen) {
    const newProduct = {
        id: Date.now(),
        nombre: nombre,
        precio: parseFloat(precio),
        imagen: imagen,
        talla: "L", // Talla estándar por defecto
        color: "Original"
    };

    cartList.push(newProduct);
    saveAndRefresh();
    
    // Feedback profesional: Notificación simple
    showNotification(`Añadido: ${nombre}`);
}

// 4. SISTEMA DE NOTIFICACIÓN (Toast) - Mejora la UX
function showNotification(mensaje) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ff0000;
        color: white;
        padding: 12px 25px;
        border-radius: 4px;
        font-family: 'Inter', sans-serif;
        font-weight: 900;
        text-transform: uppercase;
        z-index: 100000;
        box-shadow: 0 0 15px rgba(255,0,0,0.5);
    `;
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = '0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

// 5. GUARDAR Y REFRESCAR
function saveAndRefresh() {
    localStorage.setItem('urbanblitz_cart_list', JSON.stringify(cartList));
    updateCartDisplay();
    if (typeof renderCart === 'function') {
        renderCart();
    }
}

// 6. ELIMINAR DEL CARRITO (Global para carrito.html)
window.removeFromCart = (id) => {
    cartList = cartList.filter(item => item.id !== id);
    saveAndRefresh();
};

// 7. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();

    // Lógica para botones de talla/color (si existen en la página)
    const setupSelection = (selectors, activeClass) => {
        const elements = document.querySelectorAll(selectors);
        elements.forEach(el => {
            el.addEventListener('click', () => {
                elements.forEach(e => e.classList.remove(activeClass));
                el.classList.add(activeClass);
            });
        });
    };

    setupSelection('.size-btn', 'selected');
    setupSelection('.color-dot', 'selected');

    // Manejo de Dropdowns para móviles
    const dropdowns = document.querySelectorAll('.dropdown > a');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth < 950) { // Ajustado a tu media-query de CSS
                e.preventDefault();
                const menu = dropdown.nextElementSibling;
                if (menu) {
                    const isVisible = menu.style.display === 'block';
                    menu.style.display = isVisible ? 'none' : 'block';
                }
            }
        });
    });

    // --- SECCIÓN 8: LÓGICA DEL MENÚ HAMBURGUESA ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navList = document.getElementById('nav-list');

    if (menuBtn && navList) {
        menuBtn.addEventListener('click', () => {
            navList.classList.toggle('active');
            
            // Cambia el icono de barras (bars) a una X (xmark)
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
    }
});