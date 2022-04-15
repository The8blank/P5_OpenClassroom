/* 1. défini la variable paniner avec la valeur du local storage qui porte la key panier */
let panier = JSON.parse(localStorage.getItem("panier"));

/* 2. création du tableau data product vide */
let dataProduct = [];

async function getData() {
  /* 5. si il y a un panier  */
  if (panier) {
    /* 6 boucle sur les éléments du panier */
    for (let i = 0; i < panier.length; i++) {
      let element = panier[i];

      // 7. execute une requête de façon asynchrone et ATTEND le résultat (await)
      const response = await fetch(
        `http://localhost:3000/api/products/${element._id}`
      );

      // 8. lit le contenu JSON dans le corps de la réponse
      const responseJSON = await response.json();

      // 9.

      // 10. Ajout des valeurs de la réponse et du panier dans l"objet grace a l'operateur spread
      element = { ...responseJSON, ...panier[i] };

      // 11. pousse une nouvelle donnée dans dataProduct avant de sortir de la fonction getData
      dataProduct.push(element);
    }
  } else {
  /* 5. si il n'y a pas de panier */
    /* 6. log panier vide */
    return console.log("panier vide");
  }
}

async function createCard() {
  /* 4. joue et attend la fin de la fonction getData */
  await getData();

  // 12. crée un nouveau tableau grâce à la méthode map et inject l'HTML
  cart__items.innerHTML = dataProduct.map(
    (
      element
    ) => `<article class="cart__item" data-id="${element._id}" data-color="${element.option}">
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
               <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${element.quantity}" data-id="${element._id}" data-color="${element.option}">
           </div>
           <div class="cart__item__content__settings__delete">
               <p class="deleteItem" data-id="${element._id}" data-color="${element.option}">Supprimer</p>
           </div>
       </div>
   </div>
</article> `
  );

  // 13. Appel la fonction changeQuantity
  changeQuantity();

  // 26. appel la fonction price
  price();

  // 36. appel la fonction supprimer
  supprimer();
}

function changeQuantity() {
  // 14. définit un tableau sur les input de la quantité
  input = document.querySelectorAll(`input[name='itemQuantity']`);

  // 15. boucle qui parcour le tableau
  for (let i = 0; i < input.length; i++) {
    // 16. définit la constante éléments comme input
    const element = input[i];

    // 17. écoute le changement de valeur
    element.addEventListener("change", (e) => {
      // 18. si la valeur est supérieur à 0 alors :
      if (element.value > 0) {
        // 19. la valeur de l'input est affecter à la quanité du produit
        for (const article of dataProduct) {
          if (
            e.srcElement.dataset.id == article._id &&
            e.srcElement.dataset.color == article.option
          ) {
            article.quantity = element.value;
          }
        }

        return (
          // 20. retourne le tableau dataProduct
          dataProduct,
          // 21. retourne le tableau panier
          panier,
          // 22. appel la fonction price pour recalculer les prix
          price(),
          // 23. changement de la valeur dans le code html
          element.setAttribute("value", dataProduct[i].quantity),
          // 24. modifie le panier
          (panier[i].quantity = dataProduct[i].quantity),
          //25. envoie le nouveau panier dans le locale storage
          localStorage.setItem("panier", JSON.stringify(panier))
        );
      }
    });
  }
}

function price() {
  // 27. crée le tableau quantityTotal qui contient la valeur 0 par défaut
  quantityTotal = [0];

  // 28. crée le tableau priceTotal qui contient la valeur 0 par défaut
  priceTotal = [0];

  // 29. parcour le tableau dataProduct
  dataProduct.forEach((element) => {
    // 30. envoie les quantité des élément dans le tableau quantityTotal
    quantityTotal.push(element.quantity);

    // 31. envoie le prix des éléments multiplié par leurs quantité dans le tableau priceTotal
    priceTotal.push(element.quantity * parseInt(element.price));
  });

  // 32. additione les éléments du tableau quantityTotal grâce à la méthode éval()
  quantityTotal = eval(quantityTotal.join("+"));

  //33. additione les éléments du tableau priceTotal grâce à la méthode eval()
  priceTotal = eval(priceTotal.join("+"));

  // 34. inject la quantité total dans le code HTML
  totalQuantity.innerText = quantityTotal;

  // 35. inject le prix dans le code HTML
  totalPrice.innerText = priceTotal;
}

function supprimer() {
  // 37. crée le tableau btnSup
  let btnSup = document.querySelectorAll("p.deleteItem");

  // 38. parcour le tableau btnSup
  for (const btn of btnSup) {
    // 38. écoute les bouton supprimé sur l'evenement du click
    btn.addEventListener("click", (e) => {
      // 39. si il ne reste que 1 article dans le panier alors :
      if (panier.length == 1) {
        // 40. suprime l'élément html
        document.querySelector("article.cart__item").remove();

        // 41. reinitialise les tableau et supprime le local storage et reactualise les prix
        return (
          localStorage.removeItem("panier"),
          (panier = []),
          (dataProduct = []),
          price()
        );
      }
      // 39. si il y a plus d'un article dans le panier
      if (panier.length > 1) {
        article = document.querySelectorAll("article.cart__item");

        for (const element of article) {
          if (
            btn.dataset.id == element.dataset.id &&
            btn.dataset.color == element.dataset.color
          ) {
            element.remove();
          }
        }

        panier = panier.filter((element) => {
          if (
            btn.dataset.id == element._id &&
            btn.dataset.color == element.option
          ) {
            return false;
          } else {
            return true;
          }
        });

        dataProduct = dataProduct.filter((element) => {
          if (
            btn.dataset.id == element._id &&
            btn.dataset.color == element.option
          ) {
            return false;
          } else {
            return true;
          }
        });

        return price(), localStorage.setItem("panier", JSON.stringify(panier));
      }
    });
  }
}

/* 3. joue la fonction create card */
createCard();
