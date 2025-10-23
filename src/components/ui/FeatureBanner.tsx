'use client';

import React, { useEffect, useState } from 'react';
import automatedWorkflowService from '@/services/AutomatedWorkflowService';
import { Badge } from './badge';
import { Button } from './button';

/**
 * FeatureBanner displays global feature status and allows enabling automation.
 * It can auto-enable based on NEXT_PUBLIC_AUTOMATION_DEFAULT_ENABLED.
 */
export default function FeatureBanner() {
  const [automationEnabled, setAutomationEnabled] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Reflect current config state
    const cfg = automatedWorkflowService.getConfig();
    const isEnabled = cfg.autoDeposit.enabled || cfg.autoInvest.enabled || cfg.autoWithdraw.enabled;
    setAutomationEnabled(isEnabled);

    // Auto-enable once if env requests it
    const envAuto = process.env.NEXT_PUBLIC_AUTOMATION_DEFAULT_ENABLED === 'true';
    if (envAuto && !isEnabled && typeof window !== 'undefined') {
      const alreadyInitialized = localStorage.getItem('automation_initialized') === 'true';
      if (!alreadyInitialized) {
        automatedWorkflowService.updateConfig({
          autoDeposit: { ...cfg.autoDeposit, enabled: true },
          autoInvest: { ...cfg.autoInvest, enabled: true },
          autoWithdraw: { ...cfg.autoWithdraw, enabled: true },
        });
        localStorage.setItem('automation_initialized', 'true');
        setAutomationEnabled(true);
      }
    }
  }, []);

  const handleEnable = () => {
    const cfg = automatedWorkflowService.getConfig();
    automatedWorkflowService.updateConfig({
      autoDeposit: { ...cfg.autoDeposit, enabled: true },
      autoInvest: { ...cfg.autoInvest, enabled: true },
      autoWithdraw: { ...cfg.autoWithdraw, enabled: true },
    });
    setAutomationEnabled(true);
  };

  const handleDisable = () => {
    const cfg = automatedWorkflowService.getConfig();
    automatedWorkflowService.updateConfig({
      autoDeposit: { ...cfg.autoDeposit, enabled: false },
      autoInvest: { ...cfg.autoInvest, enabled: false },
      autoWithdraw: { ...cfg.autoWithdraw, enabled: false },
    });
    setAutomationEnabled(false);
  };

  if (!mounted) return null;

  return (
    <div className="w-full bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-blue-700 dark:text-blue-200 border-blue-300 dark:border-blue-700">Features</Badge>
          <span className="text-sm text-blue-800 dark:text-blue-100">
            {automationEnabled ? 'Automation is enabled and running' : 'Automation is disabled'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {automationEnabled ? (
            <Button size="sm" variant="secondary" onClick={handleDisable}>
              Disable Automation
            </Button>
          ) : (
            <Button size="sm" onClick={handleEnable}>
              Enable Automation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}