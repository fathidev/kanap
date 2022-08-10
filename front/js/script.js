getDatasFromApi();

// récupérer les données de l'api fournie
async function getDatasFromApi() {
  fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((datas) => {
      return getInfosForElements(datas);
    });
}
// récupération des infos pour les élements de la page
async function getInfosForElements(datas) {
  // boucle for sur l'ensemble des datas
  for (let i = 0; i < datas.length; i++) {
    // on récupère les donnnées de l'api
    const _id = datas[i]._id;
    const imageUrl = datas[i].imageUrl;
    const altTxt = datas[i].altTxt;
    const name = datas[i].name;
    const description = datas[i].description;
    makeElementsOfArticle(_id, imageUrl, altTxt, name, description);
  }
}
// fabrication des différents éléments
function makeElementsOfArticle(_id, imageUrl, altTxt, name, description) {
  const anchor = makeAnchor(_id);
  const article = makeArticle();
  const image = makeImage(imageUrl, altTxt);
  const h3 = makeH3(name);
  const p = makeParagraph(description);

  appendArticleToAnchor(anchor, article);
  appendElementToArticle(article, [image, h3, p]);
}

// fabrication d'un article vide
function makeArticle() {
  return document.createElement("article");
}

// fabrication du lien ancre qui engloble l'article et mène sur la page produit du canapé
function makeAnchor(_id) {
  const anchor = document.createElement("a");
  anchor.href = "./product.html?id=" + _id;
  return anchor;
}

// ajout de l'article dans le anchor
function appendArticleToAnchor(anchor, article) {
  // récupération de la section #items
  const items = document.querySelector("#items");
  // vérification de la présence de la section #items
  if (items != null) {
    // ajout du anchor dans la section #items
    items.appendChild(anchor);
    // ajout de l'article dans anchor
    anchor.appendChild(article);
  }
}

// ajout des éléments dans l'article avec une  boucle for each
function appendElementToArticle(article, array) {
  array.forEach((element) => {
    article.appendChild(element);
  });
}

// fabrication de l'image avec son URL et son texte alternatif
function makeImage(imageUrl, altTxt) {
  const img = document.createElement("img");
  img.src = imageUrl;
  img.altTxt = altTxt;
  return img;
}

// fabrication de la balise H3 contenant le nom du canapé
function makeH3(name) {
  // création du h3
  const h3 = document.createElement("h3");
  // ajout du contenu à la balise
  h3.textContent = name;
  // ajout de la classe à la balise
  h3.classList.add("productName");
  return h3;
}

// fabrication de la balise P contenant la description du produit
function makeParagraph(description) {
  // création du p
  const p = document.createElement("p");
  // ajout du contenu à la balise
  p.textContent = description;
  // ajout de la classe à la balise
  p.classList = "productDescription";
  return p;
}
