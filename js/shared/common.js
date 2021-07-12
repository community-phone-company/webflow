/**
 * Here we write any code that should be run on every page of the website.
 */

/**
 * Send user ID and other information to Hotjar.
 */
HotjarIntegration.send({
    "Last Visit": new Date(Date.now()).toISOString()
});