export const listMenus = (menus, level = 0) => {
  const result = [];
  menus.forEach((menu) => {
    result.push({ ...menu, level, id: menu.item?.id });
    if (menu.children?.length) {
      result.push(...listMenus(menu.children, level + 1));
    }
  });
  return result;
};

export const filterMenusBySearch = (menus, searchValue) => {
  if (!searchValue.trim()) return menus;
  const lower = searchValue.toLowerCase();

  const filterRecursive = (menuList) => {
    return menuList.reduce((acc, menu) => {
      const item = menu.item;
      const matches =
        item.name?.toLowerCase().includes(lower) ||
        item.path?.toLowerCase().includes(lower) ||
        item.menuType?.toLowerCase().includes(lower);

      if (matches) {
        acc.push(menu);
      } else if (menu.children?.length) {
        const filteredChildren = filterRecursive(menu.children);
        if (filteredChildren.length) acc.push({ ...menu, children: filteredChildren });
      }
      return acc;
    }, []);
  };

  return filterRecursive(menus);
};
