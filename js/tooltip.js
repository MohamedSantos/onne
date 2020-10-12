export default () => {
  const createBox = ({ dataset }) => {
    const container = document.createElement('div');
    container.innerText = dataset.text;
    container.classList.add('tooltip');
    document.body.appendChild(container);
    return container;
  }

  const handleMouseLeave = {
    handleEvent() {
      this.tooltip.remove();
      this.target.removeEventListener('mouseleave', handleMouseLeave);
      this.target.removeEventListener('mousemove', handleMouseMove);
    }
  }

  const handleMouseMove = {
    handleEvent({ pageX, pageY }) {
      this.tooltip.style.top = `${pageY}px`;
      this.tooltip.style.left = `${pageX + 20}px`;
    }
  }

  const handleMouseOver = ({ target, pageY, pageX }) => {
    if (window.innerWidth > 600) {
      const tooltip = createBox(target);
      tooltip.style.top = `${pageY}px`;
      tooltip.style.left = `${pageX + 20}px`;

      handleMouseLeave.target = target;
      handleMouseLeave.tooltip = tooltip;
      target.addEventListener('mouseleave', handleMouseLeave);

      handleMouseMove.tooltip = tooltip;
      target.addEventListener('mousemove', handleMouseMove);
    }
  }

  const tooltips = document.querySelectorAll('[data-text]');
  tooltips.forEach(item => item.addEventListener('mouseover', handleMouseOver));
}
