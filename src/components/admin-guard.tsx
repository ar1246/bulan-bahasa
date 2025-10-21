"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { ADMIN_EMAILS } from '@/lib/admin';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isSignedIn, user, isLoaded } = useUser();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setIsChecking(false);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isSignedIn && user) {
      const userEmail = user.primaryEmailAddress?.emailAddress;
      if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
        window.location.href = '/?error=admin_access_required';
      }
    }
  }, [isSignedIn, user]);

  if (!isLoaded || isChecking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Alert className="mb-6">
            <AlertDescription>
              You need to be signed in to access the admin panel.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => window.location.href = '/sign-in?redirect_url=/admin'}
            className="w-full"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription className="text-red-700">
              Admin access required. Your account ({userEmail}) does not have admin privileges.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}