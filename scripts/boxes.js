let element;
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
        })
    }
}
initializeBoxes();