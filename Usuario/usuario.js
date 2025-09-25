
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