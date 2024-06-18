// Lista de productos
const products = [];
for (let i = 1; i <= 40; i++) {
    products.push({
        id: i,
        name: 'Producto ' + i,
        price: (Math.random() * 100).toFixed(2)
    });
}

const productList = document.getElementById('product-list');
const cartCount = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartDetails = document.getElementById('cart-details');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const deliveryAddress = document.getElementById('delivery-address');
const searchBar = document.getElementById('search-bar');
const ticketItems = document.getElementById('ticket-items');
const ticketTotal = document.getElementById('ticket-total');
let cart = [];

// Generar productos
function generateProducts() {
    productList.innerHTML = '';
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Agregar al carrito</button>
        `;
        productList.appendChild(productItem);
    });
}

generateProducts();

// Agregar al carrito
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    const existingProduct = cart.find(p => p.id === productId);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    updateCart();
}

// Actualizar carrito
function updateCart() {
    const subtotal = cart.reduce((acc, product) => acc + parseFloat(product.price) * product.quantity, 0).toFixed(2);
    cartCount.textContent = cart.reduce((acc, product) => acc + product.quantity, 0);
    cartSubtotal.textContent = subtotal;
    cartItems.innerHTML = '';
    cart.forEach(product => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${product.name} - $${product.price} x ${product.quantity}
            <div class="quantity-controls">
                <button onclick="decrementQuantity(${product.id})">-</button>
                <span>${product.quantity}</span>
                <button onclick="incrementQuantity(${product.id})">+</button>
            </div>
        `;
        cartItems.appendChild(listItem);
    });
    cartTotal.textContent = subtotal;
}

// Incrementar cantidad
window.incrementQuantity = function(productId) {
    const product = cart.find(p => p.id === productId);
    if (product) {
        product.quantity++;
        updateCart();
    }
}

// Decrementar cantidad
window.decrementQuantity = function(productId) {
    const product = cart.find(p => p.id === productId);
    if (product && product.quantity > 1) {
        product.quantity--;
    } else {
        cart = cart.filter(p => p.id !== productId);
    }
    updateCart();
}

// Filtrar productos
searchBar.addEventListener('input', function() {
    const searchValue = searchBar.value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchValue));
    productList.innerHTML = '';
    filteredProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Agregar al carrito</button>
        `;
        productList.appendChild(productItem);
    });
});

// Manejar opciones de entrega
document.querySelectorAll('input[name="delivery"]').forEach(input => {
    input.addEventListener('change', function() {
        deliveryAddress.disabled = this.value !== 'address';
    });
});

// Enviar pedido por WhatsApp
document.getElementById('send-order').addEventListener('click', function() {
    const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
    const paymentOption = document.querySelector('input[name="payment"]:checked').value;

    let message = `Pedido:\n\n`;
    cart.forEach(product => {
        message += `${product.name} - $${product.price} x ${product.quantity}\n`;
    });
    message += `\nTotal: $${cartSubtotal.textContent}\n`;
    message += `Opción de entrega: ${deliveryOption === 'address' ? `A domicilio (${deliveryAddress.value})` : 'Recoger en local'}\n`;
    message += `Opción de pago: ${paymentOption === 'card' ? 'Tarjeta de crédito' : paymentOption === 'cash' ? 'Efectivo' : 'Transferencia'}`;

    const whatsappURL = `https://api.whatsapp.com/send?phone=YOUR_PHONE_NUMBER&text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
});

// Mostrar carrito flotante
const floatingCart = document.getElementById('floating-cart');
floatingCart.addEventListener('click', function() {
    cartDetails.style.display = cartDetails.style.display === 'block' ? 'none' : 'block';
});

// Imprimir ticket
document.getElementById('print-ticket').addEventListener('click', function() {
    const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
    const paymentOption = document.querySelector('input[name="payment"]:checked').value;

    let ticketContent = `Pedido:\n\n`;
    cart.forEach(product => {
        ticketContent += `${product.name} - $${product.price} x ${product.quantity}\n`;
    });
    ticketContent += `\nTotal: $${cartSubtotal.textContent}\n`;
    ticketContent += `Opción de entrega: ${deliveryOption === 'address' ? `A domicilio (${deliveryAddress.value})` : 'Recoger en local'}\n`;
    ticketContent += `Opción de pago: ${paymentOption === 'card' ? 'Tarjeta de crédito' : paymentOption === 'cash' ? 'Efectivo' : 'Transferencia'}`;

    updateTicket(ticketContent);
    printTicket();
});

function updateTicket(content) {
    ticketItems.innerHTML = '';
    cart.forEach(product => {
        const ticketItem = document.createElement('div');
        ticketItem.classList.add('item');
        ticketItem.innerHTML = `
            <span>${product.name} x${product.quantity}</span>
            <span>$${product.price}</span>
        `;
        ticketItems.appendChild(ticketItem);
    });
    ticketTotal.textContent = cartSubtotal.textContent;
    document.getElementById('ticket').style.display = 'block';
}

function printTicket() {
    const ticket = document.getElementById('ticket');
    const printWindow = window.open('', '', 'width=300,height=600');
    printWindow.document.write(`<html><head><title>Ticket</title></head><body>${ticket.outerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}
