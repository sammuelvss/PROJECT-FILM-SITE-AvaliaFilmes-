/* === ARQUIVO SCRIPT.JS COMPLETO === */

/* --- 1. CONFIGURAÇÕES GLOBAIS --- */
const API_KEY = '701882ba979a87e85e64cdd5d735f17f'; // Sua chave
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

/* --- 2. FUNÇÃO HELPER DE ESTRELAS --- */
/**
 * Cria uma string de estrelas (cheias e vazias) 
 * arredondando para o inteiro mais próximo.
 */
function generateStarRating(rating) {
    const totalStars = 5;
    const roundedRating = Math.round(rating);
    const fullStars = roundedRating;
    const emptyStars = totalStars - fullStars;
    let starString = '★'.repeat(fullStars);
    starString += '☆'.repeat(emptyStars);
    return starString;
}

/* --- 3. PONTO DE ENTRADA PRINCIPAL --- */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DA BUSCA ---
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const mainContent = document.getElementById('main-content'); // Pega o <main>

    if (searchForm && mainContent) { // Garante que ambos existam
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            const query = searchInput.value; 

            if (query) {
                // Limpa o conteúdo principal
                mainContent.innerHTML = `
                    <section class="px-4 md:px-6 mt-10">
                        <h2 class="text-2xl font-bold text-center mb-4">Resultados para "${query}"</h2>
                        <div id="search-results-container" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                            </div>
                    </section>
                `;
                
                const resultsContainer = document.getElementById('search-results-container');
                fetchSearchResults(query, resultsContainer);
            }
        });
    }

    // --- LÓGICA DA PÁGINA PRINCIPAL (TOP RATED) ---
    const topRatedContainer = document.getElementById('top-rated-container');
    if (topRatedContainer) {
        fetchTopRatedMovies(topRatedContainer);
    }
    
    // --- LÓGICA DA PÁGINA PRINCIPAL (CATÁLOGO) ---
    const catalogContainer = document.getElementById('catalog-grid-container');
    if (catalogContainer) {
        fetchPopularMovies(catalogContainer);
    }

    // --- LÓGICA DAS PÁGINAS DE GÊNERO ---
    const genreGridContainer = document.getElementById('movies-grid-container');
    const genreId = document.querySelector('[data-genre-id]')?.dataset.genreId;
    if (genreGridContainer && genreId) {
        fetchMoviesByGenre(genreId, genreGridContainer);
    }
    
    // --- LÓGICA DA PÁGINA DA BIBLIOTECA ---
    const libraryContainer = document.getElementById('library-grid-container');
    if (libraryContainer) {
        loadMyLibrary(libraryContainer); // Chama a nova função
    }
});


/* --- 4. FUNÇÕES DE BUSCA (FETCH) E RENDERIZAÇÃO --- */

// --- TOP RATED (PÁGINA PRINCIPAL) ---
async function fetchTopRatedMovies(container) {
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=pt-BR&page=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderTopRatedMovies(data.results, container);
    } catch (error) {
        console.error("Erro ao buscar filmes Top Rated:", error);
    }
}

function renderTopRatedMovies(movies, container) {
    container.innerHTML = ''; 
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('top-rated-card'); 
        movieCard.classList.add('neon-hover'); 
        movieCard.classList.add('flex-shrink-0'); // Impede o card de encolher
        movieCard.classList.add('w-64');          // Largura fixa para scroll
        
        const rating = movie.vote_average / 2;
        const starString = generateStarRating(rating); 

        movieCard.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="Pôster de ${movie.title}">
            <div class="top-rated-info">
                <h3>${movie.title}</h3>
                <p class="text-yellow-400 font-bold" style="font-size: 1.25rem; letter-spacing: 0.1em;">
                    ${starString} 
                    <span class="text-white text-sm font-normal">
                        (${rating.toFixed(1)})
                    </span>
                </p> 
                <a href="assistir.html" class="inline-block bg-red-900 rounded-xl py-2 px-4 hover:bg-red-700 text-white font-bold border-transparent hover:scale-105 active:scale-95 neon-hover">
                    Saiba Onde Assistir
                </a>
            </div>
        `;
        container.appendChild(movieCard);
    });
}

// --- CATÁLOGO (PÁGINA PRINCIPAL) ---
async function fetchPopularMovies(container) {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderCatalogMovies(data.results, container); 
    } catch (error) {
        console.error("Erro ao buscar filmes Populares:", error);
    }
}

function renderCatalogMovies(movies, container) {
    container.innerHTML = ''; 
    movies.forEach(movie => {
        const movieLink = document.createElement('a');
        movieLink.href = "#"; // Idealmente, link para uma página de detalhes
        movieLink.classList.add('block', 'rounded-xl', 'overflow-hidden', 'transition-all', 'duration-300', 'hover:scale-105');
        movieLink.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" 
                 alt="Pôster de ${movie.title}" 
                 class="w-full h-full object-cover">
        `;
        container.appendChild(movieLink);
    });
}

// --- GÊNEROS, BUSCA & BIBLIOTECA (Renderizador Principal) ---
async function fetchMoviesByGenre(genreId, container) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=pt-BR&page=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderGenreMovies(data.results, container);
    } catch (error) {
        console.error("Erro ao buscar filmes de Gênero:", error);
    }
}

async function fetchSearchResults(query, container) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=pt-BR&page=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderGenreMovies(data.results, container); // Reutiliza o renderizador de gênero
    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
    }
}

function renderGenreMovies(movies, container) {
    container.innerHTML = ''; 
    if (movies.length === 0) {
        container.innerHTML = '<p class="text-center col-span-full">Nenhum filme encontrado.</p>';
        return;
    }

    movies.forEach((movie, index) => {
        const movieCard = document.createElement('div');
        // Classes do Card
        movieCard.classList.add('movie-card'); // Sua classe de .style.css
        movieCard.classList.add('neon-hover', 'transition-transform', 'hover:scale-105');
        movieCard.classList.add('flex', 'flex-col'); // Para alinhar o botão no fundo
        movieCard.dataset.movieId = movie.id; // Para salvar no localStorage
        
        const cardIndex = index + 1; 

        movieCard.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" 
                 alt="Pôster de ${movie.title}"
                 class="w-full object-cover flex-shrink-0"> 
            
            <div class="movie-info flex flex-col flex-1 p-4">
                
                <div> <h3 class="text-white text-lg font-bold mb-2" title="${movie.title}">
                        ${movie.title}
                    </h3>
                    <div class="star-rating">
                        <input type="radio" name="rating-${cardIndex}" id="r${cardIndex}-star5" value="5"><label for="r${cardIndex}-star5">★</label>
                        <input type="radio" name="rating-${cardIndex}" id="r${cardIndex}-star4" value="4"><label for="r${cardIndex}-star4">★</label>
                        <input type="radio" name="rating-${cardIndex}" id="r${cardIndex}-star3" value="3"><label for="r${cardIndex}-star3">★</label>
                        <input type="radio" name="rating-${cardIndex}" id="r${cardIndex}-star2" value="2"><label for="r${cardIndex}-star2">★</label>
                        <input type="radio" name="rating-${cardIndex}" id="r${cardIndex}-star1" value="1"><label for="r${cardIndex}-star1">★</label>
                    </div>
                    <div class="rating-result">Nenhuma avaliação ainda.</div>
                </div>

                <div class="mt-4 mt-auto text-center"> 
                    <textarea 
                        class="movie-note-input w-full bg-gray-700 text-white p-2 rounded text-sm resize-none" 
                        rows="2" 
                        placeholder="Sua anotação sobre o filme..."></textarea>
                    
                    <button 
                        class="movie-note-save-btn bg-yellow-500 text-black text-xs font-bold py-1 px-2 rounded mt-1 hover:bg-yellow-400 transition-colors">
                        Salvar Anotação
                    </button>
                    
                    <div class="movie-note-save-feedback text-green-400 text-xs mt-1" style="display: none;">
                        Anotação salva!
                    </div>
                </div>
            </div>
        `;
        container.appendChild(movieCard);
    });
    
    // ATIVA as estrelas e anotações DEPOIS que os cards são criados
    initializeStarRatings();
}


// --- LÓGICA DAS ESTRELAS E ANOTAÇÕES (localStorage) ---
function initializeStarRatings() {
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        const stars = card.querySelectorAll('.star-rating input');
        const resultText = card.querySelector('.rating-result');
        const movieId = card.dataset.movieId; 
        
        const noteInput = card.querySelector('.movie-note-input');
        const noteSaveBtn = card.querySelector('.movie-note-save-btn');
        const noteFeedback = card.querySelector('.movie-note-save-feedback');
        const noteKey = `note_${movieId}`; 

        // 1. CARREGAR AVALIAÇÃO (ESTRELAS)
        const savedRating = localStorage.getItem(movieId); 
        if (savedRating) {
            const starText = savedRating > 1 ? 'estrelas' : 'estrela';
            resultText.textContent = `Sua avaliação: ${savedRating} ${starText}.`;
            const savedRadio = card.querySelector(`input[value="${savedRating}"]`);
            if (savedRadio) {
                savedRadio.checked = true;
            }
        }
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const ratingValue = star.value;
                const starText = ratingValue > 1 ? 'estrelas' : 'estrela';
                resultText.textContent = `Sua avaliação: ${ratingValue} ${starText}.`;
                localStorage.setItem(movieId, ratingValue);
            });
        });

        // 2. CARREGAR ANOTAÇÃO
        const savedNote = localStorage.getItem(noteKey);
        if (savedNote) {
            noteInput.value = savedNote;
        }
        noteSaveBtn.addEventListener('click', () => {
            const noteText = noteInput.value;
            localStorage.setItem(noteKey, noteText); 
            noteFeedback.style.display = 'block';
            setTimeout(() => {
                noteFeedback.style.display = 'none';
            }, 2000);
        });
    });
}


// --- FUNÇÕES DA BIBLIOTECA (NOVAS) ---
async function loadMyLibrary(container) {
    const ratedMovieIds = [];

    // 1. Vasculha o localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Pega chaves que são apenas números (IDs de filmes)
        if (key && !isNaN(key)) {
            ratedMovieIds.push(key);
        }
    }

    // 2. Verifica se encontrou filmes
    if (ratedMovieIds.length === 0) {
        container.innerHTML = '<p class="text-center col-span-full">Você ainda não avaliou nenhum filme. Comece a avaliar nas páginas de gênero!</p>';
        return;
    }

    // 3. Busca CADA filme individualmente
    try {
        const moviePromises = ratedMovieIds.map(id => fetchMovieById(id));
        const movies = await Promise.all(moviePromises);
        const validMovies = movies.filter(movie => movie && movie.id); // Filtra erros

        // 4. Renderiza os filmes
        renderGenreMovies(validMovies, container);

    } catch (error) {
        console.error("Erro ao carregar a biblioteca:", error);
        container.innerHTML = '<p class="text-center col-span-full">Erro ao carregar sua biblioteca.</p>';
    }
}


 // Helper: Busca um único filme pelo ID.
 
async function fetchMovieById(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`;
    try {
        const response = await fetch(url);
        if (!response.ok) return null; 
        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar filme ${movieId}:`, error);
        return null; 
    }
}