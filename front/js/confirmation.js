const queryId = window.location.search
const urlParams = new URLSearchParams(queryId)
const orderId = urlParams.get("orderId")

const span = document.querySelector("#orderId")
span.textContent = orderId