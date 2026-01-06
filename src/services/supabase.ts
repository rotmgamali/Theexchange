import { createClient } from '@supabase/supabase-js';
import { Profile, Service, Transaction, Review, ServiceRequest } from '../types/database';

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Profile, 'id'>>;
            };
            services: {
                Row: Service;
                Insert: Omit<Service, 'id' | 'created_at'>;
                Update: Partial<Omit<Service, 'id'>>;
            };
            transactions: {
                Row: Transaction;
                Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Transaction, 'id'>>;
            };
            reviews: {
                Row: Review;
                Insert: Omit<Review, 'id' | 'created_at'>;
                Update: Partial<Review>;
            };
            service_requests: {
                Row: ServiceRequest;
                Insert: Omit<ServiceRequest, 'id' | 'created_at'>;
                Update: Partial<ServiceRequest>;
            };
        };
    };
};


// Using the newest keys provided by the user
const supabaseUrl = 'https://mwpoiikkhgalzmupexjp.supabase.co';
const supabaseAnonKey = 'sb_publishable_7la3zDbecgmDMps_vEA84g_xuiFQEDK';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
