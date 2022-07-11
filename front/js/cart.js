//URL API - get products
const api_url = 'http://localhost:3000/api/products'

//URL API - post request
const api_url_post = 'http://localhost:3000/api/products/order'

//Get all products - fetch request get
async function getAllProducts() {
    let url = api_url;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

/***********************************************/
//  Displaying a recap table of purchases 
/***********************************************/

//retrieve data from LocalStorage
getDataFromLocalStorage = () => {
    let dataFromLocalStorage = JSON.parse(localStorage.getItem("cart"))
    return dataFromLocalStorage
}

//shopping cart from LocalStorage
let cart = getDataFromLocalStorage()
console.log(cart,'cart from product page')


//render each product of the cart
let html = ''
async function renderCartRow() {
    let productsFromAPI = await getAllProducts()
    //search for missing key:values ​​of the products in the cart from the API products
    for (let i = 0; i < cart.length; i++) {
        let productAPI = productsFromAPI.filter((product) => {
            return product._id === cart[i].id
        })
        totalPricePerProduct = productAPI[0].price * cart[i].productQuantity
        //console.log(productAPI) //product of the API that coincides with the i-th one of the cart
        let htmlSegment = `
            <article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].productColor}">
                <div class="cart__item__img">
                    <img src=${productAPI[0].imageUrl} alt=${productAPI[0].altTxt}>
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${productAPI[0].name}</h2>
                        <p>${cart[i].productColor}</p>
                        <p>€ ${totalPricePerProduct}</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : ${cart[i].productQuantity} </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="0">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Delete</p>
                        </div>
                    </div>
                </div>
            </article>`
        html += htmlSegment
    }
    let item = document.getElementById('cart__items')
    item.innerHTML = html;
}
renderCartRow()


/**********************************************************/
//  delete button - remove a product from the shopping cart
/**********************************************************/
window.addEventListener("load", function() {
    //DOM 
    let cartRow = document.getElementsByClassName("cart__item")
    let deleteButton = document.getElementsByClassName("deleteItem")
    for (let i = 0; i < deleteButton.length; i++) {
        let button = deleteButton[i]
        //retrieve data from dataset of product
        let data_id = cartRow[i].dataset.id
        let data_color = cartRow[i].dataset.color
        //delete button event listener
        button.addEventListener('click', function (event) {
            event.preventDefault()
            const index_dataSet = cart.findIndex(obj => {
                return (obj.id === data_id && obj.productColor === data_color)
            })
            cart.splice(index_dataSet, 1) //remove product from shopping cart
            localStorage.setItem('cart', JSON.stringify(cart)) //overwrites localStorage
            console.log(cart, 'cart after product deleted')
            let buttonClicked = event.target
            buttonClicked.parentElement.parentElement.parentElement.parentElement.remove() //remove product from rendered html
            updateTotal()
            totalArticles()
        })
    }
})

/******************************************/
//  change quantity
/******************************************/
window.addEventListener("load", function() {
    //DOM
    let cartRow = document.getElementsByClassName("cart__item")
    let changeQuantityInput = document.getElementsByClassName('itemQuantity')
    let contentDescriptionPrice = document.getElementsByClassName('cart__item__content__description')
    let contentSettingsQuantity = document.getElementsByClassName('cart__item__content__settings__quantity')
    //select every quantity input
    for (let i = 0; i < changeQuantityInput.length; i++) {
        let changeInput = changeQuantityInput[i] //input that the user wants to change
        //retrieve data from dataset of product
        let data_id = cartRow[i].dataset.id
        let data_color = cartRow[i].dataset.color
        //////////////////////////////////////////////////////////
        //change quantity input event listener - increase/decrease
        let previous_value = 0
        changeInput.addEventListener('change', function () {
            if (changeInput.value > previous_value){    //increase
                add = 1
            } else {                                    //decrease
                add = -1
            }
            previous_value = changeInput.value
        /////////////////////////////////////////////////////////
            const index_dataSet = cart.findIndex(obj => {
                return (obj.id === data_id && obj.productColor === data_color)
            })
            ////////////////////////////////////////
            //price for sigle product
            let priceBeforeUpdate = parseInt(contentDescriptionPrice[index_dataSet].lastElementChild.innerText.replace('€', ''))
            let pricePerProduct = priceBeforeUpdate / cart[index_dataSet].productQuantity
            ////////////////////////////////////////
            //quantity
            cart[index_dataSet].productQuantity = parseInt(cart[index_dataSet].productQuantity + +add)
            console.log(cart[index_dataSet].productQuantity, ' quantity changed')
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log(cart)
            contentSettingsQuantity[index_dataSet].firstElementChild.innerText = 'Qté : ' + cart[index_dataSet].productQuantity
            ////////////////////////////////////////
            //price per product after quantity changes
            let priceAfterUpdate = pricePerProduct * cart[index_dataSet].productQuantity
            console.log(priceAfterUpdate, ' price after change')
            contentDescriptionPrice[index_dataSet].lastElementChild.innerText = '€ ' + priceAfterUpdate
            ////////////////////////////////////////
            //update total
            updateTotal()
            totalArticles()
        })
    }
})


/******************************************/
//  total 
/******************************************/
//sum of the prices of all products
async function updateTotal() {
    let productsFromAPI = await getAllProducts()
    //console.log(productsFromAPI)
    let counter = []
    for (let i = 0; i < cart.length; i++) {
        let productAPI = productsFromAPI.filter((product) => {
            return product._id === cart[i].id
        })
        //console.log(productAPI)
        totalPricePerProduct = parseInt(productAPI[0].price * cart[i].productQuantity)
        counter.push(totalPricePerProduct)
    }
    //console.log(counter)
    let total = 0
    for (let i = 0; i < counter.length; i++) {
        total += counter[i]
    }
    console.log(total, 'new total')
    totalPrice.innerText = ' ' + total
}
updateTotal()

/********************************************/
//          confirming the order
/********************************************/

//definition of characters allowed in the form
let letters = /^[a-z ,.'-]+$/i
let numbers = /[0-9]/g
let specialNotAllowed = /^[0-9A-Za-z\s\-]+$/
let cityPattern = /^[a-zA-Z',.\s-]{1,25}$/
let email = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

//DOM
let orderButton = document.getElementById('order')
let firstNameErrorMsg = document.getElementById('firstNameErrorMsg')
let lastNameErrorMsg = document.getElementById('lastNameErrorMsg')

//event listener 'commander!'
//acquires the form data and validates them and then if all data is valid post request
orderButton.addEventListener('click', function(event) {
    event.preventDefault()
    //first name
    let firstNameInput = document.getElementById('firstName')
    //first name form validation
    let isNameValid = letters.test(firstNameInput.value)
    if (isNameValid && firstNameInput.value != '') {
        firstNameErrorMsg.innerText = 'Valid'
    } else {
        firstNameErrorMsg.innerText = 'Invalid first name'
    }
    //last name
    let lastNameInput = document.getElementById('lastName')
    //last name form validation
    let isLastNameValid = letters.test(lastNameInput.value)
    if (isLastNameValid && lastNameInput.value != '') {
        lastNameErrorMsg.innerText = 'Valid'
    } else {
        lastNameErrorMsg.innerText = 'Invalid last name'
    }
    //address
    let addressInput = document.getElementById('address')
    //address form validation
    let isAddressValid = specialNotAllowed.test(addressInput.value)
    if (isAddressValid && addressInput.value != '') {
        addressErrorMsg.innerText = 'Valid'
    } else {
        addressErrorMsg.innerText = 'Invalid address'
    }
    //city
    let cityInput = document.getElementById('city')
    //city form validation
    let isCityValid = cityPattern.test(cityInput.value)
    if (isCityValid && cityInput.value != '') {
        cityErrorMsg.innerText = 'Valid'
    } else {
        cityErrorMsg.innerText = 'Invalid city'
    }
    //email
    let emailInput = document.getElementById('email')
    //email form validation
    let isEmailValid = email.test(emailInput.value)
    if (isEmailValid && emailInput.value != '') {
        emailErrorMsg.innerText = 'Valid'
    } else {
        emailErrorMsg.innerText = 'Invalid email'
    }
    //if data is valid define product table (array products id) and do post request with contact object
    if (isNameValid && isLastNameValid && isAddressValid && isCityValid && isEmailValid){

        //product table
        let productTable = cart.map((product) => {
            return product.id
        })
        console.log(productTable, 'product table _id')
        /********************************************/
        //               POST request
        /********************************************/
        async function order(){
            const response = await fetch(api_url_post, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contact : {
                        firstName: firstNameInput.value,
                        lastName: lastNameInput.value,
                        address: addressInput.value,
                        city: cityInput.value,
                        email: emailInput.value
                    },
                    products : productTable
                })
            })
        const post = await response.json()
        //console.log(post, 'post request')
        
        //redirection to confirmation page
        url_confirmation = 'confirmation.html' + '?orderId=' + post.orderId
        window.location.href = url_confirmation 
        }
        order()
    }
})

/********************************/
//      total articles
/*******************************/
//sum of the number of products in the cart
function totalArticles() {
    let totalArticles = cart.map((product) => {
        return product.productQuantity
    })
    //console.log(totalArticles)
    let total = 0
    for (let i = 0; i < totalArticles.length; i++) {
        total += totalArticles[i]
    }
    //console.log(total, 'total articles')
    totalQuantity.innerText = total
}
totalArticles()