showPlanets();
let results = [];

function printPlanets() {
    results.forEach((planet, index) => {
        let planets_ul = document.getElementById('planets');
        let li = document.createElement('li');
        li.innerHTML = `
        <div id="${planet.name}">
            <button id="${index}" onClick='showDetails(event)'>${planet.name}</button>
            <dl id="dl_${index}" class='hidden'></dl>
        </div>
        `
        planets_ul.appendChild(li)
    })
}

async function showPlanets() {
    let data = await fetch('https://swapi.dev/api/planets/?format=json')
    data = await data.json()
    results = data.results
    while (data.next != null){
        data = await fetch(data.next);
        data = await data.json();
        results.push(...data.results.splice(0));
    }

    printPlanets();
    console.log(results)
}

async function showDetails(event) {
    let results_people = [];
    let dl = event.target.nextElementSibling;

    dl.classList.toggle('hidden');
    if (dl.innerHTML === '') {
        for (const resident of results[results.findIndex(obj => obj.name === event.target.innerHTML)].residents) {
            let data = await fetch(resident);
            data = await data.json();
            results_people.push(data);
        }
        dl.innerHTML = `
        <dt>Clima</dt>
        <dd>${results[event.target.id].climate}</dd>

        <dt>População</dt>
        <dd>${results[event.target.id].population}</dd>

        <dt>Terreno</dt>
        <dd>${results[event.target.id].terrain}</dd>
        `
        if (results_people.length > 0 ) {
            dl.innerHTML += `
            <h4>Habitantes mais notórios</h4>
            <table>
                <tr>
                    <th>Nome</th>
                    <th>Data de Nascimento</th>
                </tr>
                ${results_people.map(person => 
                    `
                    <tr>
                        <td>${person.name}</td>
                        <td>${person.birth_year}</td>
                    </tr>
                    `
                ).join('')}
            </table>
            `;
        } else {
            dl.innerHTML += '<p>Não há habitantes notórios nesse planeta</p>'
        }   
    }
}

async function searchPlanet() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const planets_ul = document.getElementById('planets');
    
    console.log(results)
    if (searchTerm.trim() === '') {
        planets_ul.innerHTML = '';
        printPlanets();
        return
    }   



    let data = await fetch(`https://swapi.dev/api/planets/?search=${searchTerm}`)
    data = await data.json();
    planets_ul.innerHTML = '';
    if (data.results.length > 0) {
        data.results.forEach((planet, index) => {
            let li = document.createElement('li');
            li.innerHTML = `
            <div id="${planet.name}">
                <button id="${index}" onClick='showDetails(event)'>${planet.name}</button>
                <dl id="dl_${index}" class='hidden'></dl>
            </div>
            `;
            planets_ul.appendChild(li);
        });
    } else {
        planets_ul.innerHTML = '<p>Não foi possível encontrar o planeta buscado</p>'
    } 
}

/*function searchPlanet() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();

    const planetsList = document.getElementById('planets');
    planetsList.innerHTML = '';

    results.forEach((planet, index) => {
        if (planet.name.toLowerCase().includes(searchTerm)) {
            let li = document.createElement('li');
            li.innerHTML = `
            <div id="${planet.name}">
                <button id="${index}" onClick='showDetails(event)'>${planet.name}</button>
                <dl id="dl_${index}" class='hidden'></dl>
            </div>
            `;
            planetsList.appendChild(li);
        }
    });
}*/