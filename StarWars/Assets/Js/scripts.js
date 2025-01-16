let currentPage = 1;
let totalPages = 1;

function fetchCharacters(page = 1, searchTerm = '') {
    const url = `https://swapi.py4e.com/api/people/?page=${page}&search=${searchTerm}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            totalPages = Math.ceil(data.count / 10);
            displayCharacters(data.results);
        })
        .catch(error => console.error("Error fetching data:", error));
}

function displayCharacters(characters) {
    const list = document.getElementById("character-list");
    list.innerHTML = "";

    if (characters.length === 0) {
        list.innerHTML = "<p>Ingen karakterer fundet.</p>";
        return;
    }

    characters.forEach(character => {
        const characterCard = `
            <div class="character-card">
                <h3>${character.name}</h3>
                <p><strong>Højde:</strong> ${character.height} cm</p>
                <p><strong>Fødselsår:</strong> ${character.birth_year}</p>
                <p><strong>Køn:</strong> ${character.gender}</p>
            </div>
        `;
        list.innerHTML += characterCard;
    });
}

document.getElementById("searchInput").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    currentPage = 1;
    fetchCharacters(currentPage, searchTerm);
});

function changePage(direction) {
    currentPage += direction;

    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const searchTerm = document.getElementById("searchInput").value;
    fetchCharacters(currentPage, searchTerm);
}




let planetPage = 1;
let totalPlanetPages = 1;
let allPlanets = [];

function fetchPlanets(page = 1) {
    fetch(`https://swapi.py4e.com/api/planets/?page=${page}`)
        .then(response => response.json())
        .then(data => {
            totalPlanetPages = Math.ceil(data.count / 10);
            allPlanets = allPlanets.concat(data.results);
            displayPlanets(data.results);
            populateClimateFilter();
        })
        .catch(error => console.error("Error fetching planets:", error));
}

function displayPlanets(planets) {
    const list = document.getElementById("planet-list");
    list.innerHTML = "";

    if (planets.length === 0) {
        list.innerHTML = "<p>Ingen planeter fundet.</p>";
        return;
    }

    planets.forEach(planet => {
        const planetCard = `
            <div class="planet-card">
                <h3>${planet.name}</h3>
                <p><strong>Befolkning:</strong> ${planet.population}</p>
                <p><strong>Klima:</strong> ${planet.climate}</p>
                <p><strong>Terræn:</strong> ${planet.terrain}</p>
            </div>
        `;
        list.innerHTML += planetCard;
    });
}

function populateClimateFilter() {
    const climates = new Set();
    allPlanets.forEach(planet => {
        planet.climate.split(',').forEach(climate => climates.add(climate.trim()));
    });

    const filter = document.getElementById("climateFilter");
    filter.innerHTML = `<option value="">Filtrer efter klima</option>`;
    climates.forEach(climate => {
        filter.innerHTML += `<option value="${climate}">${climate}</option>`;
    });
}

document.getElementById("climateFilter").addEventListener("change", function () {
    const selectedClimate = this.value;
    const filteredPlanets = selectedClimate
        ? allPlanets.filter(planet => planet.climate.includes(selectedClimate))
        : allPlanets;

    displayPlanets(filteredPlanets);
});

function changePlanetPage(direction) {
    planetPage += direction;

    if (planetPage < 1) planetPage = 1;
    if (planetPage > totalPlanetPages) planetPage = totalPlanetPages;

    fetchPlanets(planetPage);
}

function fetchFilms() {
    fetch('https://swapi.py4e.com/api/films/')
        .then(response => response.json())
        .then(data => displayFilms(data.results))
        .catch(error => console.error("Error fetching films:", error));
}

function displayFilms(films) {
    const filmList = document.getElementById("film-list");
    filmList.innerHTML = "";

    films.sort((a, b) => a.episode_id - b.episode_id).forEach(film => {
        const filmCard = `
            <div class="film-card" onclick="openModal('${film.title}', \`${film.opening_crawl}\`)">
                <h3>${film.title}</h3>
                <p><strong>Udgivelsesdato:</strong> ${film.release_date}</p>
            </div>
        `;
        filmList.innerHTML += filmCard;
    });
}

function openModal(title, crawl) {
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-crawl").innerText = crawl;
    document.getElementById("film-modal").style.display = "block";
}

document.querySelector(".close-button").onclick = () => {
    document.getElementById("film-modal").style.display = "none";
};

window.onclick = (event) => {
    const modal = document.getElementById("film-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

window.onload = () => {
    fetchCharacters()
    fetchPlanets()
    fetchFilms()
};
