import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      default: 'bg-gray-100 text-gray-800',
      active: 'bg-green-500 text-white',
      idle: 'bg-yellow-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-orange-500 text-white',
      success: 'bg-green-500 text-white',
      info: 'bg-blue-500 text-white',
      primary: 'bg-purple-500 text-white',
      secondary: 'bg-gray-500 text-white',
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof badgeVariants>['variant'];
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
