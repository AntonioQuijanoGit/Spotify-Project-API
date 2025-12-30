import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
}

export const SkeletonLoader = ({ width = '100%', height = '1rem', className = '' }: SkeletonLoaderProps) => {
  return (
    <div 
      className={`skeleton-loader ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <SkeletonLoader height="200px" className="skeleton-image" />
      <div className="skeleton-content">
        <SkeletonLoader height="24px" width="60%" />
        <SkeletonLoader height="16px" width="80%" className="skeleton-margin" />
        <SkeletonLoader height="16px" width="40%" />
      </div>
    </div>
  );
};






