
/* Importation du local storage dans panier */
let panier = JSON.parse(localStorage.getItem("panier"));

/* déclaration du numéro d'indexation des produit du panier */
index = 0

/* Indexation des produit */
for (article of panier ){
  article.index = index;
  index = index + 1 ;

  console.log(panier)
}


/* fonction qui renvoie le code HTMl en fonction de l'objet */
const createCard = (element,option,quantity,index) => {
  let template = `
    <article class="cart__item" data-id="{${element._id}}" data-color="{${option}}">
        <div class="cart__item__img">
            <img src="${element.imageUrl}" alt="${element.altTxt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${element.name}</h2>
                <p>${option}</p>
                <p>$${element.price}</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté :</p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}" data-btn="${index}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem" data-btn="${index}">Supprimer</p>
                </div>
            </div>
        </div>
  </article> `;

  return template;
};

/* boucle creation des articles dans le panier */
for (article of panier) {

  /* declaration de l'emplacement ou injecter le code HTML */
  const card = document.querySelector("#cart__items");

  /* url de l'api avec l'id du produit en parametre */
  const url = `http://localhost:3000/api/products/${article._id}`;

  /* declaration des variable option et quantité et l'index indiquer dans le panier */
  let option = article.option;
  let quantity = article.quantity
  let i = article.index
  console.log(i);

  /* demande des information du produit à l'api */
  fetch(url)
    .then((r) => r.json())
    .then((r) => {
      /* injection du javascript dans le code html */
      card.insertAdjacentHTML('beforeend',createCard(r,option,quantity,i))
    });
  }
  






