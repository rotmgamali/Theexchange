import { supabase } from './supabase';
import { Service, ServiceRequest } from '../types/database';

export const marketplaceService = {
    /**
     * Fetch available services (Gig-based)
     */
    async getServices(category?: string) {
        let query = supabase
            .from('services')
            .select('*, provider:profiles(username, avatar_url, rating)')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (category && category !== 'All') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    /**
     * Fetch active bounties (Service Requests)
     */
    async getBounties(category?: string) {
        let query = supabase
            .from('service_requests')
            .select('*, requester:profiles(username, avatar_url)')
            .eq('is_sourcing_active', true)
            .order('created_at', { ascending: false });

        if (category && category !== 'All') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    /**
     * Create a new bounty (Service Request)
     */
    async createBounty(requesterId: string, title: string, description: string, budgetExc: number, category: string) {
        const { data, error } = await supabase
            .from('service_requests')
            .insert({
                requester_id: requesterId,
                title,
                description,
                category,
                budget_exc: budgetExc,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Create a new service listing
     */
    async createService(providerId: string, title: string, description: string, priceExc: number, category: string) {
        const { data, error } = await supabase
            .from('services')
            .insert({
                provider_id: providerId,
                title,
                description,
                price_exc: priceExc,
                category,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
