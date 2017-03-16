const footer = (footer) => {
    let windowScrollable;
    let windowScrolledBottom;

    adjustFooter();

    addEventListeners(window, 'resize scroll',
        adjustFooter()
    );

    function adjustFooter() {
        const classList = footer.classList;
        const customClass = 'visible';
        let visible;

        windowScrollable = isWindowScrollable();
        windowScrolledBottom = isWindowScrolledBottom();

        if (windowScrollable) {
            if (windowScrolledBottom) {
                visible = true;
            } else {
                visible = false;
            }
        } else {
            visible = true;
        }

        if (visible) {
            footer.classList.add(customClass);
        } else if (footer.classList.contains(customClass)) {
            footer.classList.remove(customClass);
        }

        adjustFooterWidth();
    }

    function adjustFooterWidth() {
        const headerWidth = document.querySelector('.header').offsetWidth;
        footer.style.width = `${headerWidth}px`;
    }

    function isWindowScrollable() {
        return (window.innerHeight <= document.body.clientHeight);
    }

    function isWindowScrolledBottom() {
        const scrolledDistance = window.pageYOffset;
        const scrollableDistance = document.documentElement.offsetHeight - window.innerHeight;

        return (scrolledDistance === scrollableDistance);
    }

    function addEventListeners(element, triggers, func) {
        triggers.split(' ').forEach(trigger => element.addEventListener(trigger, func, false));
    }
};

export default footer;
