/* Importation du local storage dans panier */

let dataProduct = [];




const createCard = (element) => {
  let template = `
    <article class="cart__item" data-id="{${element._id}}" data-color="{${element.option}}">
        <div class="cart__item__img">
            <img src="${element.imageUrl}" alt="${element.altTxt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${element.name}</h2>
                <p>${element.option}</p>
                <p>$${element.price}</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté :</p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${element.quantity}" data-btn="${element.index}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem" data-btn="${element.index}">Supprimer</p>
                </div>
            </div>
        </div>
    </article> 
  `;

  return template;
};

if (localStorage.getItem('panier')){
  let panier = JSON.parse(localStorage.getItem('panier'))

  for (let index = 0; index < panier.length; index++) {
    const element = panier[index];
  
    fetch(`http://localhost:3000/api/products/${element._id}`)
      .then((r) => r.json())
      .then((r) => {
        element.altTxt = r.altTxt;
        element.description = r.description;
        element.imageUrl = r.imageUrl;
        element.name = r.name;
        element.price = r.price;
  
        element.index = index;
        dataProduct.push(element);
        return element;
      })
      .then( r => {
        document.querySelector('#cart__items').insertAdjacentHTML('beforeend',createCard(r))
      })
      
  }
}else{
  panier = null
}


