import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useBrand } from '../contexts/BrandContext';

export function useRealtime(table: string, callback: () => void) {
  const { activeBrand } = useBrand();

  useEffect(() => {
    if (!activeBrand) return;

    // Filter by brand_id to ensure we only get relevant events
    const channel = supabase
      .channel(`public:${table}:brand_id=eq.${activeBrand.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: `brand_id=eq.${activeBrand.id}`,
        },
        (payload) => {
          console.log(`Realtime update for ${table}:`, payload);
          callback();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback, activeBrand]);
}
