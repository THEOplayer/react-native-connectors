/**
 * Additional information about the logged-in user from the client database.
 *
 * @example
 * ["866d3a3c-aa87-4fe7-9066-8286641edd17",     // client-side user identifier (customerId)
 *  "cf895a00-a987-4501-ac00-6adb57014129",     // client-side user device identifier (Android_ID)
 *  "9530321a-d3d0-4bda-8704-1eb94a5940c3",     // client-side profile identifier of the logged-in user (profileId)
 *  "jsg75682-k276t-kw82-k8d5-8926sh6528j2",    // optional - SW device identifier for a situation where there are multiple device IDs in the client DB (typically a) HW ID - fill in i2, b) SW ID - fill in i4).
 *  "ef3c6dc72a26912f07f0e733d51b46c771d807bf"  // fingerprint of the user's email address
 * ]
 */
export type AdScriptI12n = string[];
