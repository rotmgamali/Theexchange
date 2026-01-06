import { supabase } from './supabase';
import { Profile } from '../types/database';

export const profileService = {
    /**
     * Sync user profile from Privy to Supabase
     * This is called on every login to ensure the profile exists and is updated.
     */
    async syncProfile(userId: string, email?: string, username?: string, avatarUrl?: string) {
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                full_name: username, // Map username to full_name if needed
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'id' })
            .select()
            .single();

        if (error) {
            console.error('Error syncing profile:', error);
            throw error;
        }
        return data as Profile;
    },

    /**
     * Fetch a user profile by ID
     */
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) return null;
        return data as Profile;
    },

    /**
     * Update profile details
     */
    async updateProfile(userId: string, updates: Partial<Profile>) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data as Profile;
    }
};
