export default () => {
  const handleClick = ({ target }) => {
    target.localName === 'span' && (target = target.parentNode);
    const list = target.querySelector('ul');

    if (list) {
      const isActived = target.classList.contains('active');
      dropItems.forEach(item => item.classList.remove('active'));
      target.classList[isActived ? 'remove' : 'add']('active');
      window.addEventListener('click', closeMenu);
    }
  }

  const closeMenu = ({ target }) => {
    const activeList = document.querySelector('li.active');
    const isListItem = target.classList.contains('drop-down');
    const childOfItem = activeList.contains(target);

    if (activeList && !isListItem && (target !== activeList || !childOfItem)) {
      activeList.classList.remove('active');
      window.removeEventListener('click', closeMenu);
    }
  }

  const dropItems = document.querySelectorAll('.drop-down');
  dropItems.forEach(item => item.addEventListener('click', handleClick));
}
