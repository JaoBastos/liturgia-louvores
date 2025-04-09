document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('culto-form');
    const lista = document.getElementById('lista-cultos');
    const busca = document.getElementById('busca');

    const getCultos = () => JSON.parse(localStorage.getItem('cultos') || '[]');

    const salvarCultos = (cultos) => localStorage.setItem('cultos', JSON.stringify(cultos));

    const agruparPorMes = (cultos) => {
        return cultos.reduce((acc, culto) => {
            const [ano, mes] = culto.data.split('-');
            const chave = `${mes}/${ano}`;
            acc[chave] = acc[chave] || [];
            acc[chave].push(culto);
            return acc;
        }, {});
    };

    const renderizar = () => {
        const filtro = busca.value.toLowerCase();
        const cultos = getCultos().filter(c => 
            c.tipo.toLowerCase().includes(filtro) || 
            c.tema.toLowerCase().includes(filtro) || 
            c.abrir.concat(c.ofertas, c.reflexao, c.fechar).some(l => l.toLowerCase().includes(filtro))
        );
        const agrupados = agruparPorMes(cultos);
        lista.innerHTML = '';

        Object.keys(agrupados).sort().forEach(mes => {
            const titulo = document.createElement('h2');
            titulo.className = 'mes-titulo';
            titulo.textContent = `📅 ${mes}`;
            lista.appendChild(titulo);

            agrupados[mes].forEach(culto => {
                const div = document.createElement('div');
                div.className = 'culto';
                div.innerHTML = `
                    <strong>Data:</strong> ${culto.data}<br>
                    <strong>Tipo:</strong> ${culto.tipo}<br>
                    <strong>Tema:</strong> ${culto.tema}<br><br>
                    <strong>Abrir o culto:</strong><ul>${culto.abrir.map(l => `<li>${l}</li>`).join('')}</ul>
                    <strong>Dízimos e ofertas:</strong><ul>${culto.ofertas.map(l => `<li>${l}</li>`).join('')}</ul>
                    <strong>Reflexão:</strong><ul>${culto.reflexao.map(l => `<li>${l}</li>`).join('')}</ul>
                    <strong>Fechar o culto:</strong><ul>${culto.fechar.map(l => `<li>${l}</li>`).join('')}</ul>
                `;
                lista.appendChild(div);
            });
        });
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const culto = {
            data: document.getElementById('data').value,
            tipo: document.getElementById('tipo').value,
            tema: document.getElementById('tema').value,
            abrir: document.getElementById('abrir').value.split(',').map(s => s.trim()).filter(Boolean),
            ofertas: document.getElementById('ofertas').value.split(',').map(s => s.trim()).filter(Boolean),
            reflexao: document.getElementById('reflexao').value.split(',').map(s => s.trim()).filter(Boolean),
            fechar: document.getElementById('fechar').value.split(',').map(s => s.trim()).filter(Boolean)
        };
        const cultos = getCultos();
        cultos.push(culto);
        salvarCultos(cultos);
        form.reset();
        renderizar();
    });

    busca.addEventListener('input', renderizar);
    renderizar();
});