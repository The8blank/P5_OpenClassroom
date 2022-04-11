const idProduct = window.location.search.slice(4);
const url = `http://localhost:3000/api/products/${idProduct}`;
const addToCart = document.querySelector("#addToCart");
let product = {};

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

addToCart.addEventListener("click", (e) => {
  e.preventDefault();

  let option = document.querySelector("#colors").value;
  let quantity = document.querySelector("#quantity").value;

  product.option = option;
  product.quantity = quantity;
  product._id = idProduct;

  panier = JSON.parse(localStorage.getItem("panier"));

  if (panier == null && quantity > 0 && option.length > 0) {
    panier = [];
    panier.push(product);
    localStorage.setItem("panier", JSON.stringify(panier));
  } else if (panier != null && quantity > 0 && option.length > 0) {
    for (i = 0; i < panier.length; i++) {
      if (panier[i]._id == product._id && panier[i].option == product.option) {
        return (
          (panier[i].quantity =
            parseInt(product.quantity) + parseInt(panier[i].quantity)),
          console.log("quantité++"),
          localStorage.setItem("panier", JSON.stringify(panier)),
          (panier = JSON.parse(localStorage.getItem("panier")))
        );
      }
    }
    for (i = 0; i < panier.length; i++) {
      if (
        (panier[i]._id == product._id && panier[i].option != product.option) ||
        panier[i]._id != product._id
      ) {
        return (
          console.log("new"),
          panier.push(product),
          localStorage.setItem("panier", JSON.stringify(panier)),
          (panier = JSON.parse(localStorage.getItem("panier")))
        );
      }
    }
  }

  return (panier = JSON.parse(localStorage.getItem("panier")));
});
