// ================== CART FUNCTIONALITY ==================
let cart = [];

// Update cart count in header
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Update cart sidebar contents
function updateCartSidebar() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotalElement.textContent = 'Total: $0.00';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
            </div>
            <div class="item-actions">
                <button class="quantity-btn minus">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus">+</button>
                <button class="remove-btn">×</button>
            </div>
        </div>
    `).join('');

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Add to cart functionality
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            const productName = button.dataset.name;
            const productPrice = parseFloat(button.dataset.price);
            
            // Check if item already exists in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }
            
            updateCartCount();
            updateCartSidebar();
            
            // Visual feedback
            button.textContent = 'Added!';
            button.style.backgroundColor = '#2ecc71';
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '';
            }, 1000);
        });
    });

    // Toggle cart sidebar
    document.getElementById('cart-link').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('cart-sidebar').classList.toggle('open');
    });

    // Cart item interactions
    document.addEventListener('click', (e) => {
        const cartItem = e.target.closest('.cart-item');
        if (!cartItem) return;
        
        const productId = cartItem.dataset.id;
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (e.target.classList.contains('remove-btn')) {
            cart.splice(itemIndex, 1);
        } 
        else if (e.target.classList.contains('minus')) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                cart.splice(itemIndex, 1);
            }
        }
        else if (e.target.classList.contains('plus')) {
            cart[itemIndex].quantity += 1;
        }
        
        updateCartCount();
        updateCartSidebar();
    });
});

// ================== FORM VALIDATION ==================
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        // Validate name
        const nameInput = form.querySelector('#name');
        if (nameInput.value.trim().length < 2) {
            showError(nameInput, 'Name must be at least 2 characters');
            isValid = false;
        } else {
            clearError(nameInput);
        }
        
        // Validate email
        const emailInput = form.querySelector('#email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            clearError(emailInput);
        }
        
        // Validate message
        const messageInput = form.querySelector('#message');
        if (messageInput.value.trim().length < 10) {
            showError(messageInput, 'Message must be at least 10 characters');
            isValid = false;
        } else {
            clearError(messageInput);
        }
        
        if (isValid) {
            // Show success message
            const successModal = document.createElement('div');
            successModal.className = 'success-modal';
            successModal.innerHTML = `
                <div class="modal-content">
                    <h3>Thank you!</h3>
                    <p>Your message has been sent successfully.</p>
                    <button class="close-modal">OK</button>
                </div>
            `;
            document.body.appendChild(successModal);
            
            // Close modal handler
            successModal.querySelector('.close-modal').addEventListener('click', () => {
                document.body.removeChild(successModal);
                form.reset();
            });
        }
    });
}

function showError(input, message) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = message;
    input.classList.add('error');
}

function clearError(input) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = '';
    input.classList.remove('error');
}