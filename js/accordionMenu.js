export default function accordionMenu() {
  let accordion = document.querySelector('.accordion')
  let menu = document.querySelector('.menu-list')

  if (menu && accordion) {
    accordion.addEventListener('click', () => {
      if (menu.classList.contains('show')) {
        menu.classList.remove('show')
        accordion.classList.remove('active')
      } else {
        menu.classList.add('show');
        accordion.classList.add('active');
      }
    })
  }

}