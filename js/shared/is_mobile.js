const IS_MOBILE = (() => {
    const hasTouchScreen = navigator.maxTouchPoints > 0;
    return hasTouchScreen || isMobile.any;
})();