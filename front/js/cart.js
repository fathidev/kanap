// création d'un array cart qui va contenir les objets du localStorage
const cart = [];
// boucle qui va récupérer chaque item dans le localStorage et populer le cart
await getItemsFromLocalToCart();
// recupération des items du catalogue
const items = await getItemsFromApi();
//  ******************************************
//  pour récupérer les datas Kanap depuis l'API
async function getItemsFromApi() {
  return fetch(`http://localhost:3000/api/products/`).then((res) => res.json());
}
// ******************************************
//  le bouton commander
const orderButton = document.querySelector("#order");
//  mise sur écoute du bouton commander
orderButton.addEventListener("click", (e) => submitForm(e));

document.querySelectorAll(".itemQuantity").forEach((quantityButton) => {
  quantityButton.addEventListener("change", (e) => {
    let quantity = parseInt(e.target.value);
    let color = e.target.closest(".cart__item").dataset.color;
    let _id = e.target.closest(".cart__item").dataset.id;
    console.log(`Quantité : ${quantity}`);
    console.log(`Couleur : ${color}`);
    console.log(`ID : ${_id}`);
  });
});

// mettre tous les objets du local storage dans un tableau cart []
async function getItemsFromLocalToCart() {
  const numberOfItems = localStorage.length;
  for (let i = 0; i < numberOfItems; i++) {
    const item = localStorage.getItem(localStorage.key(i));
    // console.log("l'objet à la position ", i, "est: ", item);
    const itemObject = JSON.parse(item);
    cart.push(itemObject);
  }
}

cart.forEach((item) => displayItem(item));

async function displayItem(item) {
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
  calcTotalPrice();
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
  </div>
`;
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

// mise en écoute des input avec les quantités
document.querySelectorAll(".itemQuantity").forEach((quantityButton) => {
  quantityButton.addEventListener("change", (e) => {
    let quantity = parseInt(e.target.value);
    let color = e.target.closest(".cart__item").dataset.color;
    let _id = e.target.closest(".cart__item").dataset.id;
    console.log(`Quantité : ${quantity}`);
    console.log(`Couleur : ${color}`);
    console.log(`ID : ${_id}`);
  });
});

// ***************************************************

function addDeleteToSettings(settings, item) {
  const div = document.createElement("div");
  div.classList.add("cart__item__content__settings__delete");
  div.addEventListener("click", () => deleteItem(item));

  const p = document.createElement("p");
  p.textContent = "Supprimer";
  div.appendChild(p);
  settings.appendChild(div);
}

function deleteItem(item) {
  // partie local storage
  const itemToDelete = cart.findIndex(
    (product) =>
      product.id === item.id && product.colorProduct === item.colorProduct
  );
  console.log(itemToDelete);
  //  démarre à l'index de l'objet à supprimer et 1 pour le nombre d'objet à supprimer
  cart.splice(itemToDelete, 1);
  console.log(cart);

  displayItemPrice();
  updateTotal();
  deleteDataFromCache(item);
  deleteArticleFromPage(item);
}

function deleteArticleFromPage(item) {
  const articleToDelete = document.querySelector(
    `article[data-id="${item.id}"][data-colorProduct="${item.colorProduct}"]`
  );
  console.log("deleting  article", articleToDelete);
  articleToDelete.remove();
}

function addQuantityToSettings(settings, item) {
  const quantity = document.createElement("div");
  quantity.classList.add("cart__item__content__settings__quantity");
  const p = document.createElement("p");
  p.textContent = "Qté : ";
  quantity.appendChild(p);
  const input = document.createElement("input");
  input.type = "number";
  input.classList.add("itemQuantity");
  input.name = "itemQuantity";
  input.min = "1";
  input.max = "100";
  input.value = item.quantity;
  input.addEventListener("input", () =>
    updatePriceAndQuantity(item.id, input.value, item)
  );

  quantity.appendChild(input);
  settings.appendChild(quantity);
}

function updatePriceAndQuantity(id, newValue, item) {
  const itemToUpdate = cart.find((item) => item.id === id);
  itemToUpdate.quantity = Number(newValue);
  item.quantity = itemToUpdate.quantity;
  updateTotal();
  displayItemPrice();
  saveDataToLocalStorage(item);
}

function deleteDataFromCache(item) {
  const key = `${item.id}-${item.colorProduct}`;
  localStorage.removeItem(key);
}

function saveDataToLocalStorage(item) {
  const dataTosave = JSON.stringify(item);
  const key = `${item.id}-${item.colorProduct}`;
  localStorage.setItem(key, dataTosave);
}

function submitForm(e) {
  // empêche le rafraichissement automatique de la page au clic
  e.preventDefault();
  if (isCartEmpty()) return;
  if (isFormInvalid()) return;
  const firstName = checkFirstName();
  if (!isFirstNameValid(firstName)) return;
  const lastName = checkLastName();
  if (!isLastNameValid(lastName)) return;
  const address = checkAddress();
  if (!isAdressValid(address)) return;
  const city = checkCity();
  if (!isCityValid(city)) return;
  const email = checkEmail();
  if (!isEmailValid(email)) return;

  const body = makeRequestBody();
  const urlPostApi = "http://localhost:3000/api/products/order";
  postBodyToApi(body, urlPostApi);
}

//  verification is form fields is empty
function isCartEmpty() {
  if (cart.length === 0)
    return alert("Votre panier est vide, merci d'ajouter au moins un produit");
}

// verification if form is invalid
function isFormInvalid() {
  const form = document.querySelector(".cart__order__form");
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.value === "") {
      alert("Merci de remplir tous les champs du formulaire");
      return true;
    } else {
      return false;
    }
  });
}

// patherns
const regexEmail = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,}");
const charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
const addressRegExp = new RegExp(
  "^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+"
);

//  verification firstName
function checkFirstName() {
  const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
  const firstName = document.querySelector("#firstName").value;
  if (isFirstNameValid(firstName)) {
    firstNameErrorMsg.textContent = "";
  } else {
    firstName.textContent = "Merci de renseigner un nom valide";
  }
  return firstName;
}
function isFirstNameValid(firstName) {
  return charRegExp.test(firstName);
}
// verification lastName
function checkLastName() {
  const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
  const lastName = document.querySelector("#lastName").value;
  if (isLastNameValid(lastName)) {
    lastNameErrorMsg.textContent = "";
  } else {
    lastNameErrorMsg.textContent = "Merci de renseigner un nom valide";
  }
  return lastName;
}

function isLastNameValid(lastName) {
  return charRegExp.test(lastName);
}

// vérification address
function checkAddress() {
  const addressErrorMsg = document.querySelector("#addressErrorMsg");
  const address = document.querySelector("#address").value;
  if (isAdressValid(address)) {
    addressErrorMsg.textContent = "";
  } else {
    addressErrorMsg.textContent = "Merci de saisir une adresse conforme";
  }
  return address;
}

function isAdressValid(address) {
  return addressRegExp.test(address);
}

//  verification city
function checkCity() {
  const cityErrorMsg = document.querySelector("#cityErrorMsg");
  const city = document.querySelector("#city").value;
  if (isCityValid(city)) {
    cityErrorMsg.textContent = "";
  } else {
    cityErrorMsg.textContent = "Merci de saisir un nom de ville conforme";
  }
  return city;
}
function isCityValid(city) {
  return charRegExp.test(city);
}

//  verification email
function checkEmail() {
  const emailErrorMsg = document.querySelector("#emailErrorMsg");
  const email = document.querySelector("#email").value;
  if (isEmailValid(email)) {
    emailErrorMsg.textContent = "";
  } else {
    emailErrorMsg.textContent = "Merci de saisir un email conforme";
  }
  return email;
}
function isEmailValid(email) {
  return regexEmail.test(email);
}
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

// send body to api
function postBodyToApi(body, urlPostApi) {
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

// redirection to confirmation page
function redirectionConfirmationPage(orderId) {
  window.location.href = "confirmation.html" + "?orderId=" + orderId;
}