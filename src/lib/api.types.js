// Hér skilgreinum við sjálf hvernig gögn líta út—við getum fengið þetta frá
// Swagger skjali fyrir vefþjónustu, t.d.:
// https://lldev.thespacedevs.com/docs/#/launch/launch_list

/**
 * @typedef {object} LaunchStatus
 * @property {string} name Nafn á stöðu.
 * @property {string} description Lýsing á stöðu.
 * @property {string} abbrev Stutt nafn stöðu.
 */

/**
 * @typedef {object} LaunchMission
 * @property {string} name Nafn á geimferð.
 * @property {string} description Lýsing á geimferð.
 */

/**
 * @typedef {object} Launch
 * @property {string} id Auðkenni geimskots.
 * @property {string} name Nafn geimskots.
 * @property {LaunchStatus} status Staða geimskots (nafn).
 * @property {string} mission Nafn geimferðar.
 */

/**
 * @typedef {object} LaunchDetail
 * @property {string} name Nafn geimskots.
 * @property {LaunchStatus} status Staða geimskots.
 * @property {LaunchMission} mission Geimferð.
 * @property {string} window_start „Gluggi“ geimskots hefst, ISO 8601 form.
 * @property {string} window_end „Gluggi“ geimskots hefst, ISO 8601 form.
 * @property {string} image Hlekkur á mynd af geimskoti.
 */

/**
 * @typedef {object} LaunchSearchResults
 * @property {number} count Fjöldi niðurstaða.
 * @property {string | null} next Hlekkur á næstu síðu af niðurstöðum.
 * @property {string | null} previous Hlekkur á fyrri síðu af niðurstöðum.
 * @property {Launch[] | null} results Fylki af niðurstöðum.
 */

// Verðum að exporta einhverju til að fá ekki villu...
export default {};