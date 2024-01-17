const getBtn = document.querySelector('#get-btn');
const pokeName = document.querySelector('#poke-name');
const cardContainer = document.querySelector('.card-container');
const URL_PKM = 'https://pokeapi.co/api/v2/pokemon/';
const URL_PKM_SPCS = 'https://pokeapi.co/api/v2/pokemon-species/';
const LAST_PKMN = 1008;
const FIRST_PKMN = 1;

getBtn.addEventListener('click', async () => {
        const pokemon = pokeName.value.toLowerCase().replace(/ /g, "-");
        const pokemonData = await createPokemon(pokemon);
        localStorage.setItem('currentPokeId', pokemonData.id);
});

document.addEventListener('DOMContentLoaded', async () => {
        const storedId = localStorage.getItem('currentPokeId');
        if (storedId === null) {
                localStorage.setItem('currentPokeId', 1);
        }
        const initialId = storedId ? parseInt(storedId) : 1;
        await createPokemon(initialId);
})

// obtener el anterior

document.getElementById('previous-btn')
        .addEventListener('click', async () => {
                const currentPokeId = parseInt(localStorage.getItem('currentPokeId'));
                const newId = currentPokeId === FIRST_PKMN ? Math.max(LAST_PKMN, currentPokeId - 1) : Math.max(FIRST_PKMN, currentPokeId - 1);
                const pokemonData = await createPokemon(newId);
                localStorage.setItem('currentPokeId', pokemonData.id);
        })

// obtener el siguiente

document.getElementById('next-btn')
        .addEventListener('click', async () => {
                const currentPokeId = parseInt(localStorage.getItem('currentPokeId'));
                const newId = currentPokeId === LAST_PKMN ? Math.min(FIRST_PKMN, currentPokeId + 1) : Math.min(LAST_PKMN, currentPokeId + 1);
                const pokemonData = await createPokemon(newId);
                localStorage.setItem('currentPokeId', pokemonData.id);
        })

const fetchPokemon = async (pokemon) => {
        try {
                const data = [];

                const dataPkm = await fetch(`${URL_PKM}${pokemon}`);
                const dataPkmSpcs = await fetch(`${URL_PKM_SPCS}${pokemon}`);
                const parsedDataPkm = await dataPkm.json();
                const parsedDataPkmSpcs = await dataPkmSpcs.json();

                data.push(parsedDataPkm);
                data.push(parsedDataPkmSpcs);
                return data;
        } catch (error) {
                console.error("Pokémon not found");
        }
}

const createPkmJson = (pokemonData, pokemonDataSpecies) => {
        const pkmJson = {
                name: '',
                id: 0,
                url_img: '',
                description: '',
                height: 0,
                weight: 0
        };

        pkmJson.name = capitalizeName(pokemonData.name);
        pkmJson.id = pokemonData.id;
        pkmJson.url_img = pokemonData.sprites.other['official-artwork'].front_default;
        pkmJson.description = pokemonDataSpecies.flavor_text_entries[0].flavor_text; // Improve to get only english text
        pkmJson.height = pokemonData.height / 10.0;
        pkmJson.weight = pokemonData.weight * 1.0;

        return pkmJson;
}

const createCard = (pkmJson) => {
        let card = `
        <h2 id="pkm-name">${pkmJson.name} N.° <span id="pkm-id">${pkmJson.id}</span></h2>
                        <img src="${pkmJson.url_img}"
                                alt="${pkmJson.name} official artwork" class="pkm-artwork">
                        <p id="pkm-description">${pkmJson.description}</p>

                        <div class="pkm-data-container">
                                <h3>Data</h3>

                                <div class="data">
                                        <div class="height-container">
                                                <h4>Height</h4>
                                                <p class=""><span class="pkm-height">${pkmJson.height}</span> m</p>
                                        </div>
                                        <div class="weight-container">
                                                <h4>Weight</h4>
                                                <p><span class="pkm-weight">${pkmJson.weight}</span> kg</p>
                                        </div>
                                </div>
                        </div>
        `;

        return card;
};

const capitalizeName = (name) => {
        name.split(' ').map(word => {
                return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');

        return name.split('-').map(word => {
                return word.charAt(0).toUpperCase() + word.slice(1);
        }).join('-');
};

const createPokemon = async (pokemon) => {
        const pokemonDataArray = await fetchPokemon(pokemon);
        const pokemonData = pokemonDataArray[0];
        const pokemonDataSpecies = pokemonDataArray[1];
        const pkmJson = createPkmJson(pokemonData, pokemonDataSpecies);
        cardContainer.innerHTML = createCard(pkmJson);

        return pokemonData;
}