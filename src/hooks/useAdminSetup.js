import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Checks whether a single admin account already exists in admin_profiles.
 * Returns:
 *   - adminExists: boolean | null  (null = still loading)
 *   - loading: boolean
 *   - error: string | null
 *   - refetch: () => void  (call after successful setup to re-check)
 */
export function useAdminSetup() {
  const [adminExists, setAdminExists] = useState(null); // null = unknown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAdminExists = async () => {
    setLoading(true);
    setError(null);
    try {
      const { count, error: dbError } = await supabase
        .from('admin_profiles')
        .select('id', { count: 'exact', head: true });

      if (dbError) throw dbError;

      setAdminExists(count > 0);
    } catch (err) {
      console.error('[useAdminSetup] Error checking admin existence:', err);
      setError('Could not verify admin status. Please refresh.');
      setAdminExists(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminExists();
  }, []);

  return { adminExists, loading, error, refetch: checkAdminExists };
}
