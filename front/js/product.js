let url = "http://localhost:3000/api/products";
let arrayProduct = [];

let createElement = (element) => {
    let img = `<img src="${element.imageUrl}" alt="${element.altTxt}">`;
    let nomProduit = element.name;
    let price = element.price;
    let description = element.description;
    let colors = element.colors;

    document.querySelector('div.item__img').innerHTML = img;
    document.querySelector('#title').innerHTML = nomProduit;
    document.querySelector('#price').innerHTML = price;
    document.querySelector('#description').innerHTML = description;

    for (let color of colors){
        document.querySelector('#colors').insertAdjacentHTML('beforeend',`<option value="">${color}</option>`)
    }
    
}

/* demande de produit pour la creation des cards en page index */
fetch(url)
  .then((r) => r.json())
  .then((r) => {
    for (let product of r) {
      arrayProduct.push(product);

      if (product._id == window.location.search.slice(4)){
          createElement(product)
      }
    }
  })



