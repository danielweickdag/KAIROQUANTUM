"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Context for managing tooltip state
const TooltipContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
} | null>(null)

// Main Tooltip component that can work with or without content prop
interface TooltipProps {
  children: React.ReactNode
  content?: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  delayDuration?: number
  className?: string
}

const Tooltip = ({ 
  children, 
  content, 
  side = "top", 
  align = "center", 
  delayDuration = 200,
  className 
}: TooltipProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null)

  // If content is provided, use simple tooltip
  if (content) {
    const showTooltip = () => {
      if (timeoutId) clearTimeout(timeoutId)
      const id = setTimeout(() => setIsOpen(true), delayDuration)
      setTimeoutId(id)
    }

    const hideTooltip = () => {
      if (timeoutId) clearTimeout(timeoutId)
      setIsOpen(false)
    }

    const getSideClasses = () => {
      switch (side) {
        case "top": return "bottom-full mb-2"
        case "right": return "left-full ml-2"
        case "bottom": return "top-full mt-2"
        case "left": return "right-full mr-2"
        default: return "bottom-full mb-2"
      }
    }

    const getAlignClasses = () => {
      if (side === "top" || side === "bottom") {
        switch (align) {
          case "start": return "left-0"
          case "end": return "right-0"
          default: return "left-1/2 transform -translate-x-1/2"
        }
      } else {
        switch (align) {
          case "start": return "top-0"
          case "end": return "bottom-0"
          default: return "top-1/2 transform -translate-y-1/2"
        }
      }
    }

    return (
      <div className="relative inline-block">
        <div
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onFocus={showTooltip}
          onBlur={hideTooltip}
        >
          {children}
        </div>
        
        {isOpen && (
          <div
            className={cn(
              "absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap",
              getSideClasses(),
              getAlignClasses(),
              className
            )}
            role="tooltip"
          >
            {content}
          </div>
        )}
      </div>
    )
  }

  // Otherwise, use compound component pattern
  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block">
        {children}
      </div>
    </TooltipContext.Provider>
  )
}

// Provider component
const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

// Trigger component
const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ children, asChild, ...props }, ref) => {
  const context = React.useContext(TooltipContext)
  
  const handleMouseEnter = () => {
    context?.setIsOpen(true)
  }
  
  const handleMouseLeave = () => {
    context?.setIsOpen(false)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      ...props
    })
  }

  return (
    <div 
      ref={ref} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  )
})
TooltipTrigger.displayName = "TooltipTrigger"

// Content component
const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(TooltipContext)
  
  if (!context?.isOpen) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap bottom-full mb-2 left-1/2 transform -translate-x-1/2",
        className
      )}
      role="tooltip"
      {...props}
    >
      {children}
    </div>
  )
})
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent }