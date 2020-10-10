export default function accordionMenu() {
  const accordion = document.querySelector('.accordion');
  const menu = document.querySelector('.wrapper');

  if (menu && accordion) {
    accordion.addEventListener('click', () => {
      const hasClass = menu.classList.contains('show');
      menu.classList[hasClass ? 'remove' : 'add']('show');
      accordion.classList[hasClass ? 'remove' : 'add']('active');
    });
  }
}