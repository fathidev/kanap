// création d'un array cart qui va contenir les objets du localStorage
const cart = [];
// boucle qui va récupérer chaque item dans le localStorage et populer le cart
await getItemsFromLocalToCart();
// recupération des items du catalogue
const items = await getItemsFromApi();
//  pour récupérer les datas Kanap depuis l'API
async function getItemsFromApi() {
  return fetch(`http://localhost:3000/api/products/`).then((res) => res.json());
}

//  le bouton commander
const orderButton = document.querySelector("#order");
//  mise sur écoute du bouton commander
orderButton.addEventListener("click", (e) => submitForm(e));

// mettre tous les objets du local storage dans un tableau cart []
async function getItemsFromLocalToCart() {
  const numberOfItems = localStorage.length;
  for (let i = 0; i < numberOfItems; i++) {
    const item = localStorage.getItem(localStorage.key(i));
    const itemObject = JSON.parse(item);
    cart.push(itemObject);
  }
}

cart.forEach((item) => getInfosItem(item));

async function getInfosItem(item) {
  const imageUrl = getImgUrl(item.id);
  const altTxt = getAltTxt(item.id);
  const nameProduct = getNameProduct(item.id);
  const colorProduct = getColorProduct(item.id);
  const unitPrice = getUnitPrice(item.id);
  const unitQuantity = getUnitQuantity(item.id);

  const article = makeArticle(
    item,
    imageUrl,
    altTxt,
    nameProduct,
    colorProduct,
    unitPrice,
    unitQuantity
  );

  displayArticle(article);
  calcTotalArticle();
  calcTotalPrice(item);
}

function displayArticle(article) {
  document.querySelector("#cart__items").appendChild(article);
}
// fabrication de l'article
function makeArticle(
  item,
  imageUrl,
  altTxt,
  nameProduct,
  colorProduct,
  unitPrice,
  unitQuantity
) {
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.dataset.id = item.id;
  article.dataset.color = item.color;

  article.innerHTML = `
  <div class="cart__item__img">
    <img src="${imageUrl}" alt="${altTxt}">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${nameProduct}</h2>
      <p>${colorProduct}</p>
      <p>${unitPrice} €</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${unitQuantity}">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>`;
  return article;
}

function getImgUrl(id) {
  const item = cart.find((element) => element.id === id);
  return item.imageUrl;
}
function getAltTxt(id) {
  const item = cart.find((element) => element.id === id);
  return item.altTxt;
}
function getUnitQuantity(id) {
  const item = cart.find((element) => element.id === id);
  return item.quantity;
}
function getColorProduct(id) {
  const item = cart.find((element) => element.id === id);
  return item.color;
}
function getUnitPrice(id) {
  // recup prix depuis les infos renvoyées par l'API
  const item = items.find((element) => element._id === id);
  return item.price;
}
function getNameProduct(id) {
  const item = cart.find((element) => element.id === id);
  return item.name;
}

// calcul du nombre d'articles dans le panier
function calcTotalArticle() {
  let total = 0;
  cart.forEach((item) => {
    total += item.quantity;
  });
  displayTotalArticle(total);
}
// affichage du nombre d'articles dans le panier
function displayTotalArticle(total) {
  const totalQuantity = document.querySelector("#totalQuantity");
  totalQuantity.textContent = total;
}
// calcul prix total du panier
function calcTotalPrice() {
  let total = 0,
    idToSearch = "",
    priceUnit = 0;
  cart.forEach((item) => {
    idToSearch = item.id;
    priceUnit = getUnitPrice(idToSearch);
    total += item.quantity * priceUnit;
  });
  displayTotalPrice(total);
}
// affichage du prix total du panier
function displayTotalPrice(total) {
  const totalPrice = document.querySelector("#totalPrice");
  totalPrice.textContent = total;
}

//  mise à jour de la quantité de l'Item
function updateItemsQuantity(newQuantity, color, _id) {
  const itemToUpdate = cart.find(
    (item) => (item.id === _id) & (item.color === color)
  );
  console.log(itemToUpdate, newQuantity, color);
  itemToUpdate.quantity = Number(newQuantity);
  calcTotalArticle();
  calcTotalPrice();
  updateDataToLocalStorage(itemToUpdate);
}
//  mise à jour du produit dans le localstorage
function updateDataToLocalStorage(itemToUpdate) {
  const dataTosave = JSON.stringify(itemToUpdate);
  const key = `${itemToUpdate.id}-${itemToUpdate.color}`;
  localStorage.setItem(key, dataTosave);
}
// écouteur sur input quantité
document.querySelectorAll(".itemQuantity").forEach((inputQuantity) => {
  inputQuantity.addEventListener("change", (e) => {
    let quantity = parseInt(e.target.value);
    let color = e.target.closest(".cart__item").dataset.color;
    let _id = e.target.closest(".cart__item").dataset.id;
    updateItemsQuantity(quantity, color, _id);
  });
});
// écouteur sur bouton suppression
document.querySelectorAll(".deleteItem").forEach((suppressionButton) => {
  suppressionButton.addEventListener("click", (e) => {
    let color = e.target.closest(".cart__item").dataset.color;
    let _id = e.target.closest(".cart__item").dataset.id;
    console.log(`Couleur : ${color}`);
    console.log(`ID : ${_id}`);
    getIndexItemToDelete(color, _id);
  });
});

// recupération de l'index de l'item à supprimer
function getIndexItemToDelete(color, _id) {
  const indexItemToDelete = cart.findIndex(
    (product) => product.id === _id && product.colorProduct === color
  );
  console.log(indexItemToDelete);
  confirmationDeleteItem(indexItemToDelete, color, _id);
}
// boite de dialogue confirmation suppression de l'article du panier
function confirmationDeleteItem(indexItemToDelete, color, _id) {
  if (
    confirm("Êtes-vous certain de vouloir supprimer cet article du panier?")
  ) {
    //  démarre à l'index de l'objet à supprimer et 1 pour le nombre d'objet à supprimer
    cart.splice(indexItemToDelete, 1);
    deleteDataFromCache(color, _id);
    deleteArticleFromPage(color, _id);
    calcTotalArticle();
    calcTotalPrice();
  } else {
    alert("Annuler la suppression de cet article du panier.");
  }
}
// suppression item du localstorage
function deleteDataFromCache(color, _id) {
  const key = `${_id}-${color}`;
  localStorage.removeItem(key);
}
// suppression de l'article de la page
function deleteArticleFromPage(color, _id) {
  const articleToDelete = document.querySelector(
    `article[data-id="${_id}"][data-color="${color}"]`
  );
  console.log("deleting  article : ", articleToDelete);
  articleToDelete.remove();
}

// envoi du for
function submitForm(e) {
  // empêche le rafraichissement automatique de la page au clic
  e.preventDefault();
  if (
    isCartEmpty() ||
    !validEmail(form.email) ||
    !validFirstName(form.firstName) ||
    !validLastName(form.lastName) ||
    !validAdress(form.address)
  ) {
    return;
  } else {
    const body = makeRequestBody();
    const urlPostApi = "http://localhost:3000/api/products/order";
    postBodyToApi(body, urlPostApi);
    console.log(body);
  }
}

// patherns
const regexEmail = new RegExp(
  "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
);
const charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
const addressRegExp = new RegExp(
  "^[0-9]{1,5}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+"
);
console.log("local storage nombre d'items : " + localStorage.length);
function isCartEmpty() {
  console.log(localStorage.length);
  if (cart.length === 0) {
    alert(
      "Le panier est vide merci d'ajouter au moins un article. Nous vous dirigeons vers la page d'accueil"
    );
    window.location.href = "index.html";
    return true;
  } else {
    return false;
  }
}

// récupération de l'éleme,nt formulaire
let form = document.querySelector(".cart__order__form");
// écouter les modications du champs prénom
form.firstName.addEventListener("change", function () {
  console.log("modif prénom");
  validFirstName(this);
});

function validFirstName(inputFirstName) {
  let firstNameErrorMsg = inputFirstName.nextElementSibling;
  let testFirstName = charRegExp.test(inputFirstName.value);
  if (testFirstName) {
    firstNameErrorMsg.innerHTML = "";
    return true;
  } else {
    firstNameErrorMsg.innerHTML = "Prénom incorrect";
    return false;
  }
}

// écouter le champs prénom
form.lastName.addEventListener("change", function () {
  console.log("modif nom");
  validLastName(this);
});

function validLastName(inputLastName) {
  console.log(inputLastName.value);
  let lastNameErrorMsg = inputLastName.nextElementSibling;
  let testLastName = charRegExp.test(inputLastName.value);
  if (testLastName) {
    lastNameErrorMsg.innerHTML = "";
    return true;
  } else {
    lastNameErrorMsg.innerHTML = "Nom invalide";
    return false;
  }
}

// écouter le champs adresse

form.address.addEventListener("change", function () {
  console.log("modif adress");
  validAdress(this);
});

function validAdress(inputAdress) {
  let addressErrorMsg = inputAdress.nextElementSibling;
  let testAdress = addressRegExp.test(inputAdress.value);
  if (testAdress) {
    addressErrorMsg.innerHTML = "";
    return true;
  } else {
    addressErrorMsg.innerHTML = "Adresse incorrecte";
    return false;
  }
}

// écouteur sur le champs Ville
form.city.addEventListener("change", function () {
  console.log("modif city");
  validCity(this);
});

const validCity = function (inputCity) {
  console.log(inputCity.value);
  console.log(inputCity);
  let cityErrorMsg = inputCity.nextElementSibling;
  let testCity = charRegExp.test(inputCity.value);
  if (testCity) {
    cityErrorMsg.innerHTML = "";
    return true;
  } else {
    cityErrorMsg.innerHTML = "Nom de ville incorrect";
    // inputCity.style.border = "2px solid #00FF00";
    return false;
  }
};

// écouter les modications du champs email
form.email.addEventListener("change", function () {
  console.log("modif email");
  validEmail(this);
});

const validEmail = function (inputEmail) {
  console.log(inputEmail.value);
  let emailErrorMsg = inputEmail.nextElementSibling;
  let testEmail = regexEmail.test(inputEmail.value);
  if (testEmail) {
    emailErrorMsg.innerHTML = "";
    return true;
  } else {
    emailErrorMsg.innerHTML = "Adresse mail invalide";
    return false;
  }
};

// function checkFirstName() {
//   const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
//   const firstName = document.querySelector("#firstName").value;
//   firstNameErrorMsg.textContent = isFirstNameValid(firstName)
//     ? ""
//     : "Merci de renseigner un prénom valide";
//   return firstName;
// }
// function isFirstNameValid(firstName) {
//   return charRegExp.test(firstName);
// }

// make body for send to api
function makeRequestBody() {
  const form = document.querySelector(".cart__order__form");
  const firstName = form.elements.firstName.value;
  const lastName = form.elements.lastName.value;
  const address = form.elements.address.value;
  const city = form.elements.city.value;
  const email = form.elements.email.value;

  const body = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: getIdsFromcache(),
  };
  return body;
}
// recuperation of products in local storage for put in a array
function getIdsFromcache() {
  const numbOfProducts = localStorage.length;
  const products = [];

  for (let i = 0; i < numbOfProducts; i++) {
    const key = localStorage.key(i);
    const id = key.split("-")[0];
    products.push(id);
  }
  return products;
}

// post body to api
async function postBodyToApi(body, urlPostApi) {
  fetch(urlPostApi, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const orderId = data.orderId;
      redirectionConfirmationPage(orderId);
    })
    .catch((error) => console.error(error));
}

// redirection to confirmation.html
function redirectionConfirmationPage(orderId) {
  window.location.href = "confirmation.html" + "?orderId=" + orderId;
}
