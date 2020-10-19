import accordionMenu from './accordionMenu.js';
import menuDropdown from './menuDropdown.js';
import tooltip from './tooltip.js';

accordionMenu();
menuDropdown();
window.addEventListener('load', () => {
    console.log('teste');
    setTimeout(tooltip, 1000);
});

function onlynumber(event) {
    var theEvent = event || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /^[0-9.,]+$/;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}
