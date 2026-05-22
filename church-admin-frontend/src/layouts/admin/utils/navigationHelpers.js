export const buildBreadcrumbs = (pathname, routes) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Home', path: '/' }];

  let currentPath = '';
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const route = routes.find((r) => r.path === currentPath);
    if (route) {
      breadcrumbs.push({
        label: route.label || segment,
        path: currentPath,
      });
    }
  });

  return breadcrumbs;
};
