import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  linkTo: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  linkTo,
}: FeatureCardProps) {
  const theme = useTheme();

  return (
    <Link
      to={linkTo}
      className={`group block rounded-3xl border ${theme.border} ${theme.surface} p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
    >
      {/* Icon circle */}
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${theme.surfaceAccent}`}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className={`mb-2 text-base font-bold ${theme.text}`}>{title}</h3>

      {/* Description */}
      <p className={`text-sm leading-relaxed ${theme.textLight}`}>
        {description}
      </p>
    </Link>
  );
}
