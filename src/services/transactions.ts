import { supabase } from './supabase';
import { TransactionStatus } from '../types/database';

export const transactionService = {
    /**
     * Hire a provider (Commits EXC to Escrow)
     */
    async hireProvider(buyerId: string, providerId: string, serviceId: string | null, amount: number) {
        const { data, error } = await supabase.rpc('commit_to_escrow', {
            p_buyer_id: buyerId,
            p_provider_id: providerId,
            p_service_id: serviceId,
            p_amount_exc: amount,
        });

        if (error) throw error;
        return data as string; // Returns Transaction UUID
    },

    /**
     * Release funds from Escrow to Provider
     */
    async releaseFunds(transactionId: string) {
        const { data, error } = await supabase.rpc('release_escrow', {
            p_transaction_id: transactionId,
        });

        if (error) throw error;
        return data as boolean;
    },

    /**
     * Dispute a transaction
     */
    async disputeTransaction(transactionId: string, reason: string) {
        const { data, error } = await supabase.rpc('dispute_transaction', {
            p_transaction_id: transactionId,
            p_reason: reason,
        });

        if (error) throw error;
        return data as boolean;
    },

    /**
     * Fetch user transaction history
     */
    async getTransactionHistory(userId: string) {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
        *,
        buyer:profiles!transactions_buyer_id_fkey(username, avatar_url),
        provider:profiles!transactions_provider_id_fkey(username, avatar_url),
        service:services(title)
      `)
            .or(`buyer_id.eq.${userId},provider_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
};
