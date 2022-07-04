// methode pour récupérer l'url de recherche
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
// récupération de l'élément id
const id = urlParams.get("id")

// requète à l'api en ciblant le produit à l'aide de l'ID
fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json())
    .then((res) => recupDatas(res))

function recupDatas(canape) {
    // on récupère les données
    const altTxt = canape.altTxt
    const colors = canape.colors
    const description = canape.description
    const imageUrl = canape.imageUrl
    const name = canape.name
    const price = canape.price

    // appel des plusieurs fonctions pour renseigner la page produit
    // fabrication de l'image du produit
    makeImage(imageUrl, altTxt)
    // insertion du nom du produit dans le h1
    makeTitle(name)
    //  insertion du prix du produit dans le span
    makePrice(price)
    // insertion de la description dans le p
    makeDescription(description)
    // génération des options de couleurs
    makeColors(colors)
}
// fabrication de l'image du produit
function makeImage(imageUrl,altTxt){
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    const parent = document.querySelector(".item__img")
    if (parent != null) parent.appendChild(image)
}
// insertion du nom du produit dans le h1
function makeTitle(name){
    const h1 = document.querySelector("#title")
    if(h1 != null) {
        h1.textContent = name
    }
}
//  insertion du prix du produit dans le span
function makePrice(price) {
    const span = document.querySelector("#price")
    if(span != null){
        span.textContent = price
    }
}
// insertion de la description dans le p
function makeDescription(description) {
    const p = document.querySelector("#description")
    if (p != null) {
        p.textContent = description
    }
}
// génération des options de couleurs
function makeColors(colors){
    const select = document.querySelector("#colors")
    if(select != null){
        // boucle pour chaque couleur proposée 
        colors.forEach((color) => {
            const option = document.createElement("option")
            option.value = color
            option.textContent = color
            select.appendChild(option)
        });
    }
}

