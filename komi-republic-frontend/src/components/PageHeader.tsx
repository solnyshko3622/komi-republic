interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="page-header">
      <div className="page-header-content">
        <h2 className="page-header-title">{title}</h2>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      </div>
    </section>
  );
}
