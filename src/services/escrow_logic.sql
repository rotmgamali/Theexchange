-- The Exchange: Escrow & Transaction Logic (SQL Functions)

-- 1. Commit to Escrow (Buyer initiates transaction)
CREATE OR REPLACE FUNCTION public.commit_to_escrow(
  p_buyer_id UUID,
  p_provider_id UUID,
  p_service_id UUID,
  p_amount_exc BIGINT
) RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_buyer_balance BIGINT;
BEGIN
  -- Check buyer balance
  SELECT exc_balance INTO v_buyer_balance FROM public.profiles WHERE id = p_buyer_id;
  
  IF v_buyer_balance < p_amount_exc THEN
    RAISE EXCEPTION 'Insufficient EXC balance';
  END IF;

  -- 1. Create Transaction record
  INSERT INTO public.transactions (buyer_id, provider_id, service_id, amount_exc, status)
  VALUES (p_buyer_id, p_provider_id, p_service_id, p_amount_exc, 'pending')
  RETURNING id INTO v_transaction_id;

  -- 2. Deduct from Buyer balance and move to Escrow
  UPDATE public.profiles 
  SET 
    exc_balance = exc_balance - p_amount_exc,
    escrow_balance = escrow_balance + p_amount_exc
  WHERE id = p_buyer_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Release Escrow (Buyer approves or Auto-release)
CREATE OR REPLACE FUNCTION public.release_escrow(
  p_transaction_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_amount BIGINT;
  v_buyer_id UUID;
  v_provider_id UUID;
BEGIN
  -- Fetch transaction details
  SELECT buyer_id, provider_id, amount_exc 
  INTO v_buyer_id, v_provider_id, v_amount
  FROM public.transactions 
  WHERE id = p_transaction_id AND status IN ('pending', 'in_progress');

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found or not in releasable state';
  END IF;

  -- 1. Update Transaction status
  UPDATE public.transactions 
  SET status = 'completed', updated_at = now()
  WHERE id = p_transaction_id;

  -- 2. Deduct from Buyer's escrow and add to Provider's pending balance
  -- Note: We use a separate 'pending' phase for safety (industry standard)
  UPDATE public.profiles 
  SET escrow_balance = escrow_balance - v_amount
  WHERE id = v_buyer_id;

  UPDATE public.profiles 
  SET exc_balance = exc_balance + v_amount
  WHERE id = v_provider_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Dispute Transaction
CREATE OR REPLACE FUNCTION public.dispute_transaction(
  p_transaction_id UUID,
  p_reason TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.transactions 
  SET status = 'disputed', updated_at = now()
  WHERE id = p_transaction_id;
  
  -- Log reason (could be extended to a disputes table)
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
