'use client';

import { useUser } from '@clerk/nextjs';
import { ADMIN_EMAILS } from '@/lib/admin';

export function useAdmin() {
  const { user } = useUser();
  
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = userEmail ? ADMIN_EMAILS.includes(userEmail) : false;
  const isSuperAdmin = userEmail === 'arif@afna.link';
  
  return {
    isAdmin,
    isSuperAdmin,
    user
  };
}