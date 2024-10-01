document.addEventListener('DOMContentLoaded', async () => {
            const materia = 'Matematica';  // Você pode obter o nome da matéria dinamicamente se necessário
            const questoesContainer = document.getElementById('questoes-container');

            try {
                const response = await fetch(`http://localhost:5201/api/Questoes/materia/${materia}`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar questões');
                }

                const questoes = await response.json();

                questoes.forEach(questao => {
                    const questaoCard = document.createElement('div');
                    questaoCard.classList.add('card_pergunta');

                    const questaoImg = document.createElement('img');
                    questaoImg.src = '/imagem/img-pag_pergunta.png';
                    questaoImg.alt = 'Imagem da pergunta';

                    const questaoTexto = document.createElement('p');
                    questaoTexto.textContent = questao.texto;  // Use o campo correto do JSON

                    questaoCard.appendChild(questaoImg);
                    questaoCard.appendChild(questaoTexto);

                    // Adicionando opções de resposta
                    const form = document.createElement('form');
                    questao.opcoes.forEach((opcao, index) => {  // Use o campo correto do JSON
                        const radioGroup = document.createElement('div');
                        radioGroup.classList.add('radio-group');

                        const radioInput = document.createElement('input');
                        radioInput.type = 'radio';
                        radioInput.id = `opcao${index}`;
                        radioInput.name = `questao${questao.id}`;  // Use o campo correto do JSON
                        radioInput.value = opcao;

                        const radioLabel = document.createElement('label');
                        radioLabel.htmlFor = `opcao${index}`;
                        radioLabel.textContent = opcao;

                        radioGroup.appendChild(radioInput);
                        radioGroup.appendChild(radioLabel);

                        form.appendChild(radioGroup);
                    });

                    questaoCard.appendChild(form);
                    questoesContainer.appendChild(questaoCard);
                });
            } catch (error) {
                console.error('Erro:', error);
                questoesContainer.textContent = 'Erro ao carregar as questões. Por favor, tente novamente mais tarde.';
            }
        });