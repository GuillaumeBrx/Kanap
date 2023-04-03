// Récupère l'ID du produit
const queryId = window.location.search
const urlParams = new URLSearchParams(queryId)
const productId = urlParams.get("id")

// Récupère les données du produit
fetch(`http://localhost:3000/api/products/${productId}`)
.then(response => {
  // Vérifie que la requête aboutisse
  if (!response.ok) {
    throw new Error(`Le produit que vous recherchez n'existe pas`)
  }
  return response.json()
})
.then(product => displayProduct(product))
// Si la requête n'a pas aboutie, renvoit un message d'erreur et retourne sur la page d'accueil
.catch(error => {
  alert(error.message)
  window.location.href = "index.html"
})

// Affiche les données du produit
function displayProduct(product) {
    const {altTxt, colors, description, imageUrl, name, price} = product

    const img = document.createElement("img")
      img.src = imageUrl
      img.alt = altTxt

    document.querySelector(".item__img").appendChild(img)

    const h1 = document.getElementById("title")
    h1.textContent = name

    const span = document.getElementById("price")
    span.textContent = price

    const p = document.getElementById("description")
    p.textContent = description

    const select = document.getElementById("colors")
    colors.forEach(color => {
        const option = document.createElement("option")
        option.value = color
        option.textContent = color
        select.appendChild(option)
    });
    
}

// Ajout d'un produit au panier
function addToCart() {
  const quantity = document.querySelector("#quantity").value
  const colors = document.querySelector("#colors").value
  const key = `${productId}:${colors}`

  // Si le produit n'est pas valide, retourne une alerte
  if (!isProductValid()) {
    alert("Veuillez sélectionner une couleur et/ou une quantité")
    return
  }

  const data = {
    id: productId,
    quantity: Number(quantity),
    colors: colors
  }

  // Si le produit n'est pas déjà dans le panier, l'ajouter au localStorage
  if (!isProductAlreadyInCart(key)) {
    localStorage.setItem(key, JSON.stringify(data)) 
  }

  window.location.href = "cart.html" 
}

// Vériie si le produit est déjà dans le panier
function isProductAlreadyInCart (key) {
  const savedProduct = localStorage.getItem(key)

  if (savedProduct == undefined) {
    return false
  }

  const product = JSON.parse(savedProduct)
  const quantity = document.querySelector("#quantity").value
  
  // Si le produit est déjà dans le panier, ajouter la quantité choisie à celui-ci
  product.quantity += Number(quantity)
  localStorage.setItem(key, JSON.stringify(product))
  return true
}

// Vérifie que la quantité et la couleur du produit soient sélectionnés et valides
function isProductValid() {
  const quantity = document.querySelector("#quantity").value
  const colors = document.querySelector("#colors").value

  if (colors == "") return false
  if (quantity === "0" || quantity === "" || quantity < 0) return false

  return true
}

// Ajouter le produit au panier en cliquant sur le bouton
const button = document.querySelector("#addToCart");
button.addEventListener("click", () => {
    addToCart()
})