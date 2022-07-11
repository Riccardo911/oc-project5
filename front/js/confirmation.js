/*********************************************************/
    //UrlSearchParams - get orderId from window url
/*********************************************************/

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const orderId_confirmationPage = urlParams.get('orderId')
//console.log(orderId_confirmationPage)


//display orderId
window.addEventListener("load", function () {
    let orderId = document.getElementById('orderId')
    orderId.innerText = orderId_confirmationPage
})