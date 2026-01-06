export type Profile = {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    exc_balance: number;
    escrow_balance: number;
    rating: number;
    review_count: number;
    provider_tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    referred_by: string | null;
    created_at: string;
    updated_at: string;
};

export type Service = {
    id: string;
    provider_id: string;
    title: string;
    description: string | null;
    category: string;
    price_exc: number;
    is_remote: boolean;
    location_name: string | null;
    image_url: string | null;
    is_active: boolean;
    created_at: string;
};

export type TransactionStatus = 'pending' | 'in_progress' | 'completed' | 'disputed' | 'cancelled';

export type Transaction = {
    id: string;
    buyer_id: string;
    provider_id: string;
    service_id: string | null;
    amount_exc: number;
    status: TransactionStatus;
    created_at: string;
    updated_at: string;
};

export type Review = {
    id: string;
    transaction_id: string;
    reviewer_id: string;
    provider_id: string;
    rating: number;
    comment: string | null;
    created_at: string;
};

export type ServiceRequest = {
    id: string;
    requester_id: string;
    title: string;
    description: string | null;
    budget_exc: number | null;
    is_sourcing_active: boolean;
    created_at: string;
};
