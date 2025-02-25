
const apiProductsUrl = 'https://api.escuelajs.co/api/v1/products';
const apiCategoriesUrl = 'https://api.escuelajs.co/api/v1/categories';

async function fetchCategories() {
    const categorySelect = document.getElementById('category');
    try {
        const response = await fetch(apiCategoriesUrl);
        const categories = await response.json();

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

async function fetchProducts(categoryId = 'all', minPrice = 0, maxPrice = Infinity) {
    const cards = document.getElementById('cards');
    cards.innerHTML = '';

    try {
        const response = await fetch(apiProductsUrl);
        const products = await response.json();

        const filteredProducts = products.filter(product => {
            const inCategory = categoryId === 'all' || product.category.id === parseInt(categoryId);
            const inPriceRange = product.price >= minPrice && product.price <= maxPrice;
            return inCategory && inPriceRange;
        });

        filteredProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <picture class="product-img">
                    <img src="${product.images[0]}" alt="${product.title}">
                </picture>
                <div class="product-title">${product.title}</div>
                <div class="product-category">${product.category.name}</div>
                <div class="product-price"><span>$${product.price}</span></div>
            `;

            card.addEventListener("click", () => {
                window.location.href = `detail.html?id=${product.id}`;
            });


            cards.appendChild(card);
        });

        if (filteredProducts.length === 0) {
            cards.innerHTML = '<p>No products found.</p>';
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

document.getElementById('apply').addEventListener('click', () => {
    const selectedCategory = document.getElementById('category').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;

    fetchProducts(selectedCategory, minPrice, maxPrice);
});


document.getElementById('reset').addEventListener('click', () => {
    document.getElementById('category').value = 'all';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    fetchProducts();
});


fetchCategories();
fetchProducts();


