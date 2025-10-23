'use client';

import React, { useState, useEffect } from 'react';
import { X, Menu } from 'lucide-react';

interface MobileDrawerProps {
  trigger?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function MobileDrawer({ 
  trigger, 
  title = "Menu", 
  children, 
  className = "" 
}: MobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger */}
      <div onClick={() => setIsOpen(true)}>
        {trigger || (
          <button className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            <Menu className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white dark:bg-gray-800 
        shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        ${className}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-full pb-20">
          {children}
        </div>
      </div>
    </>
  );
}