"use client";

import React from 'react';
import ContentManagement from '@/components/admin/content-management/ContentManagement';

// Prevent static generation
export const dynamic = 'force-dynamic';

const AdminTestPage = () => {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎬 Admin Test Panel
        </h1>
        <p className="text-xl text-gray-600">
          Testing Content Management without authentication
        </p>
      </div>

      <ContentManagement />
    </main>
  );
};

export default AdminTestPage;