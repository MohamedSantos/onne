export default () => {
  const createBox = ({ dataset }) => {
    const container = document.createElement('div');
    container.innerText = dataset.text;
    container.classList.add('tooltip');
    if (window.innerWidth <= 800) {
      const link = document.createElement('a');
      link.innerText = 'See more'
      link.href = '#';
      container.appendChild(link);
    }
    document.body.appendChild(container);
    return container;
  }

  const position = (target, pageY, pageX, tooltip) => {
    if (window.innerWidth > 800) {
      return {
        top: `${pageY}px`,
        left: `${pageX + 20}px`
      };
    }

    let left = target.parentNode.offsetLeft + target.clientWidth;
    if (tooltip.clientWidth + left >= window.innerWidth) {
      left -= (tooltip.clientWidth + target.clientWidth + 15);
    }
    return {
      top: `${target.parentNode.offsetTop - target.clientHeight / 4}px`,
      left: `${left + 5}px`
    };
  }

  const handleMouseLeave = {
    handleEvent() {
      this.tooltip.remove();
      this.target.removeEventListener('mouseleave', handleMouseLeave);
      this.target.removeEventListener('mousemove', handleMouseMove);
    }
  }

  const handleMouseMove = {
    handleEvent({ target, pageX, pageY }) {
      const { top, left } = position(target, pageY, pageX, this.tooltip);
      this.tooltip.style.top = top;
      this.tooltip.style.left = left;
    }
  }

  const handleMouseOver = ({ target, pageY, pageX }) => {
    let tooltip = document.querySelector('.tooltip');
    if (tooltip) tooltip.remove();

    tooltip = createBox(target);
    const { top, left } = position(target, pageY, pageX, tooltip);

    tooltip.style.left = left;
    tooltip.style.top = top;

    handleMouseLeave.target = target;
    handleMouseLeave.tooltip = tooltip;
    target.addEventListener('mouseleave', handleMouseLeave);

    handleMouseMove.tooltip = tooltip;
    target.addEventListener('mousemove', handleMouseMove);
  }

  const tooltips = document.querySelectorAll('[data-text]');
  console.log(tooltips);
  tooltips.forEach(item => item.addEventListener('mouseover', handleMouseOver));
}
