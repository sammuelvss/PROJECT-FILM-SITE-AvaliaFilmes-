

//  CONFIGURAÇÃO GLOBAL 
const API_KEY = '701882ba979a87e85e64cdd5d735f17f'; 
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';


document.addEventListener('DOMContentLoaded', () => {
    
    const topRatedContainer = document.getElementById('top-rated-container');
    
    if (topRatedContainer) {
        fetchTopRatedMovies(topRatedContainer);
    }

    
    const genreGridContainer = document.getElementById('movies-grid-container');
    const genreId = document.querySelector('[data-genre-id]')?.dataset.genreId;

    if (genreGridContainer && genreId) {
        fetchMoviesByGenre(genreId, genreGridContainer);
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

        
        const rating = movie.vote_average / 2; // Converte para 0-5 (ex: 4.1)
        const starString = generateStarRating(rating); // Chama a nova função
        // --- FIM DA NOVA LÓGICA ---

        movieCard.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="Pôster do filme ${movie.title}">
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


function renderGenreMovies(movies, container) {
    container.innerHTML = ''; 

    movies.forEach((movie, index) => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        
        const cardIndex = index + 1; 
        movieCard.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="Pôster de ${movie.title}">
            <div class="movie-info">
                <h3 class="text-white text-lg font-bold mb-2 truncate" title="${movie.title}">
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

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const ratingValue = star.value;
                const starText = ratingValue > 1 ? 'estrelas' : 'estrela';
                resultText.textContent = `Sua avaliação: ${ratingValue} ${starText}.`;
            });
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