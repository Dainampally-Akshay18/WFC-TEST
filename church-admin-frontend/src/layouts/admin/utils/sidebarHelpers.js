export const filterSidebarByPermissions = (items, userPermissions) => {
  return items.filter((item) => {
    if (item.permission && !userPermissions.includes(item.permission)) {
      return false;
    }
    if (item.children) {
      item.children = filterSidebarByPermissions(item.children, userPermissions);
    }
    return true;
  });
};

export const findActiveItem = (items, pathname) => {
  for (const item of items) {
    if (item.path === pathname) return item;
    if (item.children) {
      const found = findActiveItem(item.children, pathname);
      if (found) return found;
    }
  }
  return null;
};
