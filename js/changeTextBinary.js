export default function changeTextBinary(){
  const list = document.querySelectorAll('.list-binary .list .item')
  const bitText = document.querySelector('.bitText')
  const button = document.querySelector('.buttonApplyBinary')
  let texto;
  if (list && bitText && button) {
    list.forEach((item, index) => {
      item.addEventListener('click', () => {
        list.forEach(item => item.children[0].style.color = 'white');
        texto = item.innerText;
        item.children[0].style.color = '#ffeb3b'
      })
    })
    button.addEventListener('click', () => {
      bitText.innerText = texto;
    })
  }
}

