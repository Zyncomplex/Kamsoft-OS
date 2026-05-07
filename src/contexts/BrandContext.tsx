import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../lib/api';
import { Brand } from '../types';

interface BrandContextType {
  activeBrand: Brand | null;
  brands: Brand[];
  loading: boolean;
  switchBrand: (brandId: string) => Promise<void>;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const { profile, refreshProfile } = useAuth();
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrandData() {
      if (!profile) {
        setActiveBrand(null);
        setBrands([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 1. Fetch all brands user has access to
        const allBrands = await api.get<Brand[]>('/brands');
        setBrands(allBrands);

        // 2. Fetch the current active brand details
        if (profile.active_brand_id) {
          const brand = await api.get<Brand>(`/brands/${profile.active_brand_id}`);
          setActiveBrand(brand);
        } else if (allBrands.length > 0) {
          // Fallback to first brand if none active
          setActiveBrand(allBrands[0]);
        }
      } catch (error) {
        console.error('Error loading brand data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBrandData();
  }, [profile]);

  const switchBrand = async (brandId: string) => {
    setLoading(true);
    try {
      // API call to update user's active brand in DB
      await api.patch('/users/active-brand', { brandId });
      // Refresh profile to get updated active_brand_id
      await refreshProfile();
    } catch (error) {
      console.error('Error switching brand:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrandContext.Provider
      value={{
        activeBrand,
        brands,
        loading,
        switchBrand,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}
