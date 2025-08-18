import { useGetMenuTree } from '../infrastructure/utils/menu';

export const useMenuItems = () => {
  const { menuItems, menuLoading, menuError } = useGetMenuTree();

  if (menuLoading) {
    return { items: [] };
  }

  const result = {
    items: [
      {
        id: 'group-navigation',
        title: 'Navigation',
        type: 'group',
        children: menuItems
      }
    ]
  };

  console.log('Final menu result:', result);
  return result;
};

// Fallback static export for non-hook usage
const menuItems = {
  items: []
};

export default menuItems;
