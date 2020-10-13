export default function accordionMenu() {
  const accordion = document.querySelectorAll('.accordion');
  const accordion2 = document.querySelectorAll('.accordion2');
  const menu = document.querySelector('.wrapper');
  const menu2 = document.querySelector('.header-menu')

  if (menu && accordion) {
    accordion.forEach(item => {
      item.addEventListener('click', () => {
        const hasClass = menu.classList.contains('show');
        menu.classList[hasClass ? 'remove' : 'add']('show');
        accordion.forEach(i => i.classList[hasClass ? 'remove' : 'add']('active'))
      });
    })
  }

  if (accordion2) {
    accordion2.forEach(item => {
      item.addEventListener('click', () => {
        const hasClass = menu2.classList.contains('show');
        menu2.classList[hasClass ? 'remove' : 'add']('show');
        accordion2.forEach(i => i.classList[hasClass ? 'remove' : 'add']('active'))

      });
    })
  }
}