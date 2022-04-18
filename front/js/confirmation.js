function main() {
    textConfirm = document.getElementById("orderId")
    textConfirm.innerText = localStorage.getItem("orderId")
    console.log(localStorage.getItem("orderId"));
    localStorage.clear()
    
}

main();