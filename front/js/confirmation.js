const orderId = getOrderId();
displayOrderId(orderId);
removeItemsLocalStorage();

// methode pour récupérer l'id dans l'url
function getOrderId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  // récupération de l'élément orderId
  return urlParams.get("orderId");
}

//  affichage du orderId dans la page de confirmation
function displayOrderId(orderId) {
  const orderIdElement = document.getElementById("orderId");
  orderIdElement.textContent = orderId;
}

// purge du local storage
function removeItemsLocalStorage() {
  const localStorage = window.localStorage;
  localStorage.clear();
}
