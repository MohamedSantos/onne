export default () => {
  const createBox = ({ dataset }) => {
    const container = document.createElement('div');
    container.innerText = dataset.text;
    container.classList.add('tooltip');
    document.body.appendChild(container);
    return container;
  }

  const position = (target, pageY, pageX) => {
    if (window.innerWidth > 600) {
      return {
        top: `${pageY}px`,
        left: `${pageX + 20}px`
      };
    }
    return {
      top: `${target.parentNode.offsetTop}px`,
      left: `${target.parentNode.offsetLeft + target.clientWidth}px`
    }
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
      const { top, left } = position(target, pageY, pageX);
      this.tooltip.style.top = top;
      this.tooltip.style.left = left;
    }
  }

  const handleMouseOver = ({ target, pageY, pageX }) => {
    const { top, left } = position(target, pageY, pageX);
    const tooltip = createBox(target);
    tooltip.style.top = top;
    tooltip.style.left = left;

    handleMouseLeave.target = target;
    handleMouseLeave.tooltip = tooltip;
    target.addEventListener('mouseleave', handleMouseLeave);

    handleMouseMove.tooltip = tooltip;
    target.addEventListener('mousemove', handleMouseMove);
  }

  const tooltips = document.querySelectorAll('[data-text]');
  tooltips.forEach(item => item.addEventListener('mouseover', handleMouseOver));
}
