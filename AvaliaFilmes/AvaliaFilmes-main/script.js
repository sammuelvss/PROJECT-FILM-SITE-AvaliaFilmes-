

//  CONFIGURAÇÃO GLOBAL 
const API_KEY = '701882ba979a87e85e64cdd5d735f17f'; 
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';


document.addEventListener('DOMContentLoaded', () => {
    
  // --- LÓGICA DE BUSCA (NOVA) ---
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const mainContent = document.getElementById('main-content'); 

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            const query = searchInput.value; 

            if (query) {
                
                mainContent.innerHTML = ''; 
                 
                  mainContent.innerHTML = `
                  <section class="mt-10 px-4 md:px-6">
                  <center><h2 class="section-title">Resultados para "${query}"</h2></center>

                  <div id="search-results-container" class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6 hover-scale-105">
                  </div>
                  </section> `;
                      

                    
                const resultsContainer = document.getElementById('search-results-container');
                fetchSearchResults(query, resultsContainer);
            }
        });
    }

    const topRatedContainer = document.getElementById('top-rated-container');
    
    if (topRatedContainer) {
        fetchTopRatedMovies(topRatedContainer);
    }

    
    const genreGridContainer = document.getElementById('movies-grid-container');
    const genreId = document.querySelector('[data-genre-id]')?.dataset.genreId;

    if (genreGridContainer && genreId) {
        fetchMoviesByGenre(genreId, genreGridContainer);
    }

    const catalogContainer = document.getElementById('catalog-grid-container');
    if (catalogContainer) {
        fetchPopularMovies(catalogContainer);
    }

    const libraryContainer = document.getElementById('library-grid-container');
    if (libraryContainer) {
        loadLibraryMovies();
    }
});


// FUNÇÕES DA PÁGINA PRINCIPAL (TOP RATED)
 

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
        movieCard.classList.add('neon-hover'); // Efeito neon
        movieCard.classList.add('flex-shrink-0'); // Impede o card de "encolher"
        movieCard.classList.add('w-64');
        
        const rating = movie.vote_average / 2; // Converte para 0-5 (ex: 4.1)
        const starString = generateStarRating(rating); // Chama a nova função
       
        movieCard.innerHTML = `
            
        <img src="${IMAGE_BASE_URL}${movie.poster_path}" 
        alt="Pôster de ${movie.title}"
        class="w-full object-cover flex-shrink-0"> 

        <div class="movie-info flex flex-col flex-1 p-4"></div>
            <div class="top-rated-info">
                <h3>${movie.title}</h3>
                
                <p class="text-yellow-400 font-bold" style="font-size: 1.25rem; letter-spacing: 0.1em;">
                    ${starString} 
                    <span class="text-white text-sm font-normal">
                        (${rating.toFixed(1)})
                    </span>
                </p> 
                <div class="py-4">
                <a href="assistir.html" class="inline-block bg-red-900 rounded-xl py-2 px-4 hover:bg-red-700 text-white font-bold border-transparent hover:scale-105 active:scale-95 neon-hover">
                    Saiba Onde Assistir
                </a>
                </div>
            </div>
        `;
        container.appendChild(movieCard);
    });
}


  //FUNÇÕES DAS PÁGINAS DE GÊNERO

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


function renderGenreMovies(movies, container, shouldAppend = false) {
    
    if (!shouldAppend) {
        container.innerHTML = ''; 
    }
    movies.forEach((movie, index) => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.classList.add('neon-hover'); 
        movieCard.classList.add('transition-transform'); 
        movieCard.classList.add('hover:scale-105'); 
        movieCard.classList.add('flex');    
        movieCard.classList.add('flex-col');   
        movieCard.dataset.movieId = movie.id;

        const cardIndex = index + 1; 
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

            <div class="movie-note-save-feedback text-green-400 text-xs mt-1" style="display: none;">
                Anotação salva!
            </div>
        </div>
        </div>
        </div>
        `;
        container.appendChild(movieCard);
    });
    
  
    initializeStarRatings();
}



function initializeStarRatings() {
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        
        const stars = card.querySelectorAll('.star-rating input');
        const resultText = card.querySelector('.rating-result');
        const movieId = card.dataset.movieId; // ID do filme
        
        const noteInput = card.querySelector('.movie-note-input');
        const noteSaveBtn = card.querySelector('.movie-note-save-btn');
        const noteFeedback = card.querySelector('.movie-note-save-feedback');
        
       
        const noteKey = `note_${movieId}`; 

        
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

                localStorage.setItem(movieId, ratingValue); // Salva a estrela
                localStorage.setItem(`time_${movieId}`, Date.now());
            });
        });

        
        //  Carrega a anotação salva ao carregar a página
        const savedNote = localStorage.getItem(noteKey);
        if (savedNote) {
            noteInput.value = savedNote;
        }

        //  Salva a anotação ao clicar no botão
        noteSaveBtn.addEventListener('click', () => {
            const noteText = noteInput.value;

            localStorage.setItem(noteKey, noteText); // Salva a anotação
            localStorage.setItem(`time_${movieId}`, Date.now());

            // Mostra o feedback "Anotação salva!" por 2 segundos
            noteFeedback.style.display = 'block';
            setTimeout(() => {
                noteFeedback.style.display = 'none';
            }, 2000);
        });
    });
}


function generateStarRating(rating) {
    const totalStars = 5;
    
    const roundedRating = Math.round(rating);

    const fullStars = roundedRating;
    const emptyStars = totalStars - fullStars;

    let starString = '★'.repeat(fullStars);      // Adiciona estrelas CHEIAS
    starString += '☆'.repeat(emptyStars);     // Adiciona estrelas VAZIAS

    return starString;
}

async function fetchPopularMovies(container) {
    // Usamos o endpoint 'popular' para o catálogo
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderCatalogMovies(data.results, container); // Chama o novo renderizador
    } catch (error) {
        console.error("Erro ao buscar filmes Populares:", error);
    }
}


function renderCatalogMovies(movies, container) {
    container.innerHTML = ''; // Limpa o container

    movies.forEach(movie => {
        // Cria um link <a> que envolve a imagem
        const movieLink = document.createElement('a');
        movieLink.href = "assistir.html"; // Link para sua página de detalhes
        
        movieLink.classList.add(
            'block',          
            'rounded-xl',     
            'overflow-hidden',
            'transition-all', 
            'duration-300',   
            'hover:scale-105' 
        );
        
        movieLink.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" 
                 alt="Pôster de ${movie.title}" 
                 class="w-full h-full object-cover">
        `;
        
        container.appendChild(movieLink);
    });
}


  //Busca filmes na API com base na query do usuário.
 
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


/* * ========================================
 * FUNÇÕES DA BIBLIOTECA (ORDEM DE SALVAMENTO)
 * ========================================
 */

// Adicione isso ao seu 'document.addEventListener' lá no topo do arquivo:
// if (document.getElementById('library-grid-container')) {
//     loadLibraryMovies();
// }

async function loadLibraryMovies() {
    const container = document.getElementById('library-grid-container');
    if (!container) return;

    // 1. Descobrir quais filmes estão salvos
    let savedMovies = [];

    // Percorre tudo no localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        // Se a chave for APENAS números (ex: "550"), é um ID de filme avaliado
        if (!isNaN(key) && !key.includes('_') && !key.includes('time')) {
            const movieId = key;
            // Pega o tempo salvo (ou 0 se for um filme antigo sem tempo salvo)
            const timestamp = localStorage.getItem(`time_${movieId}`) || 0;
            
            savedMovies.push({
                id: movieId,
                time: parseInt(timestamp)
            });
        }
    }

    // 2. ORDENAR: O mais recente (maior tempo) primeiro
    savedMovies.sort((a, b) => b.time - a.time);

    // 3. Buscar detalhes e desenhar (na ordem certa)
    container.innerHTML = ''; // Limpa antes de começar
    
    // Usamos um loop 'for...of' para manter a ordem da busca
    for (const item of savedMovies) {
        await fetchMovieById(item.id, container);
    }
    
    // Se não tiver filmes
    if (savedMovies.length === 0) {
        container.innerHTML = '<p class="text-white text-center col-span-full">Você ainda não avaliou nenhum filme.</p>';
    }
}

// Função auxiliar para buscar UM filme pelo ID
async function fetchMovieById(movieId, container) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`;
    
    try {
        const response = await fetch(url);
        const movie = await response.json();
        
        // Reusa sua função existente para criar o card!
        // Criamos um array de 1 item para aproveitar a função renderGenreMovies
        renderGenreMovies([movie], container, true); // O 'true' é um truque para NÃO limpar o container
        
    } catch (error) {
        console.error("Erro ao carregar filme da biblioteca:", error);
    }
}