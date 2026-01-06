// Privy Wallet & Auth Configuration
// These keys enable the "Money Layer" (Solana off-ramping)
export const PRIVY_CONFIG = {
    appId: 'sb_publishable_8XGRBgFDPf2LrsozE9sBTw_uPp_NYXg',
    appSecret: 'sb_secret_ofFyQw1AGSZrw-YytAdBAQ_Lwvj7qYz', // Note: App Secret should usually be on the backend
};

/**
 * STRATEGY: 
 * We use 'Exchange Credits' (EXC) in-app to comply with Apple Guideline 3.1.1.
 * Privy/Solana is used strictly for the "Exchange" (Cashing out earned EXC to USDC).
 */
