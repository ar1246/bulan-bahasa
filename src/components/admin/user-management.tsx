"use client"

import { useState, useEffect, useCallback } from 'react'

// Prevent static generation
export const dynamic = 'force-dynamic';
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Search, Users, Trash2, RefreshCw, Crown, Shield, User } from 'lucide-react'
import type { UserRole } from '@/lib/content-types'

export default function UserManagement() {
  const { user } = useUser()
  const [users, setUsers] = useState<UserRole[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [promoteEmail, setPromoteEmail] = useState('')
  const [promoteRole, setPromoteRole] = useState<'admin' | 'superuser'>('admin')
  
  const isSuperAdmin = user?.primaryEmailAddress?.emailAddress === 'arif@afna.link'

  const fetchCurrentUserRole = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/my-role')
      const data = await response.json()
      
      if (data.success) {
        setCurrentUserRole(data.data)
      }
    } catch (error) {
      console.error('Error fetching current user role:', error)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    // Only superusers can view all users
    if (!isSuperAdmin) {
      console.log('User is not superadmin, skipping user fetch')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data)
      } else {
        console.error('Error fetching users:', data.error)
        toast.error(data.error || 'Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [isSuperAdmin])

  useEffect(() => {
    fetchCurrentUserRole()
    if (isSuperAdmin) {
      fetchUsers()
    }
  }, [fetchCurrentUserRole, fetchUsers, isSuperAdmin])

  const handlePromoteUser = async () => {
    if (!promoteEmail) {
      toast.error('Email is required')
      return
    }

    try {
      setActionLoading('promote')
      const response = await fetch('/api/admin/promote-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          targetEmail: promoteEmail,
          targetRole: promoteRole 
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(`User ${promoteEmail} promoted to ${promoteRole}`)
        setPromoteEmail('')
        fetchUsers()
      } else {
        toast.error(data.error || 'Failed to promote user')
      }
    } catch (error) {
      console.error('Error promoting user:', error)
      toast.error('Failed to promote user')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDemoteUser = async (email: string) => {
    try {
      setActionLoading(email)
      const response = await fetch('/api/admin/demote-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetEmail: email }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(`User ${email} demoted to regular user`)
        fetchUsers()
      } else {
        toast.error(data.error || 'Failed to demote user')
      }
    } catch (error) {
      console.error('Error demoting user:', error)
      toast.error('Failed to demote user')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  const getInitials = (email?: string) => {
    if (email) return email[0].toUpperCase()
    return 'U'
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superuser':
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'superuser':
        return 'destructive'
      case 'admin':
        return 'default'
      default:
        return 'secondary'
    }
  }

  // Show loading state while checking user role
  if (loading && !currentUserRole) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">User Role Management</h2>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Only show user management for superusers
  if ((currentUserRole && currentUserRole.role !== 'superuser') || !isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Access Restricted</h3>
          <p className="text-muted-foreground">Only superusers can manage user roles</p>
          {currentUserRole && (
            <p className="text-sm text-muted-foreground mt-2">
              Your current role: {currentUserRole.role}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Role Management</h2>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
        <Button onClick={fetchUsers} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Promote User Section - Only for superusers */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Promote User</h3>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                placeholder="Enter user email"
                value={promoteEmail}
                onChange={(e) => setPromoteEmail(e.target.value)}
                type="email"
              />
            </div>
            <Select value={promoteRole} onValueChange={(value: 'admin' | 'superuser') => setPromoteRole(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superuser">Superuser</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handlePromoteUser} 
              disabled={actionLoading === 'promote' || !promoteEmail}
            >
              {actionLoading === 'promote' ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Promote
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No users found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map((userItem) => (
            <Card key={userItem.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {getInitials(userItem.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {userItem.email}
                        </p>
                        <Badge variant={getRoleBadgeVariant(userItem.role)} className="flex items-center gap-1">
                          {getRoleIcon(userItem.role)}
                          {userItem.role}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        User ID: {userItem.user_id} | 
                        Joined: {formatDate(userItem.created_at)} | 
                        Updated: {formatDate(userItem.updated_at)}
                      </div>
                      {userItem.created_by && (
                        <div className="text-xs text-muted-foreground">
                          Promoted by: {userItem.created_by}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {userItem.role !== 'user' && userItem.email !== currentUserRole?.email && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={actionLoading === userItem.email}
                          >
                            {actionLoading === userItem.email ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              'Demote'
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Demote User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to demote {userItem.email} to a regular user? They will lose admin access.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDemoteUser(userItem.email)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Demote
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}


    </div>
  )
}