const button = document.querySelector('#btnGeraMatriz');
const arestasInput = document.querySelector("#formArestas");
const verticesInput = document.querySelector("#formVertices");
const input = document.querySelector('#textArea');
let element, matriz;

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
})

arestasInput.addEventListener('change', (e) => {  
    let qtdeArestas = arestasInput.value
    let qtdeVertices = verticesInput.value

    if (qtdeArestas < qtdeVertices - 1){
        alert("O número de arestas deve ser maior que a quantidade de vértices - 1.")
        arestasInput.value = "";
        input.disabled = true;
    } else 
        if (qtdeArestas !== "" && qtdeVertices !== "" && qtdeArestas > 0 && qtdeVertices > 0) {
            input.disabled = false;
            input.focus()
        } else
            input.disabled = true;
})

const tipoGrafo = () => {
    const radios = document.getElementsByName("rdbTipo");
    let tipoGrafo = "";
    radios.forEach(item => {
        if (item.checked) 
            tipoGrafo = item.id
    });
    return tipoGrafo;
}

const verifica = () => {
    let qtdeArestas = arestasInput.value
    let qtdeVertices = verticesInput.value

    if (qtdeArestas === "" || qtdeVertices === "" || element.words.length === 0) {
        alert('Preencha os campos necessários antes de prosseguir.');
        return false;
    }

    if (element.words.length < parseInt(qtdeArestas) && tipoGrafo() !== 'rdbDigrafo') {
        alert('O número de arestas não corresponde.');
        return false;
    }
    return true;
}

const montaMatriz = () => {
    matriz = [];
    const indice = parseInt(verticesInput.value);
    let flag = false;

    element.words.forEach(x => {
        x.split("-").forEach(y => {
            if (parseInt(y) > indice)
                flag = true;
        })
    })

    if (flag){
        alert('Valores de vértices incorretos. Confira.');
        return false;
    }

    for (let i = 0; i < indice; i++) {
        linha = [];
        for (let j = 0; j < indice; j++) {
            linha.push("0");
        }
        matriz.push(linha);
    }

    return true;
}

const preencheMatriz = (element) => {
    let xY = element.split("-");

    matriz[xY[0] - 1][xY[1] - 1] = 1;
    if (tipoGrafo() == 'rdbGrafo')
        matriz[xY[1] - 1][xY[0] - 1] = 1;
}

const montaTabela = (matriz) => {
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const table = document.querySelector('#table');
    const tr = document.createElement('tr');
    const th = document.createElement('th');

    table.innerHTML = "";

    for (let i = 0; i < matriz.length + 1; i++) {
        const th = document.createElement('th');
        th.innerHTML = i === 0 ? 'V' : i;
        tr.appendChild(th);
        console.log(tr);
        console.log(th);
    }
    th.innerHTML = 'Grau';
    tr.appendChild(th)
    thead.appendChild(tr)
    table.appendChild(thead);

    matriz.forEach((linha, index) => {
        const tr = document.createElement('tr');
        let th = document.createElement('th');

        th.innerHTML = index + 1;
        th.classList.add('vertice');
        tr.appendChild(th);
        let grau = 0;
        linha.forEach(bit => {
            th = document.createElement('th');
            th.innerHTML = bit;
            if (bit === 1){
                grau++;
                th.classList.add('eUm');
            }
            tr.appendChild(th);
        })
        th = document.createElement('th');
        th.innerHTML = grau;
        th.classList.add('eUm');
        tr.appendChild(th)
        tbody.appendChild(tr)
        table.appendChild(tbody)
    })
}

const load = () => {
    const spinner = document.querySelector('#spinner');
    spinner.style.display = 'block';
    setInterval(1000, () => {
        spinner.style.display = 'block'
    })
}

button.addEventListener('click', () => {
    const spinner = document.querySelector('#spinner');
    const table = document.querySelector('#table');

    if (!verifica(arestas))
        return;

    if (!montaMatriz())
        return;

    spinner.style.display = 'block';
    table.innerHTML = "";
    setTimeout(() => {
        spinner.style.display = 'none'
        element.words.map(element => preencheMatriz(element));
        console.log(matriz);
        montaTabela(matriz);
    }, 1000)
});

const initializeBoxes = () => {
    const containers = document.querySelector('#arestas');

    element = {
        id: input.id,
        input: input,
        words: [],
        updateWords: function(words){
            this.words = words
            updateScreen();
        },
        deleteWord: function(word){
            this.words = this.words.filter(x => x !== word);
            updateScreen();
        }
    }

    input.addEventListener('keydown', (e) => {
        if (e.keyCode == 13) {
            words = input.value.split('\n');
            element.updateWords(words);
        }
    })

    const updateScreen = () => {
        let qtdeArestas = arestasInput.value
        containers.innerHTML = ""

        element.words.forEach(item => {
            const div = document.createElement('div');
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            const word = item

            p.innerHTML = word;
            strong.innerHTML = '&times;';
            strong.classList.add("close");
            div.classList.add("box");
            div.classList.add(word);
            strong.addEventListener('click', () => { 
                element.deleteWord(word);
                aux = input.value.split("\n").filter(x => x !== word)
                input.value = aux.join("\n")
                updateScreen();
            })
            div.appendChild(p);
            div.appendChild(strong);
            containers.appendChild(div);
            if (element.words.length === parseInt(qtdeArestas) && tipoGrafo() === 'rdbGrafo')
                input.disabled = true;
            else if (element.words.length === parseInt(qtdeArestas) * 2 && tipoGrafo() === 'rdbDigrafo')
                input.disabled = true;
            else {
                tooltipList[0].hide();
                input.disabled = false;
            }
        })
        if (element.words.length === 0) {
            console.log(0);
            const i = document.createElement('i');
            i.innerHTML = "Nenhuma aresta escolhida.";
            i.classList.add("text-muted");
            i.setAttribute("id", "iAresta");
            containers.appendChild(i);
        }
    }
}
initializeBoxes();