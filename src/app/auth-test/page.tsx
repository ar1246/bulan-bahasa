"use client";

import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ADMIN_EMAILS } from '@/lib/admin';

export default function AuthTestPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = userEmail && ADMIN_EMAILS.includes(userEmail);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
            <CardDescription>
              Check your authentication status and admin access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Signed In:</span>
              <Badge variant={isSignedIn ? "default" : "secondary"}>
                {isSignedIn ? "Yes" : "No"}
              </Badge>
            </div>
            
            {user && (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{userEmail}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{user.firstName} {user.lastName}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Admin Access:</span>
                  <Badge variant={isAdmin ? "default" : "destructive"}>
                    {isAdmin ? "Yes" : "No"}
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {!isSignedIn && (
          <Card>
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                You need to sign in to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.location.href = '/sign-in'}
                className="w-full"
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        )}

        {isSignedIn && !isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Access Required</CardTitle>
              <CardDescription>
                Your account does not have admin privileges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Admin access is restricted to: {ADMIN_EMAILS.join(", ")}
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Go Home
              </Button>
            </CardContent>
          </Card>
        )}

        {isSignedIn && isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Access Granted</CardTitle>
              <CardDescription>
                You can access the admin panel and content management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => window.location.href = '/admin'}
                className="w-full"
              >
                Go to Admin Panel
              </Button>
              <Button 
                onClick={() => window.location.href = '/content-test'}
                variant="outline"
                className="w-full"
              >
                Test Content Management
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}