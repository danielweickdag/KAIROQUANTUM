import React from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard />
    </div>
  );
}

export const metadata = {
  title: 'Admin Dashboard - Kairo Trading Platform',
  description: 'Administrative dashboard for managing users, billing, and system operations',
};