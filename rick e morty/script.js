document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://rickandmortyapi.com/api/character';
    const characterList = document.getElementById('character-list');
    const searchInput = document.getElementById('search-input');
    let characters = []; // Armazena todos os personagens

    // Função para criar um item da lista de personagens com episódios
    const createCharacterItem = async (character) => {
        const li = document.createElement('li');
        
        // Adiciona imagem e informações básicas
        let episodesHtml = '';
        if (character.episode.length > 0) {
            const episodes = await Promise.all(character.episode.map(async (episodeUrl) => {
                const response = await fetch(episodeUrl);
                const episodeData = await response.json();
                return episodeData.name;
            }));
            episodesHtml = `<div class="episodes">
                <h4>Episodes:</h4>
                <ul>${episodes.map(ep => `<li>${ep}</li>`).join('')}</ul>
            </div>`;
        }

        li.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h3>${character.name}</h3>
            <p>Status: ${character.status}</p>
            <p>Species: ${character.species}</p>
            ${episodesHtml}
        `;
        return li;
    };

    // Função para exibir os personagens na lista
    const displayCharacters = (charactersToDisplay) => {
        characterList.innerHTML = ''; // Limpa a lista existente
        charactersToDisplay.forEach(async (character) => {
            const characterItem = await createCharacterItem(character);
            characterList.appendChild(characterItem);
        });
    };

    // Função para buscar e exibir personagens
    const fetchCharacters = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            characters = data.results; // Armazena todos os personagens
            
            // Exibe todos os personagens inicialmente
            displayCharacters(characters);
        } catch (error) {
            console.error('Error fetching characters:', error);
        }
    };

    // Função para filtrar personagens com base no texto de pesquisa
    const filterCharacters = () => {
        const query = searchInput.value.toLowerCase();
        const filteredCharacters = characters.filter(character => 
            character.name.toLowerCase().includes(query)
        );
        displayCharacters(filteredCharacters);
    };

    // Adiciona um ouvinte de evento para o campo de busca
    searchInput.addEventListener('input', filterCharacters);

    fetchCharacters();
});
