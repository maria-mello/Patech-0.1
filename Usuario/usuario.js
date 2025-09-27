function irCadastro(){ // abre a tela de cadastro
    window.location.href = "../Cadastro-Login/index.html"
}

// CARRINHO MODAL 
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
// FAVORITOS MODAL
function irFavorito() { //chama o carrinho pelo id
  document.getElementById("modalFavoritos").style.display = "block";
}
function fecharModalFavoritos() {
  document.getElementById("modalFavoritos").style.display = "none";
}
// Fecha o modal se o usuário clicar fora 
window.onclick = function(event) {
  const modal = document.getElementById("modalFavoritos");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

function mostrarDados(numero) {   // Define uma função chamada "mostrarDados" que recebe um  "numero". É usado para identificar qual <section> deve aparecer.
    const secoes = document.querySelectorAll('section');   // Pega todas as tags <section> da página e guarda na constante "secoes". O resultado é uma lista (NodeList) com todas as <section>.
    secoes.forEach(secao => {   // Para cada <section> encontrada, executa uma função que recebe cada "secao" individualmente.
      if (secao.id === `dados${numero}`) {  // Verifica se o ID da seção atual é igual a "dados" + o valor do "numero".
        secao.classList.add('ativo'); // Se a condição for verdadeira, adiciona a classe "ativo" nessa seção.
      } else {
        secao.classList.remove('ativo'); // Remove a classe "ativo" dessa seção, para que ela fique com o display: none.
      }
    });
  }
