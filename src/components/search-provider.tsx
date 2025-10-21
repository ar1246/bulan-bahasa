"use client"

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'

function SearchParamsHandler() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  if (error === 'admin_access_required') {
    return (
      <div className="container mx-auto px-4 pt-4">
        <Alert className="mb-4 bg-red-50 border-red-200">
          <AlertDescription className="text-red-700">
            Admin access required. You need to sign in with an admin account to access the admin panel.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return null
}

export default function SearchParamsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>
      {children}
    </>
  )
}