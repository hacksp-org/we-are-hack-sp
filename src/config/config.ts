export const configUrl = {
    githubUrl: "https://github.com/HACK-SP-BR",
    donationUrl: "https://hcb.hackclub.com/donations/start/hack-sp",
    discordUrl: "https://discord.gg/PtK6ytU8ME",
    contactEmail: "contact@hacksp.org"
} as const;

// VITE_SUBSCRIBE_ENDPOINT may hold either the API origin or the full
// subscribers endpoint, so only its origin is reused to build the paths below.
const apiOrigin = new URL(import.meta.env.VITE_SUBSCRIBE_ENDPOINT).origin;

export const apiUrl = {
    subscribe: `${apiOrigin}/api/subscribers`,
    unsubscribe: `${apiOrigin}/api/subscribers/unsubscribe`
} as const;