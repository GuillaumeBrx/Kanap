const queryId = window.location.search
const urlParams = new URLSearchParams(queryId)
const productId = urlParams.get("id")


fetch(`http://localhost:3000/api/products/${productId}`)
.then(response => response.json())
.then(product => displayProduct(product))


function displayProduct(product) {

    const {altTxt, colors, description, imageUrl, name, price} = product;

    imgUrl = imageUrl
    altText = altTxt
    itemName = name

    const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = altTxt;

    document.querySelector(".item__img").appendChild(img);

    const h1 = document.getElementById("title")
    h1.textContent = name;

    const span = document.getElementById("price")
    span.textContent = price;

    const p = document.getElementById("description")
    p.textContent = description;

    const select = document.getElementById("colors")
    colors.forEach(color => {
        const option = document.createElement("option")
        option.value = color;
        option.textContent = color;
        select.appendChild(option)
    });
    
}


function addToCart() {

  const quantity = document.querySelector("#quantity").value
  const colors = document.querySelector("#colors").value

  const key = `${productId}:${colors}`

  const data = {
    id: productId,
    quantity: Number(quantity),
    colors: colors
  }

  localStorage.setItem(key, JSON.stringify(data))
  window.location.href = "cart.html" 
}


const button = document.querySelector("#addToCart");
button.addEventListener("click", () => {
    addToCart();
})