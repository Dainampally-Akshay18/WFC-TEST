import PageHeader from '../layouts/admin/components/header/PageHeader';

const PlaceholderPage = ({ title, icon, description, color = '#7B2CBF' }) => {
    return (
        <div className="animate-fade-in-up">
            <PageHeader title={title} subtitle={description} />

            <div
                className="mt-4 p-12 rounded-2xl flex flex-col items-center justify-center text-center"
                style={{
                    background: 'var(--glass-card)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid var(--border-glass)',
                    boxShadow: 'var(--shadow-glass)',
                }}
            >
                <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6"
                    style={{
                        background: `${color}15`,
                        border: `1px solid ${color}30`,
                        boxShadow: `0 0 24px ${color}20`,
                    }}
                >
                    {icon}
                </div>
                <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {title}
                </h2>
                <p
                    className="text-sm max-w-xs"
                    style={{ color: 'var(--text-muted)' }}
                >
                    This module is coming soon. Navigation and layout are fully functional.
                </p>

                <div
                    className="mt-8 px-6 py-2.5 rounded-xl text-sm font-medium"
                    style={{
                        background: 'var(--gradient-button)',
                        color: 'white',
                        boxShadow: 'var(--shadow-small)',
                    }}
                >
                    Under Construction
                </div>
            </div>
        </div>
    );
};

export default PlaceholderPage;
