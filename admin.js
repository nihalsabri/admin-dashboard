
const placeholderImageUrl = "https://www.freeiconspng.com/images/no-image-icon";

const tableBody = document.getElementById("ProdcutsTableBody");
const searchBar = document.getElementById("searchBar");
const searchButton = document.getElementById("searchButton");

const productsPerPage = 20;
let currentPage = 1;
let allProducts = [];

async function fetchProducts(searchTerm = "") {

const url = searchTerm ? `${apiUrl}?title=${searchTerm}` : apiUrl;
    try {
         const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch products");
        allProducts = await response.json();
        displayProducts();
    } catch (error) {
        console.error(error);
        tableBody.innerHTML = `<tr><td colspan="5">Failed to load products</td></tr>`;
    }
}

function displayProducts() {
    const filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(searchBar.value.toLowerCase())
    );
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

    tableBody.innerHTML = currentProducts
        .map(product => `
             <tr>
                    <td>${product.id}</td>
                    <td>${product.title}</td>
                    <td>${product.category?.name || "N/A"}</td>
                    <td>${product.category?.id || "N/A"}</td>
                    <td>
                        <button onclick="editProduct(${product.id})">Edit</button>
                        <button onclick="deleteProduct(${product.id})">Delete</button>
                        <a href="detail.html?id=${product.id}">View</a>
                    </td>
                </tr>
            `)
            .join("");
    
        renderPagination(filteredProducts.length);
    }
    

function renderPagination(totalProducts) {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const paginationContainer = document.getElementById("pagination") || document.createElement("div");
    paginationContainer.id = "pagination";
    paginationContainer.innerHTML = `
        <button onclick="changePage(-1)" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button onclick="changePage(1)" ${currentPage === totalPages ? "disabled" : ""}>Next</button>
    `;
    document.body.appendChild(paginationContainer);
}

function changePage(offset) {
    currentPage += offset;
    displayProducts();
}


function editProduct(productId) {
    window.location.href = `create.html?id=${productId}`;
}


function deleteProduct(productId) {
    const modal = createDeleteModal(() => {
        fetch(`${apiUrl}/${productId}`, { method: "DELETE" })
            .then(response => {
                if (!response.ok) throw new Error("Failed to delete product");
                allProducts = allProducts.filter(product => product.id !== productId);
                displayProducts();
                modal.remove();
            })
            .catch(error => {
                console.error(error);
                alert("Failed to delete product");
            });
    });
    document.body.appendChild(modal);
}


function createDeleteModal(onConfirm) {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(85, 109, 114, 0.55)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.innerHTML = `
        <div style="background: hsl(180, 27%, 63%); padding: 20px; border-radius: 8px; text-align: center;">
            <p>Are you sure?</p>
            <button id="confirmDelete">Yes</button>
            <button id="cancelDelete">No</button>
        </div>
    `;
    modal.querySelector("#confirmDelete").addEventListener("click", onConfirm);
    modal.querySelector("#cancelDelete").addEventListener("click", () => modal.remove());
    return modal;
}


searchButton.addEventListener("click", () => {

    const searchTerm = searchBar.value.toLowerCase();
    fetchProducts(searchTerm); 
    currentPage = 1;
  });
fetchProducts();


