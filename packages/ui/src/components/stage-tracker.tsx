import React from "react"
import { cn } from "../lib/utils"

export interface Stage {
  id: string
  name: string
  status: "completed" | "current" | "upcoming"
  description?: string
  date?: string
}

export interface StageTrackerProps {
  stages: Stage[]
  orientation?: "horizontal" | "vertical"
  showConnector?: boolean
  className?: string
}

export function StageTracker({
  stages,
  orientation = "horizontal",
  showConnector = true,
  className,
}: StageTrackerProps) {
  return (
    <div
      className={cn(
        "flex",
        orientation === "horizontal" ? "flex-row items-center" : "flex-col",
        className
      )}
    >
      {stages.map((stage, index) => (
        <React.Fragment key={stage.id}>
          <div
            className={cn(
              "flex items-center",
              orientation === "horizontal" ? "flex-row" : "flex-col"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-full border-2 transition-all duration-normal",
                {
                  "h-8 w-8 text-sm": orientation === "horizontal",
                  "h-10 w-10 text-base": orientation === "vertical",
                },
                {
                  "border-success-500 bg-success-500 text-white": stage.status === "completed",
                  "border-primary-500 bg-primary-500 text-white": stage.status === "current",
                  "border-neutral-300 bg-white text-neutral-400": stage.status === "upcoming",
                }
              )}
            >
              {stage.status === "completed" ? (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="font-medium">{index + 1}</span>
              )}
            </div>
            
            <div
              className={cn(
                "flex flex-col",
                orientation === "horizontal" ? "ml-3" : "mt-2 text-center"
              )}
            >
              <span
                className={cn(
                  "font-medium text-sm",
                  {
                    "text-success-700": stage.status === "completed",
                    "text-primary-700": stage.status === "current",
                    "text-neutral-500": stage.status === "upcoming",
                  }
                )}
              >
                {stage.name}
              </span>
              
              {stage.description && (
                <span className="text-xs text-neutral-500 mt-1">
                  {stage.description}
                </span>
              )}
              
              {stage.date && (
                <span className="text-xs text-neutral-400 mt-1">
                  {stage.date}
                </span>
              )}
            </div>
          </div>
          
          {showConnector && index < stages.length - 1 && (
            <div
              className={cn(
                "flex-1",
                orientation === "horizontal" ? "h-px mx-4" : "w-px h-8 mx-auto my-2",
                {
                  "bg-success-500": stage.status === "completed",
                  "bg-primary-500": stage.status === "current",
                  "bg-neutral-300": stage.status === "upcoming",
                }
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// Helper function to create stages from data
export function createStages(
  stageData: Array<{
    name: string
    completed?: boolean
    current?: boolean
    description?: string
    date?: string
  }>
): Stage[] {
  return stageData.map((stage, index) => ({
    id: `stage-${index}`,
    name: stage.name,
    status: stage.completed
      ? "completed"
      : stage.current
      ? "current"
      : "upcoming",
    description: stage.description,
    date: stage.date,
  }))
}

// Common stage configurations
export const CommonStages = {
  project: [
    { name: "Planning", description: "Define requirements and scope" },
    { name: "Development", description: "Build and implement features" },
    { name: "Testing", description: "Quality assurance and testing" },
    { name: "Deployment", description: "Release to production" },
  ],
  campaign: [
    { name: "Strategy", description: "Define campaign objectives" },
    { name: "Content", description: "Create marketing materials" },
    { name: "Distribution", description: "Launch across channels" },
    { name: "Analysis", description: "Measure and optimize" },
  ],
  onboarding: [
    { name: "Welcome", description: "Account setup and introduction" },
    { name: "Configuration", description: "Customize your settings" },
    { name: "Training", description: "Learn the platform features" },
    { name: "Go Live", description: "Start using the platform" },
  ],
} as const
