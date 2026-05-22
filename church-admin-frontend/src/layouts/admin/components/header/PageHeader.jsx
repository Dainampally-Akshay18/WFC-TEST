import Breadcrumbs from './Breadcrumbs';

const PageHeader = ({ title, subtitle, actions, breadcrumbs }) => {
  return (
    <div className="mb-6">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      
      <div className="flex items-center justify-between mt-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
