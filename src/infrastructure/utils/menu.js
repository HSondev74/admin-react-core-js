import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import menuApi from '../api/http/menu';
import { getIconComponent } from '../../utils/iconMapping';

const initialState = {
  isDashboardDrawerOpened: false
};

const endpoints = {
  key: 'api/menu',
  master: 'master',
  tree: 'tree'
};

const transformMenuData = (apiData) => {
  if (!apiData?.data) return [];

  return apiData.data
    .sort((a, b) => a.item.sortOrder - b.item.sortOrder)
    .map((menuItem) => ({
      id: menuItem.item.id,
      title: menuItem.item.name,
      type: 'item',
      url: menuItem.item.path,
      icon: getIconComponent(menuItem.item.icon),
      breadcrumbs: false,
      children: menuItem.children?.length > 0 ? transformMenuData({ data: menuItem.children }) : undefined
    }));
};

export function useGetMenuMaster() {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.master, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      menuMaster: data,
      menuMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function useGetMenuTree() {
  const { data, isLoading, error } = useSWR(endpoints.key + endpoints.tree, () => menuApi.getMenuTree(), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onError: (err) => console.error('SWR Error:', err),
    onSuccess: (data) => console.log('SWR Success:', data)
  });

  const memoizedValue = useMemo(() => {
    const transformedData = data ? transformMenuData(data) : [];
    return {
      menuItems: transformedData,
      menuLoading: isLoading,
      menuError: error
    };
  }, [data, isLoading, error]);

  return memoizedValue;
}

export function handlerDrawerOpen(isDashboardDrawerOpened) {
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      return { ...currentMenuMaster, isDashboardDrawerOpened };
    },
    false
  );
}
