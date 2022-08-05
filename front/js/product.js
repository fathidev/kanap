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
  .then((res) => recupDatas(res));

function recupDatas(canape) {
  // on récupère les données
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
// insertion du nom du produit dans le h1
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
button.addEventListener("click", onClickRecup);

function onClickRecup() {
  // récupère la couleur et la quantité
  const color = document.querySelector("#colors").value;
  const quantity = document.querySelector("#quantity").value;
  // si la function renvoie true parce que le panier est invalid on sort
  if (isOrderInvalid(color, quantity))
    return alert("Merci de sélectionner une couleur et une quantité");
  //  sinon on passe à la fonction saveCart la couleur et la quantité sélectionnée
  saveOrder(color, quantity);
  // tout se passe bien on redirige le client vers la page récap du panier
  redirectionToCart();
}

//  function pour vérifier si la commande est invalide
function isOrderInvalid(color, quantity) {
  return color == "" || quantity == "0";
}

function saveOrder(color, quantity) {
  // création d'un objet qui va contenir les infos de la commande
  const key = `${id}-${color}`;
  const data = {
    id: id,
    color: color,
    // conversion de quantité de string à number pour les calculs à suivre
    quantity: Number(quantity),
    // // prix récupéré depuis la variable globale
    // price: canapePrice,
    // alTxt récupéré depuis la variable globale
    altTxt: altTxtForStorage,
    // imageUrl récupéré depuis la variable globale
    imageUrl: imgUrlForStorage,
    // nom du produit
    name: articleName,
  };
  // déclaration d'un local storage
  //  id c'est la clé de stockage et on fait un json des datas en string afin de les stocker dans le localstorage
  localStorage.setItem(key, JSON.stringify(data));
  console.log({ key, data: JSON.stringify(data) });
}

// redirige le client vers la page récap du panier
function redirectionToCart() {
  window.location.href = "cart.html";
}
