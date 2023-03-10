const cart = []
let itemPrice, itemImage, itemName


function getData() {
    for(let i = 0; i < localStorage.length; i++) {
        const object = localStorage.getItem(localStorage.key(i))
        const item = JSON.parse(object)
        cart.push(item)
        fetchItemDetails(item)
    }
}


function fetchItemDetails(item) {
    const productId = item.id

    fetch(`http://localhost:3000/api/products/${productId}`)
    .then(response => response.json())
    .then(data => {
        const { price, imageUrl, name, altText } = data 

        item.price = price
        item.name = name
        item.image = imageUrl
        item.altText = altText
    
        displayItem(item)
    })  
} 


function displayItem(item) {
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.colors

    const imageDiv = document.createElement("div")
    imageDiv.classList.add("cart__item__img")

    const img = document.createElement('img');
    img.src = item.image
    img.alt = item.altText

    const contentDiv = document.createElement("div")
    contentDiv.classList.add("cart__item__content")

    const descriptionDiv = document.createElement("div")
    descriptionDiv.classList.add("cart__item__content__description")

    const settingsDiv = document.createElement("div")
    settingsDiv.classList.add("cart__item__content__settings")

    const quantityDiv = document.createElement("div")
    quantityDiv.classList.add("cart__item__content__settings__quantity")

    const deleteDiv = document.createElement("div")
    deleteDiv.classList.add("cart__item__content__settings__delete")

    const itemName = document.createElement('h2');
    itemName.textContent = item.name;

    const itemColor = document.createElement('p')
    itemColor.textContent = item.colors

    const itemPrice = document.createElement('p')
    itemPrice.textContent = `${item.price} €`

    const quantity = document.createElement('p')
    quantity.textContent = `Qté : ${item.quantity}` 

    const input = document.createElement('input')
    input.type = "number"
    input.classList.add("itemQuantity")
    input.name = "itemQuantity"
    input.min = "1"
    input.max = "100"
    input.value = item.quantity
    input.addEventListener("change", () => {
        updateInput(item.id, item, input.value)
        updateQuantityDisplay(item, input.value) 
    })

    const deleteItem = document.createElement('p')
    deleteItem.classList.add("deleteItem")
    deleteItem.textContent = "Supprimer"
    deleteItem.addEventListener("click", () => deleteItemFromCart(item))

    article.appendChild(imageDiv)
    article.appendChild(contentDiv)

    imageDiv.appendChild(img)

    descriptionDiv.appendChild(itemName)
    descriptionDiv.appendChild(itemColor)
    descriptionDiv.appendChild(itemPrice)

    contentDiv.appendChild(descriptionDiv)
    contentDiv.appendChild(settingsDiv)
    
    settingsDiv.appendChild(quantityDiv)
    settingsDiv.appendChild(deleteDiv)

    quantityDiv.appendChild(quantity)
    quantityDiv.appendChild(input)

    deleteDiv.appendChild(deleteItem)

    document.getElementById("cart__items").appendChild(article)
    
    updateCartPrice(item)
    updateCartQuantity(item)
}


function updateCartPrice(item) {
    let calcPrice = 0
    const totalPrice = document.querySelector("#totalPrice")

    cart.forEach((item) => {
        const itemTotalPrice = item.price * item.quantity
        calcPrice += itemTotalPrice
    })

    totalPrice.textContent = calcPrice
}


function updateCartQuantity(item) {
    let calcQuantity = 0
    const totalQuantity = document.querySelector("#totalQuantity")
    
    cart.forEach((item) => {
        const itemTotalQuantity = item.quantity
        calcQuantity += itemTotalQuantity
    })

    totalQuantity.textContent = calcQuantity
}


function updateInput(itemId, item, value) {
    const itemToUpdate = cart.find((cartItem) => cartItem.id === itemId && cartItem.colors === item.colors);
    if (itemToUpdate) {
        itemToUpdate.quantity = Number(value);
        updateCartPrice();
        updateCartQuantity();
        updateQuantityDisplay(itemToUpdate, value);
        updateStorage(itemToUpdate);
    }
}


function updateQuantityDisplay(item, value) {
    const quantityDisplay = document.querySelector(`[data-id="${item.id}"][data-color="${item.colors}"] .cart__item__content__settings__quantity p`);
    quantityDisplay.textContent = `Qté : ${value}`;
}


function updateStorage(item) {
    const data = JSON.stringify(item)
    const key = `${item.id}:${item.colors}`
    localStorage.setItem(key, data)
}


function deleteItemFromCart(item) {
    const itemToDelete = cart.findIndex((product) => product.id === item.id && product.colors === item.colors);
    cart.splice(itemToDelete, 1)

    const key = `${item.id}:${item.colors}`
    localStorage.removeItem(key)

    const article = document.querySelector(`[data-id="${item.id}"][data-color="${item.colors}"]`);
    article.remove();

    updateCartPrice();
    updateCartQuantity();
}


function submitForm(event) {
    event.preventDefault()

    if (cart.length === 0) {
        alert("Veuillez ajouter des éléments à votre panier")
        return
    }

    if (isFormValid()) return

    const formData = getFormData()

    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        const orderId = data.orderId
        window.location.href = "confirmation.html" + "?orderId=" + orderId

        console.log(data)
    })
}


function getFormData() {
    const form = document.querySelector(".cart__order__form")
    const formData = {
        contact: {
            firstName: form.elements.firstName.value,
            lastName: form.elements.lastName.value,
            address: form.elements.address.value,
            city: form.elements.city.value,
            email: form.elements.email.value
        },
        products: cart.map(item => item.id)
    }
    return formData
}


function isFormValid() {
    const inputs = document.querySelectorAll("input")
    const firstName = document.querySelector("#firstName").value
    
    if (/[1-9]/.test(firstName)) {
        const firstNameError = document.querySelector("#firstNameErrorMsg")
        firstNameError.textContent = "Le prénom ne doit pas contenir de chiffre"
        return false
    }

    inputs.forEach((input) => {
        if (input.value === "") {
            alert("Veuillez remplir tous les champs du formulaire")
        }
        return false
    })
    return true
}


const orderButton = document.querySelector(".cart__order__form")
orderButton.addEventListener("submit", (event) => submitForm(event))


getData()