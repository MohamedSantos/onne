export default function accordionMenu() {
  let accordion = document.querySelector('.accordion')
  let menu = document.querySelector('.menu-list')

  accordion.addEventListener('click', () => {
    console.log(menu.classList.contains('show'))
    if (menu.classList.contains('show')) {
      menu.classList.remove('show')
      accordion.classList.remove('active')
    } else {
      menu.classList.add('show');
      accordion.classList.add('active');
    }
  })
}