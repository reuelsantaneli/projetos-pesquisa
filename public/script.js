document.addEventListener('DOMContentLoaded', () => {
  const formSelect = document.getElementById('formSelect');
  let formularios = [];

  // Fetch all formularios
  fetch('/api/formularios')
    .then(res => res.json())
    .then(data => {
      formularios = data;
      data.forEach(form => {
        const opt = document.createElement('option');
        opt.value = form.id;
        opt.textContent = form.nome;
        formSelect.appendChild(opt);
      });

      if (data.length) {
        formSelect.value = data[0].id;
        carregarPagina(data[0].id);
      }

      formSelect.onchange = () => {
        carregarPagina(formSelect.value);
      };
    });

  function carregarPagina(formId) {
    if (document.getElementById('graficos')) {
      carregarDashboard(formId);
    } else if (document.getElementById('relatorio')) {
      carregarRelatorio(formId);
    }
  }

  function carregarDashboard(formId) {
    fetch('/api/respostas/' + formId)
      .then(res => res.json())
      .then(respostas => {
        const formulario = formularios.find(f => f.id === formId);
        const perguntas = formulario?.perguntas || [];
        const container = document.getElementById('graficos');
        container.innerHTML = '';

        perguntas.forEach((pergunta, index) => {
          const texto = pergunta.texto;
          const respostasPergunta = respostas.map(r => {
            const rItem = r.respostas?.find(p => p.pergunta === texto);
            return rItem?.resposta;
          }).filter(Boolean);

          const contagem = {};
          respostasPergunta.forEach(resp => {
            if (Array.isArray(resp)) {
              resp.forEach(r => contagem[r] = (contagem[r] || 0) + 1);
            } else {
              contagem[resp] = (contagem[resp] || 0) + 1;
            }
          });

          const labels = Object.keys(contagem);
          const values = Object.values(contagem);
          const total = values.reduce((a,b) => a+b, 0);
          const percentages = values.map(v => ((v/total)*100).toFixed(1));

          container.appendChild(document.createElement('hr'));
          const title = document.createElement('h5');
        
          title.textContent = texto;
          container.appendChild(title);

          const canvas = document.createElement('canvas');
          canvas.width = 500;
          canvas.height = 250;
          container.appendChild(canvas);

          new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
              labels,
              datasets: [{
                label: '% Respostas',
                data: percentages,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: function(value) {
                      return value + '%';
                    }
                  }
                }
              },
              responsive: true,
              plugins: {
                legend: { display: false }
              }
            }
          });
        });
      });
  }

  function carregarRelatorio(formId) {
    fetch('/api/respostas/' + formId)
      .then(res => res.json())
      .then(respostas => {
        const formulario = formularios.find(f => f.id === formId);
        const perguntas = formulario?.perguntas || [];
        const container = document.getElementById('relatorio');
        container.innerHTML = '';

        perguntas.forEach((pergunta, index) => {
          const texto = pergunta.texto;
          const respostasPergunta = respostas.map(r => {
            const rItem = r.respostas?.find(p => p.pergunta === texto);
            return rItem?.resposta;
          }).filter(Boolean);

          const contagem = {};
          respostasPergunta.forEach(resp => {
            if (Array.isArray(resp)) {
              resp.forEach(r => contagem[r] = (contagem[r] || 0) + 1);
            } else {
              contagem[resp] = (contagem[resp] || 0) + 1;
            }
          });

          const values = Object.values(contagem);
          const total = values.reduce((a,b) => a+b, 0);

          const title = document.createElement('h5');
          title.textContent = (index+1) + ' – ' + texto;
          container.appendChild(title);

          Object.keys(contagem).forEach(option => {
            const percent = ((contagem[option]/total)*100).toFixed(1);
            const p = document.createElement('p');
            p.textContent = option + ': ' + percent + '%';
            container.appendChild(p);
          });
        });
      });
  }

});

// Logout function
function logout() {
  // Clear any stored session data if used
  window.location.href = 'login.html';
}
