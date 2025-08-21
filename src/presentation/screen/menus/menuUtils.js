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
