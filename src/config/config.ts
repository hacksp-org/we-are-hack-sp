export const configUrl = {
    githubUrl: "https://github.com/hacksp-org",
    donationUrl: "https://hcb.hackclub.com/donations/start/hack-sp",
    discordUrl: "https://discord.gg/kN4aTeVezX",
    contactEmail: "contato@hacksp.org",
    // Onde quem já está inscrito entra. Entrar com o código enviado por
    // e-mail também marca o e-mail como verificado, e é por isso que a
    // mensagem de e-mail duplicado aponta para cá.
    accountUrl: "https://account.hacksp.org"
} as const;

// VITE_SUBSCRIBE_ENDPOINT may hold either the API origin or the full
// subscribers endpoint, so only its origin is reused to build the paths below.
const apiOrigin = new URL(import.meta.env.VITE_SUBSCRIBE_ENDPOINT).origin;

export const apiUrl = {
    // Sair da lista pelo link da campanha. O `sig` que acompanha o id é
    // assinado com um segredo próprio, separado do de inscrição — este link
    // fica em caixas de entrada para sempre e não pode valer como sessão.
    // GET lê o estado, POST tira da lista — mesma URL, verbos diferentes.
    newsletter: (id: string, sig: string) =>
        `${apiOrigin}/api/newsletter/${id}/unsubscribe?sig=${encodeURIComponent(sig)}`,
    newsletterResubscribe: (id: string, sig: string) =>
        `${apiOrigin}/api/newsletter/${id}/resubscribe?sig=${encodeURIComponent(sig)}`,
    registrations: `${apiOrigin}/api/registrations`,
    verifyEmail: (id: string) => `${apiOrigin}/api/registrations/${id}/verify-email`,
    resendCode: (id: string) => `${apiOrigin}/api/registrations/${id}/resend-code`,
    dependents: (guardianId: string) => `${apiOrigin}/api/registrations/${guardianId}/dependents`
} as const;