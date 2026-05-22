import { Link } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { ROUTES } from '../../../../constants/routes';
import ThemeToggle from './ThemeToggle';
import NotificationDropdown from './NotificationDropdown';
import UserMenu from './UserMenu';

/**
 * NavbarActions — renders different action sets based on auth state.
 * Authenticated: ThemeToggle + NotificationDropdown + UserMenu
 * Unauthenticated: ThemeToggle + Login + SignUp
 */
const NavbarActions = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex items-center gap-2">
            <ThemeToggle />

            {isAuthenticated ? (
                <>
                    <NotificationDropdown />
                    <UserMenu />
                </>
            ) : (
                <>
                    <Link
                        to={ROUTES.LOGIN}
                        className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                        style={{
                            color: 'var(--text-primary)',
                            background: 'var(--glass-card)',
                            border: '1px solid var(--border-glass)',
                        }}
                    >
                        Login
                    </Link>
                    <Link
                        to={ROUTES.SIGNUP}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                        style={{
                            background: 'var(--gradient-button)',
                            color: 'white',
                            boxShadow: 'var(--shadow-small)',
                        }}
                    >
                        Sign Up
                    </Link>
                </>
            )}
        </div>
    );
};

export default NavbarActions;
