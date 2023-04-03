// Récupère l'orderID
const queryId = window.location.search
const urlParams = new URLSearchParams(queryId)
const orderId = urlParams.get("orderId")

// Affiche l'orderID
const span = document.querySelector("#orderId")
span.textContent = orderId