import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';

// This service handles the "Off-ramp" (EXC -> USDC on Solana)
// Strategy: 
// 1. User requests cash-out of X credits (EXC).
// 2. Admin/Backend verifies the request.
// 3. Platform sends equivalent USDC to user's Solana wallet (Privy address).

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com'; // Change to devnet for testing
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // Mainnet USDC

export const solanaService = {
    /**
     * Fetch balance of USDC for a given public key
     */
    async getUSDCBalance(walletAddress: string) {
        try {
            const connection = new Connection(SOLANA_RPC);
            const publicKey = new PublicKey(walletAddress);

            const usdcAddress = await getAssociatedTokenAddress(USDC_MINT, publicKey);
            const balance = await connection.getTokenAccountBalance(usdcAddress);

            return balance.value.uiAmount || 0;
        } catch (err) {
            console.error('Failed to fetch USDC balance:', err);
            return 0;
        }
    },

    /**
     * Note: Transfer logic usually happens on the backend/admin-side 
     * for security and compliance (KYC check before crypto payout).
     */
    async requestCashOut(userId: string, amountExc: number, destinationWallet: string) {
        // This would typically hit a Supabase Edge Function that:
        // 1. Checks user's EXC balance.
        // 2. Marks EXC as 'pending_cashout' or 'burned'.
        // 3. Triggers the Solana transfer from the Platform Wallet.
        // For now, we simulate the request.
        console.log(`Cash-out request: User ${userId} wants to swap ${amountExc} EXC for USDC to ${destinationWallet}`);
        return { success: true, trackingId: 'TX-' + Math.random().toString(36).substr(2, 9) };
    }
};
