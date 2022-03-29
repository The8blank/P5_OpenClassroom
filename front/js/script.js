let url = "http://localhost:3000/api/products";
let arrayProduct = [];

/* fonction de creation de card  */
const createCard = (item) => {
  let template = ` 
    <a href="./product.html?id=${item._id}">
        <article>
            <img src="${item.imageUrl}" alt="${item.altTxt}">
            <h3 class="productName">${item.name}</h3>
            <p class="productDescription"> ${item.description} </p>
        </article>
    </a>`;

  return template;
};

/* demande de produit pour la creation des cards en page index */
fetch(url)
  .then((r) => r.json())
  .then((r) => {
    for (let product of r) {
      arrayProduct.push(product);
      document
        .querySelector("#items")
        .insertAdjacentHTML("beforeend", createCard(product));
    }
    console.log(r);
  })
  .catch((r) => {
    console.log("erreur : " + r);
  });
