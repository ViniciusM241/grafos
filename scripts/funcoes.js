
const initGrafos = () => {
    const button = document.querySelector('#btnGeraMatriz');
    const arestasInput = document.querySelector("#formArestas");
    const verticesInput = document.querySelector("#formVertices");
    const input = document.querySelector('#textArea');
    let element, matriz;

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    })

    arestasInput.addEventListener('change', () => {  
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
        let nums = [];
        const qtdeVertices = verticesInput.value

        const numbers = [...Array(parseInt(qtdeVertices)).keys()].map(i => i + 1)

        element.words.forEach(x => {
            x.split("-").forEach(y => {
                let answer = numbers.indexOf(parseInt(y))
                if(answer === -1){
                    nums.push(y);
                    flag = true;
                }
            })
        })
        
        if (flag){
            let s = 'Valores de vértices incorretos. Confira o vértice';

            if (nums.length > 1)
                s += "s " + nums.join("; ");
            else
                s += " " + nums[0];
            alert(s)

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
        let th = document.createElement('th');

        table.innerHTML = "";

        for (let i = 0; i < matriz.length + 1; i++) {
            const th = document.createElement('th');
            th.innerHTML = i === 0 ? 'V' : i;
            tr.appendChild(th);
        }
        if (tipoGrafo() == 'rdbGrafo'){
            th.innerHTML = 'Grau';
        } else {
            th.innerHTML = 'Grau E.';
            tr.appendChild(th);
            th = document.createElement('th');
            th.innerHTML = 'Grau R.';
            tr.appendChild(th);
        }
        tr.appendChild(th);
        thead.appendChild(tr);
        table.appendChild(thead);

        matriz.forEach((linha, indexY) => {
            const tr = document.createElement('tr');
            let th = document.createElement('th');

            th.innerHTML = indexY + 1;
            th.classList.add('vertice');
            tr.appendChild(th);
            let grau = 0;
            let grauR = 0;
            linha.forEach((bit, indexX) => {
                th = document.createElement('th');
                th.innerHTML = bit;
                if (bit === 1){
                    if (indexY === indexX && tipoGrafo() === 'rdbGrafo')
                        grau++;
                    grau++;
                    th.classList.add('eUm');
                }
                if (tipoGrafo() === 'rdbDigrafo'){
                    if(matriz[indexX][indexY] === 1)
                        grauR++;
                }
                tr.appendChild(th);
            })
            
            th = document.createElement('th');
            th.innerHTML = grau;
            th.classList.add('eUm');
            tr.appendChild(th);

            if (tipoGrafo() === 'rdbDigrafo'){
                th = document.createElement('th');
                th.innerHTML = grauR;
                th.classList.add('eUm');
                tr.appendChild(th);
            }
            tbody.appendChild(tr);
            table.appendChild(tbody);
        });
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
    
                if (element.words.length === parseInt(qtdeArestas) && tipoGrafo() === 'rdbGrafo') {
                    button.focus()        
                    tooltipList[0].hide();        
                    input.disabled = true;
                }
                else if (element.words.length === parseInt(qtdeArestas) * 2 && tipoGrafo() === 'rdbDigrafo') {
                    button.focus()
                    tooltipList[0].hide();
                    input.disabled = true;
                }
                else {
                    tooltipList[0].hide();
                    input.disabled = false;
                }
            })
            if (element.words.length === 0) {
                const i = document.createElement('i');
                i.innerHTML = "Nenhuma aresta escolhida.";
                i.classList.add("text-muted");
                i.setAttribute("id", "iAresta");
                containers.appendChild(i);
            }
        }
    }
    initializeBoxes();
}

document.querySelectorAll('input[name="rdbModo"]').forEach((elem) => {
    elem.addEventListener("change", function(event) {
      const item = event.target.value;
      if (item === 'gui') {
          document.getElementById('gui').style.display = 'block';
          document.getElementById('divTerminal').style.display = 'none';
          initGrafos();
      } else {
        document.getElementById('gui').style.display = 'none';
        document.getElementById('divTerminal').style.display = 'block';
      }
    })
})