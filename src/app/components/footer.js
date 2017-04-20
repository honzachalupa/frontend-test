const footer = (container) => {
    let windowScrollable;
    let windowScrolledBottom;

    adjustFooter();

    window.addEventListener('resize', () => {
        adjustFooter();
    });

    window.addEventListener('scroll', () => {
        adjustFooter();
    });

    function adjustFooter() {
        const classList = container.classList;
        let visibleBottom = false;
        let visibleScrolling = false;

        windowScrollable = isWindowScrollable();
        windowScrolledBottom = isWindowScrolledBottom();

        if (windowScrollable) {
            if (windowScrolledBottom) {
                visibleScrolling = true;
            } else {
                visibleBottom = false;
            }
        } else {
            visibleBottom = true;
        }

        if (visibleScrolling) {
            container.classList.add('visible-bottom');
        } else if (visibleBottom) {
            container.classList.add('visible-scrolling');
        } else {
            if (container.classList.contains('visible-bottom')) {
                container.classList.remove('visible-bottom');
            }
            if (container.classList.contains('visible-scrolling')) {
                container.classList.remove('visible-scrolling');
            }
        }

        adjustFooterWidth();
    }

    function adjustFooterWidth() {
        const headerWidth = document.querySelector('.header').offsetWidth;
        container.style.width = `${headerWidth}px`;
    }

    function isWindowScrollable() {
        return (window.innerHeight <= document.body.clientHeight);
    }

    function isWindowScrolledBottom() {
        const scrolledDistance = window.pageYOffset;
        const scrollableDistance = document.documentElement.offsetHeight - window.innerHeight;

        return (scrolledDistance === scrollableDistance);
    }
};

export default footer;
