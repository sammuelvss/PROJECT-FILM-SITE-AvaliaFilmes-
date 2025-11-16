

//--------------------------------------------------------------------------------------------------------------

const API_KEY = '701882ba979a87e85e64cdd5d735f17f'; 
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const movieContainer = document.getElementById('top-rated-container');

//  FUNÇÃO PRINCIPAL PARA BUSCAR OS FILMES 
async function getTopRatedMovies() {
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=pt-BR&page=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(data.results); 
        
        
        renderMovies(data.results);

    } catch (error) {
        console.error("Erro ao buscar os filmes:", error);
    }
}


function renderMovies(movies) {
    
    movieContainer.innerHTML = ''; 

    
    movies.forEach(movie => {
        
        const movieCard = document.createElement('div');
        
        
        movieCard.classList.add('top-rated-card'); 
        
        // Adiciona efeito neon 
        movieCard.classList.add('neon-hover'); 

        // Converte a nota (de 0-10) para estrelas (0-5)
        const rating = movie.vote_average / 2;
        const stars = '⭐'.repeat(Math.round(rating)); 

        /* * TRADUZINDO SEU HTML PARA O JAVASCRIPT
         * Note como usamos os dados: ${movie.poster_path}, ${movie.title}, etc.
        */
        movieCard.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="Pôster do filme ${movie.title}">
            
            <div class="top-rated-info">
                
                <h3>${movie.title}</h3>
                <p class="text-yellow-400 font-bold">${stars}</p> 
                
                <a href="assistir.html" class="inline-block bg-red-900 rounded-xl py-2 px-4 hover:bg-red-700 text-white font-bold border-transparent hover:scale-105 active:scale-95 neon-hover">
                    Saiba Onde Assistir
                </a>
            </div>
        `;
        
        // card pronto dentro do container
        movieContainer.appendChild(movieCard);
    });
}

// Chama a função assim que a página termina de carregar
window.onload = getTopRatedMovies;





//-----------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    
    const movieContainer = document.getElementById('movies-grid-container');
    
    const genreId = document.querySelector('[data-genre-id]')?.dataset.genreId;

    if (movieContainer && genreId) {
        getMoviesByGenre(genreId, movieContainer);
    }
    
});

// FUNÇÃO PARA BUSCAR FILMES POR GÊNERO 
async function getMoviesByGenre(genreId, container) {
    
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=pt-BR&page=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
  
        renderMovies(data.results, container);

    } catch (error) {
        console.error("Erro ao buscar os filmes:", error);
    }
}

function renderMovies(movies, container) {
    
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
    
    document.addEventListener('DOMContentLoaded', () => {
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
});
}
