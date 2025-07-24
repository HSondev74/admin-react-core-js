import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// Types
interface MenuMasterState {
  isDashboardDrawerOpened: boolean;
}

interface MenuEndpoints {
  key: string;
  master: string;
  dashboard: string;
}

interface UseGetMenuMasterReturn {
  menuMaster: MenuMasterState | undefined;
  menuMasterLoading: boolean;
}

// Constants
const initialState: MenuMasterState = {
  isDashboardDrawerOpened: false,
};

const endpoints: MenuEndpoints = {
  key: 'api/menu',
  master: '/master',
  dashboard: '/dashboard', // server URL
};

/**
 * Hook to get the menu master state
 * @returns Object containing menu master state and loading status
 */
export function useGetMenuMaster(): UseGetMenuMasterReturn {
  const { data, isLoading } = useSWR<MenuMasterState>(
    endpoints.key + endpoints.master,
    () => initialState,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      menuMaster: data,
      menuMasterLoading: isLoading,
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

/**
 * Handler to toggle the dashboard drawer
 * @param isDashboardDrawerOpened - Boolean indicating if the drawer should be open
 */
export const handlerDrawerOpen = (isDashboardDrawerOpened: boolean): void => {
  // Update the local state
  mutate(
    endpoints.key + endpoints.master,
    (current: MenuMasterState | undefined) => ({
      ...current,
      isDashboardDrawerOpened,
    }),
    false
  );
};

// Export types
export type { MenuMasterState, MenuEndpoints, UseGetMenuMasterReturn };

export default {
  useGetMenuMaster,
  handlerDrawerOpen,
};
