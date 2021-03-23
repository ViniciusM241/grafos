var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

let element;
const qtdeArestas = document.querySelector("#formArestas")
const qtdeVertices = document.querySelector("#formVertices")
const input = document.querySelector('#textArea');

const initializeGrafos = () => {
    const button = document.querySelector('#btnGeraMatriz');

    button.addEventListener('click', () => {
        const arestas = element.words;
        const radios = document.getElementsByName("rdbTipo");
        let tipoGrafo;
    
        radios.forEach(item => {
            if (item.checked) 
                tipoGrafo = item.id
        });

        if (qtdeArestas.value === "" || qtdeVertices.value === "" || arestas.length === 0) {
            alert('Preencha os campos necessários antes de prosseguir.');
            return;
        }

        if (arestas.length < parseInt(qtdeArestas.value)) {
            alert('O número de arestas não correspondem.');
            return;
        }

        indice = parseInt(qtdeVertices.value);
        let matriz = [];
        let flag = false;
        element.words.forEach(x => {
            x.split("-").forEach(y => {
                if (parseInt(y) > indice)
                    flag = true;
            })
        })
        if (flag){
            alert('Valores de vértices incorretos. Confira.');
            return;
        }

        for (let i = 0; i < indice; i++) {
            linha = [];
            for (let j = 0; j < indice; j++) {
                linha.push("0");
            }
            matriz.push(linha)
        }

        console.log(matriz);        
        arestas.map(element => {
            let xY = element.split("-")
            matriz[xY[0] - 1][xY[1] - 1] = 1;
            if (tipoGrafo == 'rdbGrafo')
                matriz[xY[1] - 1][xY[0] - 1] = 1;
        })

    });
}

qtdeArestas.addEventListener('change', () => {
    if (qtdeVertices.value !== "" && qtdeArestas.value != "" && qtdeVertices.value > 0 && qtdeArestas.value > 0){
        input.disabled = false;
    }
    if (qtdeArestas.value < qtdeVertices.value - 1){
        if (qtdeArestas.value !== "") {
            alert("O número de arestas deve ser maior que a quantidade de vértices - 1.")
            qtdeArestas.value = "";
        }
    }
})

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
            if (element.words.length === parseInt(qtdeArestas.value))
                input.disabled = true;
            else {
                tooltipList[0].hide();
                input.disabled = false;
            }
        })
    }
}

initializeGrafos();
initializeBoxes();