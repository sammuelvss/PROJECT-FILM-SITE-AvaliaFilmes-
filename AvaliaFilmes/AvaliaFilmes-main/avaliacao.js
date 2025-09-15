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