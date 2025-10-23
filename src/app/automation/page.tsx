'use client';

import React, { useState } from 'react';
import AutomationDashboard from '@/components/automation/AutomationDashboard';
import WorkflowManager from '@/components/automation/WorkflowManager';
import AppLayout from '@/components/layouts/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Automation Center</h1>
            <p className="text-gray-600">General workflow automation and trading strategies</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AutomationDashboard />
          </TabsContent>

          <TabsContent value="workflows">
            <WorkflowManager className="mb-6" />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}