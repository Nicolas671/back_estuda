document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("registerForm").addEventListener("submit", function(event) {
        event.preventDefault();
       
        const dataNascimentoInput = document.getElementById('cad-data-nascimento').value;
        const errorSpan = document.getElementById('dateError');

        const inputDate = new Date(dataNascimentoInput);
        const currentDate = new Date();

        if (inputDate > currentDate) {
            errorSpan.style.display = 'inline';
        } else {
            errorSpan.style.display = 'none';
            AdicionarEstudante();
        }
    });
    
    const inputs = document.querySelectorAll('.date-container input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.placeholder = '';
        });
    
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.placeholder = input.getAttribute('name').charAt(0).toUpperCase() + input.getAttribute('name').slice(1);
            }
        });
    });

    document.getElementById('login-button').addEventListener('click', async () => {
        await LoginEstudante();

        // Limpar campos de login após o login bem-sucedido
        document.getElementById('login-email').value = '';
        document.getElementById('login-senha').value = '';
    });
});

async function AdicionarEstudante() {
    const email = document.getElementById('cad-email').value;
    const nome = document.getElementById('cad-nome').value;
    const dataNascimento = document.getElementById('cad-data-nascimento').value;
    const senha = document.getElementById('cad-senha').value;
    const confirmarSenha = document.getElementById('cad-confirmar-senha').value;

    if (email === '' || nome === '' || dataNascimento === '' || senha === '' || confirmarSenha === '') {
        alert("Coloque todas as suas informações");
        return;
    }
 
    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem");
        return;
    }

    const dataNascimentoISO = new Date(dataNascimento).toISOString();
 
    try {
        const response = await fetch('http://localhost:5201/api/Estudantes/Estudantes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                nome: nome,
                dataDeNascimento: dataNascimentoISO,
                senha: senha,
            })
        });
       
        console.log('Status Code:', response.status);
        if (response.status === 200 || response.status === 201) {
            document.getElementById('registerForm').reset();
            document.getElementById('successMessage').style.display = 'block';
            setTimeout(() => {
                window.location.href = "http://127.0.0.1:5501/indexprincipal.html";
            }, 1000); // redireciona após 1 segundo
        } else {
            const errorData = await response.json();
            console.error('Erro ao cadastrar:', errorData);
            alert('Erro ao cadastrar: ' + (errorData.message || response.statusText));
        }
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        alert('Erro ao cadastrar: ' + error.message);
    }
}

async function LoginEstudante() {
    
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    const loginError = document.getElementById('loginError');
 
    if (email === '' || senha === '') {
        alert("Preencha todos os campos");
        return;
    }
 
    try {
        const response = await fetch('http://localhost:5201/api/Autenticacao/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, senha: senha })
        });
       
        const responseBody = await response.json();
 
        if (response.ok) {
            loginError.style.display = 'none';
            alert(`Login bem-sucedido! Bem-vindo !!! porfavor nao saia ;-;`);
            // Remova o redirecionamento imediato aqui para evitar conflitos com o cadastro
            window.location.href = "http://127.0.0.1:5501/indexprincipal.html";
        } else {
            console.error('Erro ao fazer login:', responseBody);
            loginError.style.display = 'inline';
            loginError.textContent = 'Erro ao fazer login: ' + responseBody.title;
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        loginError.style.display = 'inline';
        loginError.textContent = 'Erro ao fazer login: ' + error.message;
    }
}
