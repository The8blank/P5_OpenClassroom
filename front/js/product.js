const idProduct = window.location.search.slice(4);
const url = `http://localhost:3000/api/products/${idProduct}`;
const addToCart = document.querySelector('#addToCart')
let product = {};
let panier = JSON.parse(localStorage.getItem('panier'))

/* template pour l'injection html */
let createElement = (element) => {
  let img = `<img src="${element.imageUrl}" alt="${element.altTxt}">`;
  let nomProduit = element.name;
  let price = element.price;
  let description = element.description;
  let colors = element.colors;

  document.querySelector("div.item__img").innerHTML = img;
  document.querySelector("#title").innerHTML = nomProduit;
  document.querySelector("#price").innerHTML = price;
  document.querySelector("#description").innerHTML = description;

  for (let color of colors) {
    document
      .querySelector("#colors")
      .insertAdjacentHTML(
        "beforeend",
        `<option value="${color}">${color}</option>`
      );
  }
};

/* demande de produit pour la creation des cards en page index */
fetch(url)
  .then((r) => r.json())
  .then((r) => {
    /* injection du javascript dans le code html */
    createElement(r);
  });

addToCart.addEventListener('click', (e) => {
  e.preventDefault();

  let option = document.querySelector('#colors').value;
  let quantity = document.querySelector('#quantity').value

  product.option = option
  product.quantity = quantity 
  product._id = idProduct


  if(localStorage.getItem('panier')){
    panier.push(product)
    localStorage.setItem('panier', JSON.stringify(panier))
  }else{
    panier = [];
    panier.push(product)
    localStorage.setItem('panier', JSON.stringify(panier))
  }

})
