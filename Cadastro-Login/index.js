const API_URL = 'http://localhost:3000';
let card = document.querySelector(".card");
let loginButton = document.querySelector(".loginButton"); 
let cadastroButton = document.querySelector(".cadastroButton"); 
let entrarButton = document.querySelector(".entrarButton"); 
let cadastrarButton = document.querySelector(".cadastrarButton"); 
const formLogin = document.querySelector(".formLogin form");
const formCadastro = document.querySelector(".formCadastro form");

// Função auxiliar para exibir feedback temporário ao usuário
function displayMessage(formElement, message, isSuccess = false) {
  let msgElement = formElement.querySelector('.feedback-message');
  if (!msgElement) {
      msgElement = document.createElement('p');
      msgElement.classList.add('feedback-message', 'mt-4');
      // Adiciona a mensagem logo antes do botão do formulário
      formElement.insertBefore(msgElement, formElement.querySelector('button')); 
  }
  
  msgElement.textContent = message;
  // Estilos css dos botões de erro
  msgElement.style.fontWeight = '500';
  msgElement.style.padding = '15px';
  msgElement.style.width = '100%';
  msgElement.style.textAlign = 'center';
  msgElement.style.backgroundColor = isSuccess ? '#D4EDDA' : '#F8D7DA'; 
  msgElement.style.color = isSuccess ? '#155724' : '#721C24'; 
  msgElement.style.borderRadius = '10px';
  msgElement.style.fontSize = '14px';

  // Remove a mensagem após 4 segundos
  setTimeout(() => {
      msgElement.remove();
  }, 4000);
}

// Adiciona um evento de clique ao botão de login (Troca visual)
loginButton.onclick = () => {
  card.classList.remove("cadastroActive"); //remove a class so cadastro e vai pro login 
  card.classList.add("loginActive"); 
};

// Adiciona um evento de clique ao botão de cadastro (Troca visual)
cadastroButton.onclick = () => {
  card.classList.remove("loginActive"); //remove a class so login e vai pro cadastro 
  card.classList.add("cadastroActive");
};

// Função para sair
function Sair() {
  window.location.href = "../index.html"; // Volta paara a tela inicial
}

// CADASTRO 
// Adiciona um evento de clique ao botão "Cadastrar" para mandar pra API
cadastrarButton.onclick = async () => {
  // Pega todos os inputs do formulário de cadastro, na ordem que estão no HTML
const inputs = formCadastro.querySelectorAll('input');
const nome = inputs[0].value;
const cpf = inputs[1].value;
const email = inputs[2].value;
const senha = inputs[3].value;
const confirmaSenha = inputs[4].value;

// Campos vazios
if (!nome || !cpf || !email || !senha || !confirmaSenha) {
  displayMessage(formCadastro, 'Preencha todos os campos!', false);
  return; 
}
// Confirmação de Senha
if (senha !== confirmaSenha) {
  displayMessage(formCadastro, 'As senhas não coincidem!', false);
  return;
}
// Preparar dados para a API (SÓ ENVIA SE ESTIVEREM VÁLIDAS)
const dadosCadastro = { nome, cpf, email, senha };

try {
  // Envia a requisição POST para a rota /cadastro da API
  const response = await fetch(`${API_URL}/cadastro`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosCadastro),
      credentials: 'include'
  });

  const data = await response.json();

  if (response.ok) {
      // Se estiver tudo certo exibe a mensagem e redireciona
      displayMessage(formCadastro, data.mensagem + ' Redirecionando...', true);
      
      setTimeout(() => {
          // Redireciona para a tela de usuário após 1.5s
          window.location.href = "../Usuario/usuario.html";
      }, 1500);
  } else {
      // Se não estiver tudo certo exibe a mensagem de erro
      displayMessage(formCadastro, data.mensagem, false);
  }
} catch (error) {
  // Erro de rede ou servidor
  displayMessage(formCadastro, 'Erro de conexão.', false);
  console.error('Erro de rede/servidor:', error);
}
};

// LOGIN
// Adiciona um evento de clique ao botão "Entrar" para mandar pra API
  entrarButton.onclick = async () => {
  // Pega todos os inputs do formulário de login
  const inputs = formLogin.querySelectorAll('input');
  const email = inputs[0].value;
  const senha = inputs[1].value;

  // Validação
  if (!email || !senha) {
      displayMessage(formLogin, 'Preencha e-mail e senha.', false);
      return; 
  }
  // Preparar dados para a API
  const dadosLogin = { email, senha };
  try {
      // Envia a requisição POST para a rota /login da API
      const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(dadosLogin),
          credentials: 'include'
      });
      const data = await response.json();

      if (response.ok) {
          // Se der certo vai exibir a mensagem e redirecionar
          displayMessage(formLogin, data.mensagem + ' Redirecionando...', true);

          setTimeout(() => {
              // Redireciona para a home após 1.5s
              window.location.href = "../Usuario/usuario.html";
          }, 1500);
      } else {
          // Se der erro vai exibir a mensagem de erro ("E-mail ou senha inválidos")
          displayMessage(formLogin, data.mensagem, false);
      }
  } catch (error) {
      // Vai identificar se é um erro de rede ou servidor
      displayMessage(formLogin, 'Erro de conexão.', false);
      console.error('Erro de rede/servidor:', error);
  }
};