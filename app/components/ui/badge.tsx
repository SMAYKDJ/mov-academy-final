'use client';

import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Reusable Badge component for status indicators and labels.
 */

const variants = {
  success: 'bg-success-50 dark:bg-green-900/20 text-success-700 dark:text-green-400 border-green-200 dark:border-green-800',
  danger: 'bg-danger-50 dark:bg-red-900/20 text-danger-700 dark:text-red-400 border-red-200 dark:border-red-800',
  warning: 'bg-warning-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  primary: 'bg-primary-50 dark:bg-indigo-900/20 text-primary-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  neutral: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
};

interface BadgeProps {
  variant?: keyof typeof variants;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ variant = 'neutral', children, className, dot }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      variants[variant],
      className
    )}>
      {dot && (
        <span className={cn(
          "w-1.5 h-1.5 rounded-full",
          variant === 'success' && "bg-success-500",
          variant === 'danger' && "bg-danger-500",
          variant === 'warning' && "bg-warning-500",
          variant === 'primary' && "bg-primary-500",
          variant === 'neutral' && "bg-gray-400",
        )} />
      )}
      {children}
    </span>
  );
}
