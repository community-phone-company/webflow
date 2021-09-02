/**
 * @param {(() => void) | undefined} handler 
 */
const onBackButtonClicked = (handler) => {
    window.addEventListener(
        "popstate",
        () => {
            window.history.forward();
            setTimeout(() => {
                onBackButtonClicked(
                    handler
                );
            }, 50);

            if (handler) {
                handler();
            }
        },
        {
            once: true
        }
    );
    window.history.pushState(
        null,
        null,
        null
    );
}