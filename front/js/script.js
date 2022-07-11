/************************************************************************
                Insert the products into the homepage
************************************************************************/


//URL API
const api_url = 'http://localhost:3000/api/products'


// Get all products from API - fetch request get
async function getAllProducts() {
    let url = api_url;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}
getAllProducts()


//render a product into the homepage
async function renderProducts() {
    let products = await getAllProducts()
    console.log(products)
    let html = ''
    products.forEach((product) => {
        let htmlSegment = `
        <a href="./product.html?id=${product._id}">
            <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
            </article>
        </a>`

        html += htmlSegment
    });
    let item = document.getElementById('items')
    item.innerHTML = html;
}

renderProducts()


// Get all products Id
async function getId() {
    let products = await getAllProducts();
        const productId = products.map((product) => {
            return product._id
        })
    console.log(productId)
}


// Get all products url
async function getProductUrl() {
    let products = await getAllProducts();
        const productId = products.map((product) => {
            return `${api_url}/${product._id}`
        })
    console.log(productId)
}