import { useSidebar } from './useSidebar';
import { useNavbar } from './useNavbar';

export const useLayout = () => {
  const sidebar = useSidebar();
  const navbar = useNavbar();

  return {
    sidebar,
    navbar,
  };
};
