const getBtn = document.querySelector('#get-btn');
const pokeName = document.querySelector('#poke-name');
const URL_PKM = 'https://pokeapi.co/api/v2/pokemon/';

getBtn.addEventListener('click', async () => {
        const pokemon = pokeName.value.toLowerCase().replace(/ /g, "-");
        const pokemonData = await fetchPokemon(pokemon);
        const pkm = pokemonData;
        console.log(pkm);
});

const fetchPokemon = async (pokemon) => {
        try {
                const dataPkm = await fetch(`${URL_PKM}${pokemon}`);
                const parsedDataPkm = await dataPkm.json();
                return parsedDataPkm;
        } catch (error) {
                console.error("Pokémon not found");
        }
}