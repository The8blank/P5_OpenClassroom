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

      // 9. Ajout des valeurs de la réponse et du panier dans l"objet grace a l'operateur spread
      element = { ...responseJSON, ...panier[i] };

      // 10. pousse une nouvelle donnée dans dataProduct avant de sortir de la fonction getData
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

  // 11. crée un nouveau tableau grâce à la méthode map et inject l'HTML
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

  // 12. Appel la fonction changeQuantity
  changeQuantity();

  // 23. appel la fonction price
  price();

  // 33. appel la fonction supprimer
  supprimer();
}

function changeQuantity() {
  // 13. définit un tableau sur les input de la quantité
  input = document.querySelectorAll(`input[name='itemQuantity']`);

  // 14. boucle qui parcour le tableau
  for (const btn of input) {
    // 15. Ecoute le changement de valeur sur l'input
    btn.addEventListener("change", (e) => {
      //16. si la valeur de l'input est > 0
      if (btn.value > 0) {
        // 17. modifie la valeur dans le code html par la valuer de l'input
        btn.setAttribute("value", btn.value);

        // 18. cherche l'aricle dans le panier 
        for (const article of panier) {
          if (
            btn.dataset.id == article._id &&
            btn.dataset.color == article.option
          ) {
            // 19. lui affecte la valeur de l'input
            article.quantity = btn.value;
          }
        }
        // 19. cherche l'article dans dataproduct 
        for (const article of dataProduct) {
          if (
            btn.dataset.id == article._id &&
            btn.dataset.color == article.option
          ) {
            // 20. lui affecte la valeur de l'input
            article.quantity = btn.value;
          }
        }
        // 21. envoie le nouveau panier dans le localStorage
        localStorage.setItem("panier", JSON.stringify(panier));
        // 22. actualise les prix
        return price();
      }
    });
  }
}

function price() {
  // 24. crée le tableau quantityTotal qui contient la valeur 0 par défaut
  quantityTotal = [0];

  // 25. crée le tableau priceTotal qui contient la valeur 0 par défaut
  priceTotal = [0];

  // 26. parcour le tableau dataProduct
  dataProduct.forEach((element) => {
    // 27. envoie les quantité des élément dans le tableau quantityTotal
    quantityTotal.push(element.quantity);

    // 28. envoie le prix des éléments multiplié par leurs quantité dans le tableau priceTotal
    priceTotal.push(element.quantity * parseInt(element.price));
  });

  // 29. additione les éléments du tableau quantityTotal grâce à la méthode éval()
  quantityTotal = eval(quantityTotal.join("+"));

  //30. additione les éléments du tableau priceTotal grâce à la méthode eval()
  priceTotal = eval(priceTotal.join("+"));

  // 31. inject la quantité total dans le code HTML
  totalQuantity.innerText = quantityTotal;

  // 32. inject le prix dans le code HTML
  totalPrice.innerText = priceTotal;
}

function supprimer() {
  // 34. crée le tableau btnSup
  let btnSup = document.querySelectorAll("p.deleteItem");

  // 35. parcour le tableau btnSup
  for (const btn of btnSup) {
    // 36. écoute les bouton supprimé sur l'evenement du click
    btn.addEventListener("click", (e) => {
      // 37. si il ne reste que 1 article dans le panier alors :
      if (panier.length == 1) {
        // 38. suprime l'élément html
        document.querySelector("article.cart__item").remove();

        // 39. reinitialise les tableau et supprime le local storage et reactualise les prix
        return (
          localStorage.removeItem("panier"),
          (panier = []),
          (dataProduct = []),
          price()
        );
      }
      // 37. si il y a plus d'un article dans le panier
      if (panier.length > 1) {
        // 38 . crée un tableau avec les articles
        article = document.querySelectorAll("article.cart__item");

        // 39 suprime le code htm de l'article séléctioné
        for (const element of article) {
          if (
            btn.dataset.id == element.dataset.id &&
            btn.dataset.color == element.dataset.color
          ) {
            element.remove();
          }
        }
        // 40. supprime l'élément du tableau panier
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
        // 41. supprime l'élément du tableau dataProduct
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
        // 42. retourne les prix actualisé et le panier
        return price(), localStorage.setItem("panier", JSON.stringify(panier));
      }
    });
  }
}

async function checkOut() {

  // 44. Validation prénom
  const validFirstName = function (input) {
    let testName = /^[a-zA-Z ,.'-]+$/.test(input);

    if (testName) {
      firstNameErrorMsg.innerText = "";
      return true;
    } else {
      firstNameErrorMsg.innerText = "Prénom incorect";
      return false;
    }
  };

  firstName.addEventListener("change", function () {
    validFirstName(this.value);
  });

  // 45. validation nom
  const validLastName = function (input) {
    let testName = /^[a-zA-Z ,.'-]+$/.test(input);

    if (testName) {
      lastNameErrorMsg.innerText = "";
      return true;
    } else {
      lastNameErrorMsg.innerText = "Nom incorect";
      return false;
    }
  };

  lastName.addEventListener("change", function () {
    validLastName(this.value);
  });

  // 46. validation adresse
  const validAdresse = function (input) {
    let testAdresse =
      /^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/.test(input);

    if (testAdresse) {
      addressErrorMsg.innerText = "";
      return true;
    } else {
      addressErrorMsg.innerText = "adresse incorect";
      return false;
    }
  };

  address.addEventListener("change", function () {
    validAdresse(this.value);
  });

  // 47. Validation ville
  const validCountry = function (input) {
    let testCity = /^[a-zA-Z ,.'-]+$/.test(input);

    if (testCity) {
      cityErrorMsg.innerText = "";
      return true;
    } else {
      cityErrorMsg.innerText = "Ville incorect";
      return false;
    }
  };

  city.addEventListener("change", function () {
    validCountry(this.value);
  });

  // 48. Validation email
  const validEmail = function (input) {
    let testEmail =
      /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/.test(input);

    if (testEmail) {
      emailErrorMsg.innerText = "";
      return true;
    } else {
      emailErrorMsg.innerText = "Email incorect";
      return false;
    }
  };

  email.addEventListener("change", function () {
    validEmail(this.value);
  });

  // 49. Ecoute de l'envoie du formulaire

  document.querySelector("form").addEventListener("submit", (e) => {
    // 50. supression du comportement par defaut
    e.preventDefault();
    // 51. si toute les validation sont vrais
    if (
      validFirstName(firstName.value) &&
      validLastName(lastName.value) &&
      validCountry(city.value) &&
      validAdresse(address.value) &&
      validEmail(email.value)
    ) {
      // 52. crée le tableau idProduct
      const idProducts = [];
      // 53. met les id des articles dans le tableau idProduct
      for (const article of panier) {
        if (typeof article._id === "string") {
          idProducts.push(article._id);
        }
      }
      // 54. crée l'objet de la commande
      const order = {
        contact: {
          firstName: firstName.value,
          lastName: lastName.value,
          address: address.value,
          city: city.value,
          email: email.value,
        },
        products: idProducts,
      };
      // 55. crée l'option de la requete 
      const options = {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      // 56. envoie la commande attend la réponse, envoie l'id de la commande dans le localstorage et nous redirige sur la page de comfirmation 
      fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          localStorage.clear();
          localStorage.setItem("orderId", data.orderId);

          document.location.href = "confirmation.html";
        })
        .catch((err) => {
          alert("Problème avec fetch : " + err.message);
        });
    }
  });
}

/* 3. joue la fonction create card */
createCard();

// 43. joue la fonction checkout
checkOut();
