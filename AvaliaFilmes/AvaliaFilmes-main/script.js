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
