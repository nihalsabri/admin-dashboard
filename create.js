const apiUrl = "https://api.escuelajs.co/api/v1/products";

async function fetchProduct(productId) {
    try {
        const response = await fetch(`${apiUrl}/${productId}`);
        if (!response.ok) throw new Error("Product not found");
        return await response.json();
    } catch (error) {
        console.error(error);
    document.getElementById("titleError").innerHTML = "Failed to load product data";
        return null;
    }
}

async function fetchCategories() {
    try {
        const response = await fetch("https://api.escuelajs.co/api/v1/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const categories = await response.json();
        populateCategorySelect(categories);
    } catch (error) {
        console.error(error);
        document.getElementById("categoryError").innerHTML = "Failed to fetch categories"; }
    }


function populateCategorySelect(categories) {
    const categorySelect = document.getElementById("category");
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

function populateForm(product) {
    document.getElementById("title").value = product.title || "";
    document.getElementById("description").value = product.description || "";
    document.getElementById("price").value = product.price || "";
  
    document.getElementById("imageUrl").value = product.images && product.images.length > 0 ? product.images[0] : "";
    const categorySelect = document.getElementById("category");
    categorySelect.value = product.category?.id || "";
    // console.log("Product data:", product);
}


document.getElementById("productForm").addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const categoryId = document.getElementById("category").value;
    const price = document.getElementById("price").value;
    const imageUrl = document.getElementById("imageUrl").value;

    function clearErrors() { document.getElementById("titleError").innerHTML = ""; 
        document.getElementById("descriptionError").innerHTML = ""; 
        document.getElementById("imageUrlError").innerHTML = ""; 
        document.getElementById("priceError").innerHTML = "";
        document.getElementById("categoryError").innerHTML = ""; }
        clearErrors(); 
        let hasError = false; 
      
 if (!isValidUrl(imageUrl)) {
        document.getElementById("imageUrlError").innerHTMLt = "Please provide a valid image URL."; 
        hasError = true; 
    }
 if (!/^[a-zA-Z\s]+$/.test(title)) { 
 document.getElementById("titleError").innerHTML = "Please provide a valid title (letters and spaces only).";
 hasError = true; } 
if (!/^[a-zA-Z0-9\s.,!?]+$/.test(description)) {
 document.getElementById("descriptionError").innerHTML = "Please provide a valid description."; 
 hasError = true; } 

 if (!/^\d+(\.\d{1,2})?$/.test(price)) { 
    document.getElementById("priceError").innerHTML = "Please provide a valid price (numbers only).";
     hasError = true; }

     
     if (hasError) {
        return; 
      }

    const productData = {
        title,
        description,
        category: { id: categoryId },
        price,
        image: imageUrl
    };

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    try {
        let response;
        if (productId) {
          
            response = await fetch(`${apiUrl}/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            });
        } else {
            response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            });
        }

        if (!response.ok) throw new Error("Failed to save product");

        alert("Product saved successfully!");
        window.location.href = "admin.html"; 
    } catch (error) {
        console.error(error);
        alert("Error saving product");

        // document.getElementById("productForm").reset();
    }
});

function isValidUrl(url) {
    const pattern = new RegExp('^(https?:\\/\\/)?([a-z0-9]+[\\-\\.])*?[a-z0-9]+(?:\\.[a-z]{2,})?(\\/[^\\s]*)?$', 'i');
    return pattern.test(url);
}


document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    await fetchCategories();
    
    if (productId) {
        const product = await fetchProduct(productId);
        if (product) {
            populateForm(product);
            document.querySelector('h2').innerHTML = "Update Product"; 
            document.querySelector('button').innerHTML = 'Update'; 
        }
    }
});
