'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Users,
  Settings,
  BarChart3,
  DollarSign,
  Activity,
  Bell,
  Database,
  Lock,
  Crown,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FileText,
  Mail,
  Globe,
  Zap,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DivAutomationManager from '@/components/automation/DivAutomationManager';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalTrades: number;
  activePlans: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  lastUpdated: string;
}

interface UserManagement {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastLogin: string;
  totalTrades: number;
  revenue: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 1247,
    activeUsers: 892,
    totalRevenue: 125000,
    monthlyRevenue: 15000,
    totalTrades: 45678,
    activePlans: 567,
    systemHealth: 'healthy',
    lastUpdated: new Date().toISOString()
  });

  const [users, setUsers] = useState<UserManagement[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      plan: 'Pro Trader',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-02-20',
      totalTrades: 156,
      revenue: 2400
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      plan: 'Basic',
      status: 'active',
      joinDate: '2024-02-01',
      lastLogin: '2024-02-19',
      totalTrades: 89,
      revenue: 890
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const handleRefreshStats = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAdminStats(prev => ({
        ...prev,
        lastUpdated: new Date().toISOString()
      }));
      setIsLoading(false);
    }, 1000);
  };

  const handleUserAction = async (userId: string, action: 'edit' | 'suspend' | 'delete') => {
    if (action === 'delete') {
      const user = users.find(u => u.id === userId);
      if (window.confirm(`Are you sure you want to delete ${user?.name}'s account? This action cannot be undone and will permanently delete all associated data.`)) {
        try {
          setIsLoading(true);
          // In a real app, this would be an API call to delete the user
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Remove user from the list
          setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
          
          console.log(`Successfully deleted user ${userId}`);
          // You could add a toast notification here
        } catch (error) {
          console.error('Failed to delete user:', error);
          // You could add error handling here
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      console.log(`Performing ${action} on user ${userId}`);
      // Implement other user management actions (edit, suspend)
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, monitor system health, and oversee platform operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshStats}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Badge className={cn("px-3 py-1", getHealthColor(adminStats.systemHealth))}>
            System {adminStats.systemHealth}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="billing">Billing Admin</TabsTrigger>
          <TabsTrigger value="div-automation">Div Automation</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {adminStats.activeUsers} active users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(adminStats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(adminStats.monthlyRevenue)} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.totalTrades.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Across all users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.activePlans}</div>
                <p className="text-xs text-muted-foreground">
                  Subscription plans
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Health Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Database</p>
                    <p className="text-sm text-gray-600">Connection healthy</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">API Services</p>
                    <p className="text-sm text-gray-600">All endpoints operational</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Trading Engine</p>
                    <p className="text-sm text-gray-600">Processing normally</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search and Filter */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 border rounded-lg w-full"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>

                {/* Users Table */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">User</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Plan</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Trades</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Revenue</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{user.plan}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {user.totalTrades}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatCurrency(user.revenue)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'edit')}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'suspend')}
                              >
                                <Lock className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'delete')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Admin Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Billing Administration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This section will contain the moved button and billing admin functionality.
                  </AlertDescription>
                </Alert>
                
                {/* Placeholder for moved button */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-600 mb-4">Button will be moved here</p>
                  <div className="space-y-2">
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Billing Action
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Billing Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Div Automation Tab */}
        <TabsContent value="div-automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Div Automation Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DivAutomationManager />
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Administration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Database className="h-6 w-6 mb-2" />
                  Database Management
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Globe className="h-6 w-6 mb-2" />
                  API Configuration
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Bell className="h-6 w-6 mb-2" />
                  Notification Settings
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  System Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Admin Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-gray-600">Enable system maintenance mode</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Security Settings</p>
                    <p className="text-sm text-gray-600">Manage security policies</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Backup Configuration</p>
                    <p className="text-sm text-gray-600">Schedule and manage backups</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;