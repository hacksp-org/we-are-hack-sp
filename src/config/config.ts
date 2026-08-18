export const configUrl = {
    githubUrl: "https://github.com/hacksp-org",
    donationUrl: "https://hcb.hackclub.com/donations/start/hack-sp",
    discordUrl: "https://discord.gg/kN4aTeVezX",
    contactEmail: "contato@hacksp.org"
} as const;

// VITE_SUBSCRIBE_ENDPOINT may hold either the API origin or the full
// subscribers endpoint, so only its origin is reused to build the paths below.
const apiOrigin = new URL(import.meta.env.VITE_SUBSCRIBE_ENDPOINT).origin;

export const apiUrl = {
    unsubscribe: `${apiOrigin}/api/subscribers/unsubscribe`,
    registrations: `${apiOrigin}/api/registrations`,
    verifyEmail: (id: string) => `${apiOrigin}/api/registrations/${id}/verify-email`,
    resendCode: (id: string) => `${apiOrigin}/api/registrations/${id}/resend-code`,
    dependents: (guardianId: string) => `${apiOrigin}/api/registrations/${guardianId}/dependents`
} as const;