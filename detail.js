

const productId = new URLSearchParams(window.location.search).get('id');
const apiUrl = `https://api.escuelajs.co/api/v1/products/${productId}`;
const placeholderImageUrl = "https://via.placeholder.com/150";

async function fetchProductDetails() {
    try {
        console.log('Product ID:', productId);
        console.log('API URL:', apiUrl);

        const response = await fetch(apiUrl);
        console.log('Response Status:', response.status);

        if (!response.ok) {
            throw new Error(`Failed to fetch product details. Status: ${response.status}`);
        }

        const product = await response.json();
        console.log('Product Data:', product);

        const productImage = (product.images && product.images.length > 0) ? product.images[0] : placeholderImageUrl;
        console.log('Product Images:', product.images);
        console.log('Product Image URL:', productImage);

        document.getElementById('product-image').src = productImage;
        document.getElementById('product-image').alt = product.title || 'Product Image';
        document.getElementById('product-title').textContent = product.title || 'No title available';
        document.getElementById('product-description').textContent = product.description || 'No description available';
        document.getElementById('product-category').textContent = product.category?.name || 'N/A';
        document.getElementById('product-price').textContent = product.price ? product.price.toFixed(2) : 'N/A';
    } catch (error) {
        console.error('Error:', error);
        document.querySelector('.content').innerHTML = '<p>Unable to load product details. Please try again later.</p>';
    }
}

fetchProductDetails();
