console.log("Portfolio Loaded ✅");

function filterProjects(type) {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const category = card.getAttribute('data-category');
    card.style.display = (type === 'all' || category === type) ? 'block' : 'none';
  });
}

document.getElementById('darkToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
