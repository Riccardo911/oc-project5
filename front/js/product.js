/*********************************************************/
    //UrlSearchParams - get Id from window url
/*********************************************************/

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const id_pageProduct = urlParams.get('id')


/*********************************************************/
    //Insert a product and its details into a product page
/*********************************************************/

//URL API
const api_url = 'http://localhost:3000/api/products'

//get all products from API
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


//render a product into product page chosen on the homepage 
async function renderProductByIdPage() {
    let products = await getAllProducts()
    let filteredProductById = products.filter((product) => {
        return product._id === id_pageProduct
    })
    console.log(filteredProductById, 'rendered product')
    let html_imageProduct = ''
    let html_nameProduct = ''
    let html_priceProduct = ''
    let html_descriptionProduct = ''
    filteredProductById.forEach((characteristic) =>{
        //image
        let htmlSegment_imageProduct = `<img src = "${characteristic.imageUrl}" alt="${characteristic.altTxt}">`
        html_imageProduct += htmlSegment_imageProduct
        //name 
        let htmlSegment_nameProduct = `${characteristic.name}`
        html_nameProduct += htmlSegment_nameProduct
        //price
        let htmlSegment_priceProduct = `${characteristic.price}`
        html_priceProduct += htmlSegment_priceProduct
        //description
        let htmlSegment_descriptionProduct = `${characteristic.description}`
        html_descriptionProduct += htmlSegment_descriptionProduct
    })
    //image
    let image_filteredProductById = document.querySelector('.item__img')
    image_filteredProductById.innerHTML = html_imageProduct;
    //name
    let name_filteredProductById = document.getElementById('title')
    name_filteredProductById.innerHTML = html_nameProduct;
    //price
    let price_filteredProductById = document.getElementById('price')
    price_filteredProductById.innerHTML = html_priceProduct;
    //description
    let description_filteredProductById = document.getElementById('description')
    description_filteredProductById.innerHTML = html_descriptionProduct;
}
renderProductByIdPage()


/*******************************************************/
    //show colors available  in dropdown menu 
/*******************************************************/

async function dropDrowMenu_color() {
    let products = await getAllProducts()
    let filteredProductById = products.filter((product) => {
        return product._id === id_pageProduct
    })
    let colourAvailableById = filteredProductById.map((productById) =>{
        return productById.colors
    })
    //console.log(colourAvailableById[0])
    let select = document.getElementById("colors")
    colors = colourAvailableById[0];
    //console.log(colors)
    
    for( let i = 0; i < colors.length ; i++){
        let option = document.createElement('option')
        color = document.createTextNode(colors[i])
        option.appendChild(color)
        option.setAttribute("value",colors[i])
        select.insertBefore(option, select.lastChild);
    }  
}
dropDrowMenu_color()

/*******************************************************/
            //Adding products to the cart

            //Add button - event listener
/*******************************************************/

// DOM access 
const addButton = document.getElementById('addToCart')

//ensures that the contents are loaded
if (document.readyState == 'loading') {
    document.addEventListener("DOMContentLoaded", ready)
} else {
    ready()
}

//shopping cart
cart = JSON.parse(localStorage.getItem("cart")) || []

//DOM content are loaded - 'Add to cart' button adds product to the shopping cart
function ready(){
    addButton.addEventListener("click", () =>{
        //DOM access quantity and color value
        let quantity = document.getElementById('quantity').value
        let color = document.getElementById('colors').value
        //if the input are corrects add product to the shopping cart
        if (color != '' && +quantity != 0 && +quantity > 0 && +quantity <= 100){
            let product = {
                "id" : id_pageProduct,
                "productColor" : color,
                "productQuantity" : +quantity,
            }
            //console.log(product)
            //if the user adds a color already present in the cart, 
            //the quantity is added to the previous one 
            const index = cart.findIndex(obj => {
                return (obj.productColor === product.productColor && obj.id === product.id)
            })
            //console.log(index)
            if (index != -1){ //found exist item
                cart[index].productQuantity = cart[index].productQuantity + product.productQuantity
            } else { // not found
                cart.push(product)
            }
            console.log(cart,'shopping cart')
            //save the shopping cart in the LocalStorage
            localStorage.setItem("cart", JSON.stringify(cart));
        }else {
            alert('Invalid input - choose the available colors and the number of items must be greater than 0 or smaller than 100')
        }
    })
}