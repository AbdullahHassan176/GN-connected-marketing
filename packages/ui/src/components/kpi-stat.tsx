import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const kpiStatVariants = cva(
  "rounded-brand-md border bg-white p-6 transition-all duration-normal hover:shadow-brand-soft",
  {
    variants: {
      variant: {
        default: "border-neutral-200",
        success: "border-success-200 bg-success-50",
        warning: "border-warning-200 bg-warning-50",
        error: "border-error-200 bg-error-50",
        info: "border-blue-200 bg-blue-50",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface KPIStatProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof kpiStatVariants> {
  title: string
  value: string | number
  change?: {
    value: number
    label: string
    positive?: boolean
  }
  icon?: React.ReactNode
  description?: string
  loading?: boolean
}

export function KPIStat({
  title,
  value,
  change,
  icon,
  description,
  loading = false,
  variant,
  size,
  className,
  ...props
}: KPIStatProps) {
  if (loading) {
    return (
      <div className={cn(kpiStatVariants({ variant, size }), className)} {...props}>
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-neutral-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-neutral-200 rounded w-1/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(kpiStatVariants({ variant, size }), className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-600">{title}</h3>
        {icon && (
          <div className="text-neutral-400">
            {icon}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-neutral-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        
        {change && (
          <div className="flex items-center space-x-1">
            <span
              className={cn(
                "text-sm font-medium",
                change.positive !== false && change.value > 0
                  ? "text-success-600"
                  : change.value < 0
                  ? "text-error-600"
                  : "text-neutral-600"
              )}
            >
              {change.value > 0 ? "+" : ""}{change.value}%
            </span>
            <span className="text-sm text-neutral-500">{change.label}</span>
          </div>
        )}
        
        {description && (
          <p className="text-sm text-neutral-500">{description}</p>
        )}
      </div>
    </div>
  )
}

// Common KPI icons
export const KPIStatIcons = {
  users: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  revenue: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ),
  growth: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  conversion: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  engagement: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  performance: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
} as const
