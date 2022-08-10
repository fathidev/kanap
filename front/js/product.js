// methode pour récupérer l'url de recherche
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// récupération de l'élément id
const id = urlParams.get("id");
// pour pouvoir récupérer le prix et le stocker dans le local storage
let canapePrice = 0;
let imgUrlForStorage, altTxtForStorage, articleName;

// requète à l'api en ciblant le produit à l'aide de l'ID
fetch(`http://localhost:3000/api/products/${id}`)
  .then((res) => res.json())
  .then((res) => getDatas(res));

// on récupère les données du produit
function getDatas(canape) {
  const altTxt = canape.altTxt;
  const colors = canape.colors;
  const description = canape.description;
  const imageUrl = canape.imageUrl;
  const name = canape.name;
  const price = canape.price;
  // récupérer le prix du canapé pour le mettre dans la variable globale
  canapePrice = price;
  imgUrlForStorage = imageUrl;
  altTxtForStorage = altTxt;
  articleName = name;

  // appel des plusieurs fonctions pour renseigner la page produit
  // fabrication de l'image du produit
  makeImage(imageUrl, altTxt);
  // insertion du nom du produit dans le h1
  makeTitle(name);
  //  insertion du prix du produit dans le span
  makePrice(price);
  // insertion de la description dans le p
  makeDescription(description);
  // génération des options de couleurs
  makeColors(colors);
}

// fabrication de l'image du produit
function makeImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  const parent = document.querySelector(".item__img");
  if (parent != null) parent.appendChild(image);
}
// insertion du nom du produit dans le h1 et le title
function makeTitle(name) {
  const h1 = document.querySelector("#title");
  const title = document.querySelector("title");
  if (h1 != null && title != null) {
    h1.textContent = name;
    title.textContent = name;
  }
}
//  insertion du prix du produit dans le span
function makePrice(price) {
  const span = document.querySelector("#price");
  if (span != null) {
    span.textContent = price;
  }
}
// insertion de la description dans le p
function makeDescription(description) {
  const p = document.querySelector("#description");
  if (p != null) {
    p.textContent = description;
  }
}
// génération des options de couleurs
function makeColors(colors) {
  const select = document.querySelector("#colors");
  if (select != null) {
    // boucle pour chaque couleur proposée
    colors.forEach((color) => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      select.appendChild(option);
    });
  }
}
// écouteur sur le bouton ajouter au panier
const button = document.querySelector("#addToCart");
button.addEventListener("click", addProduct);

// vérification si le produit est déjà dans le localstorage et affectation quantité
function addProduct() {
  const color = document.querySelector("#colors").value;
  const quantity = document.querySelector("#quantity").value;

  if (!isColorAndQuantityValid(color, quantity))
    return alert("Merci de sélectionner une couleur et une quantité");

  const key = `${getProductId()}-${color}`;
  const quantityUpdated = isProductInCache(key)
    ? getNewQuantity(quantity, key)
    : quantity;

  confirmationAddItemToCart(color, quantityUpdated, key);
}

function confirmationAddItemToCart(color, quantityUpdated, key) {
  if (
    confirm(
      `En confirmant, votre panier comportera le ${articleName} - couleur : ${color} en (${quantityUpdated}) exemplaire(s) ? `
    )
  ) {
    makeDataForLocalStorage(color, quantityUpdated, key);
  } else {
    alert(
      `Annulation de l'ajout au panier de ${articleName}, nous vous dirigeons vers la page d'accueil.`
    );
    window.location.href = "index.html";
  }
}
// vérification dans le localstorage si le produit est déjà présent sur la base de la key
function isProductInCache(key) {
  return localStorage.getItem(key) != null;
}
// récupération de l'id du produit depuis la variable globale récupérée dans l'URL
function getProductId() {
  return id;
}

//  function pour vérifier si la couleur et la quantité ont bien été sélectionnées
function isColorAndQuantityValid(color, quantity) {
  return color != "" && quantity != "0";
}
// affectation de la nouvelle quantité dans le cas où le produit est déjà présent dans le localstorage
function getNewQuantity(quantity, key) {
  const existingProduct = localStorage.getItem(key);
  const product = JSON.parse(existingProduct);
  const oldQuantity = product.quantity;
  const newQuantity = Number(oldQuantity) + Number(quantity);
  return newQuantity;
}

// création d'un objet qui va contenir les infos du produit pour stockage dans le localstorage
function makeDataForLocalStorage(color, quantity, key) {
  const data = {
    id: getProductId(),
    color: color,
    // conversion de quantité de string à number pour les calculs à suivre
    quantity: Number(quantity),
    altTxt: altTxtForStorage,
    imageUrl: imgUrlForStorage,
    name: articleName,
  };
  pushProductInLocalStorage(data, key);
  redirectionToCart();
}

// déclaration d'un élément dans local storage et pousser la data
function pushProductInLocalStorage(data, key) {
  //  id c'est la clé de stockage et on fait un json des datas en string afin de les stocker dans le localstorage
  localStorage.setItem(key, JSON.stringify(data));
}

// redirige le client vers la page récap du panier
function redirectionToCart() {
  window.location.href = "cart.html";
}
