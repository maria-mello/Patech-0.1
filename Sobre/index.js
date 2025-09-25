var radio = document.querySelector('.manual-btn')
var cont = 1

document.getElementById('radio1').checked = true

setInterval(() => {
    proximovideo()
}, 5000)

function proximovideo(){
    cont++

    if(cont > 2){
        cont = 1
    }

    document.getElementById('radio' + cont).checked = true
}

function irCarrinho() { //chama o carrinho pelo id
  document.getElementById("modalCarrinho").style.display = "block";
}

function fecharModalCarrinho() {
  document.getElementById("modalCarrinho").style.display = "none";
}

// Fecha o modal se o usuário clicar fora 
window.onclick = function(event) {
  const modal = document.getElementById("modalCarrinho");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};