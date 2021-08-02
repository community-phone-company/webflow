/**
 * Here we write any code that should be run on every page of the website.
 */

/**
 * Block printing in console log on production domain.
 */
logger.setBlockedDomains([
    //"www.communityphone.org"
]);

/**
 * Send user ID and other information to Hotjar.
 */
HotjarIntegration.send({
    "Last Visit": new Date(Date.now()).toISOString()
});