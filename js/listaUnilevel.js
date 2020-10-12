export default function listUnilevel(){
  const more = document.querySelectorAll('.div-data > div > div:last-child')
  const li = document.querySelectorAll('.outside-li')
  more.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (li[index].classList.contains('active')) {
        li[index].classList.remove('active')

        more[index].classList.remove('active')

      } else {
        li[index].classList.add('active')
        more[index].classList.add('active')
      }

    })
  })
}
