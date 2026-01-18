// === CONFIGURAÇÃO GLOBAL ===
const API_KEY = '701882ba979a87e85e64cdd5d735f17f'; 
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// === PONTO DE ENTRADA PRINCIPAL ===
document.addEventListener('DOMContentLoaded', () => {

    // 1. Lógica de Busca
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const mainContent = document.getElementById('main-content');

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const query = searchInput.value;

            if (query) {
                mainContent.innerHTML = `
                    <section class="mt-10 px-4 md:px-6">
                        <h2 class="section-title text-center mb-6">Resultados para "${query}"</h2>
                        <div id="search-results-container" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                        </div>
                    </section> 
                `;
                const resultsContainer = document.getElementById('search-results-container');
                fetchSearchResults(query, resultsContainer);
            }
        });
    }

    // 2. Carregar Top Rated
    const topRatedContainer = document.getElementById('top-rated-container');
    if (topRatedContainer) {
        fetchTopRatedMovies(topRatedContainer);
    }

    // 3. Carregar Gêneros
    const genreGridContainer = document.getElementById('movies-grid-container');
    const genreId = document.querySelector('[data-genre-id]')?.dataset.genreId;
    if (genreGridContainer && genreId) {
        fetchMoviesByGenre(genreId, genreGridContainer);
    }

    // 4. Carregar Catálogo (Home)
    const catalogContainer = document.getElementById('catalog-grid-container');
    if (catalogContainer) {
        fetchPopularMovies(catalogContainer);
    }

    // 5. Carregar Biblioteca
    const libraryContainer = document.getElementById('library-grid-container');
    if (libraryContainer) {
        loadLibraryMovies();
    }

    // --- LÓGICA DO CARROSSEL ---
    const container = document.getElementById('top-rated-container');
    const prevBtn = document.getElementById('left-btn');
    const nextBtn = document.getElementById('right-btn');

    if (container && prevBtn && nextBtn) {
        // Define quanto o carrossel vai pular a cada clique (ex: 300px)
        const scrollAmount = 300;

        nextBtn.addEventListener('click', () => {
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        prevBtn.addEventListener('click', () => {
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
    }
});


/* * ========================================
 * FUNÇÕES: TOP RATED (Melhores Avaliações)
 * ========================================
 */
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
        movieCard.classList.add('flex-shrink-0'); 
        movieCard.classList.add('w-64');
        
        const rating = movie.vote_average / 2; 
        const starString = generateStarRating(rating); 
       
        movieCard.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" 
                 alt="Pôster de ${movie.title}"
                 class="w-full object-cover flex-shrink-0 rounded-t-xl"> 

            <div class="movie-info flex flex-col flex-1 p-4">
                <div class="top-rated-info h-full flex flex-col justify-between">
                    <div>
                        <h3 class="text-white font-bold text-lg mb-1">${movie.title}</h3>
                        <p class="text-yellow-400 font-bold" style="font-size: 1.25rem; letter-spacing: 0.1em;">
                            ${starString} 
                            <span class="text-white text-sm font-normal">(${rating.toFixed(1)})</span>
                        </p> 
                    </div>
                    <div class="mt-4">
                        <a href="assistir.html" class="inline-block w-full text-center bg-red-900 rounded-xl py-2 px-4 hover:bg-red-700 text-white font-bold border-transparent hover:scale-105 active:scale-95 neon-hover transition-transform">
                            Saiba Onde Assistir
                        </a>
                    </div>
                </div>
            </div> 
        `;
        container.appendChild(movieCard);
    });
}


/* * ========================================
 * FUNÇÕES: GÊNEROS E BUSCA (Cards com Anotação)
 * ========================================
 */
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
        renderGenreMovies(data.results, container);
    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
    }
}

// Função principal de renderizar card (usada em Gênero, Busca e Biblioteca)
function renderGenreMovies(movies, container, shouldAppend = false) {
    if (!shouldAppend) {
        container.innerHTML = ''; 
    }

    movies.forEach((movie, index) => {
        const movieCard = document.createElement('div');
        // Classes do Card
        movieCard.classList.add('movie-card', 'neon-hover', 'transition-transform', 'hover:scale-105', 'flex', 'flex-col', 'bg-gray-800/1', 'rounded-xll', 'overflow-hidden');
        movieCard.dataset.movieId = movie.id;

        const cardIndex = index + 1; // Para IDs únicos das estrelas
        
        movieCard.innerHTML = `
               <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="Pôster de ${movie.title}">



        <div class="movie-info flex flex-col flex-1 p-4">

        <div class="mt-4 mt-auto">

            <h3 class="text-white text-lg font-bold mb-2 text-center" title="${movie.title}">

                ${movie.title}

            </h3>

            <div class="star-rating ">

                <input type="radio" name="rating-${cardIndex}" id="r${cardIndex}-star5" value="5"><label for="r${cardIndex}-star5">★</label>

                <input type="radio" name="rating-${cardIndex}" id="r${cardIndex}-star4" value="4"><label for="r${cardIndex}-star4">★</label>

                <input type="radio" name="rating-${cardIndex}" id="r${cardIndex}-star3" value="3"><label for="r${cardIndex}-star3">★</label>

                <input type="radio" name="rating-${cardIndex}" id="r${cardIndex}-star2" value="2"><label for="r${cardIndex}-star2">★</label>

                <input type="radio" name="rating-${cardIndex}" id="r${cardIndex}-star1" value="1"><label for="r${cardIndex}-star1">★</label>

            </div>

            <div class="rating-result">Nenhuma avaliação ainda.</div>

        </div>

        <div class="bg-gray-500/10 rounded-full p-7">

        <div class="mt-4 mt-auto text-center"> <textarea
                class="movie-note-input w-full bg-gray-400/10 neon-hover transition-transform text-white p-1 rounded-xl text-sm resize-none border-none"
                rows="3"
                placeholder="Sua anotação sobre o filme..."></textarea>

            <button
                class="movie-note-save-btn inline-block bg-red-900 rounded-xl items-end py-2 px-4 hover:bg-red-700 text-white font-bold border-transparent hover:scale-105 active:scale-95 neon-hover ">
                Salvar Anotação
            </button>

            <button
            class="movie-remove-btn inline-block bg-red-900 rounded-xl items-end py-2 px-4 hover:bg-red-700 text-white font-bold border-transparent hover:scale-105 active:scale-95 neon-hover ">
            X
            </button>

            <div class="movie-note-save-feedback text-green-400 text-xs mt-1" style="display: none;">
                Anotação salva!
            </div>

        </div>
        </div>
        </div>
        `;
        container.appendChild(movieCard);
    });
    
    // Ativa a lógica dos botões
    initializeStarRatings();
}

// Lógica de Interação (Salvar, Remover, Carregar)
function initializeStarRatings() {
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        const stars = card.querySelectorAll('.star-rating input');
        const resultText = card.querySelector('.rating-result');
        const movieId = card.dataset.movieId;
        
        const noteInput = card.querySelector('.movie-note-input');
        const noteSaveBtn = card.querySelector('.movie-note-save-btn');
        const noteFeedback = card.querySelector('.movie-note-save-feedback');
        const removeBtn = card.querySelector('.movie-remove-btn');
       
        const noteKey = `note_${movieId}`; 
        const timeKey = `time_${movieId}`;
        
        // 1. CARREGAR DADOS SALVOS
        const savedRating = localStorage.getItem(movieId); 
        if (savedRating) {
            const starText = savedRating > 1 ? 'estrelas' : 'estrela';
            resultText.textContent = `Sua avaliação: ${savedRating} ${starText}.`;
            // Encontra o input correto e marca ele
            const savedRadio = card.querySelector(`input[value="${savedRating}"]`);
            if (savedRadio) savedRadio.checked = true;
        }

        const savedNote = localStorage.getItem(noteKey);
        if (savedNote) {
            noteInput.value = savedNote;
        }

        // 2. EVENTO: CLICAR NA ESTRELA
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const ratingValue = star.value;
                const starText = ratingValue > 1 ? 'estrelas' : 'estrela';
                resultText.textContent = `Sua avaliação: ${ratingValue} ${starText}.`;

                localStorage.setItem(movieId, ratingValue);
                localStorage.setItem(timeKey, Date.now());
            });
        });

        // 3. EVENTO: CLICAR EM SALVAR ANOTAÇÃO
        if (noteSaveBtn) {
            noteSaveBtn.addEventListener('click', () => {
                const noteText = noteInput.value;
                localStorage.setItem(noteKey, noteText);
                localStorage.setItem(timeKey, Date.now());

                noteFeedback.style.display = 'block';
                setTimeout(() => {noteFeedback.style.display = 'none';}, 2000);
            });
        }

        // 4. EVENTO: CLICAR EM REMOVER 
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                
                
                    // Remove dados
                    localStorage.removeItem(movieId);    
                    localStorage.removeItem(noteKey);    
                    localStorage.removeItem(timeKey);   
                    
                    // Reseta visual
                    stars.forEach(s => s.checked = false);  
                    resultText.textContent = 'Nenhuma avaliação ainda.'; 
                    noteInput.value = '';                  
                
                    // Se estiver na tela de Biblioteca, remove o card
                    const libraryContainer = document.getElementById('library-grid-container');
                    if (libraryContainer) {
                        card.remove(); 
                        if (libraryContainer.children.length === 0) {
                            libraryContainer.innerHTML = '<p class="text-center text-gray-400 col-span-full mt-10">Você ainda não avaliou nenhum filme.</p>';                       
                    }
                }
            });
        }
    });
}


/* * ========================================
 * FUNÇÕES: CATÁLOGO (Página Principal)
 * ========================================
 */
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
        movieLink.href = "assistir.html"; 
        movieLink.classList.add('block', 'rounded-xl', 'overflow-hidden', 'transition-all', 'duration-300', 'hover:scale-105');
        
        movieLink.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" 
                 alt="Pôster de ${movie.title}" 
                 class="w-full h-full object-cover">
        `;
        container.appendChild(movieLink);
    });
}


/* * ========================================
 * FUNÇÕES: BIBLIOTECA
 * ========================================
 */
async function loadLibraryMovies() {
    const container = document.getElementById('library-grid-container');
    if (!container) return;

    let savedMovies = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!isNaN(key) && !key.includes('_') && !key.includes('time')) {
            const movieId = key;
            const timestamp = localStorage.getItem(`time_${movieId}`) || 0;
            savedMovies.push({
                id: movieId,
                time: parseInt(timestamp)
            });
        }
    }

    if (savedMovies.length === 0) {
        container.innerHTML = '<p class="text-white text-center col-span-full mt-10">Você ainda não avaliou nenhum filme.</p>';
        return;
    }

    // Ordenar por mais recente
    savedMovies.sort((a, b) => b.time - a.time);

    container.innerHTML = ''; 
    
    // Busca e renderiza na ordem
    for (const item of savedMovies) {
        const movieData = await fetchMovieById(item.id);
        if (movieData) {
            // 'true' impede que renderGenreMovies limpe o container a cada iteração
            renderGenreMovies([movieData], container, true);
        }
    }
}


/* * ========================================
 * UTILITÁRIOS
 * ========================================
 */

// Função ÚNICA para buscar filme por ID (Retorna JSON)
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

function generateStarRating(rating) {
    const totalStars = 5;
    const roundedRating = Math.round(rating);
    const fullStars = roundedRating;
    const emptyStars = totalStars - fullStars;
    let starString = '★'.repeat(fullStars);     
    starString += '☆'.repeat(emptyStars);    
    return starString;
}