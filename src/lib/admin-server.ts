import { clerkClient } from '@clerk/nextjs/server'
import { getCurrentUser } from '@/lib/user'
import { ADMIN_EMAILS } from '@/lib/admin'

export async function checkAdminRole() {
  const user = await getCurrentUser()
  
  if (!user) {
    return { authorized: false, error: 'Unauthorized' }
  }

  // Check if user's email is in admin list
  const userEmail = user.primaryEmailAddress?.emailAddress
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    return { authorized: false, error: 'Admin access required' }
  }

  return { authorized: true, user }
}

export async function checkSuperAdminRole() {
  const user = await getCurrentUser()
  
  if (!user) {
    return { authorized: false, error: 'Unauthorized' }
  }

  // Only arif@afna.link is superadmin
  const userEmail = user.primaryEmailAddress?.emailAddress
  if (userEmail !== 'arif@afna.link') {
    return { authorized: false, error: 'Super admin access required' }
  }

  return { authorized: true, user }
}

export async function getAllUsers(page = 1, limit = 10, search = '') {
  const authCheck = await checkAdminRole()
  if (!authCheck.authorized) {
    return { error: authCheck.error, users: [], total: 0 }
  }

  try {
    const clerk = await clerkClient()
    
    // Build query parameters
    const queryParams: {
      limit: number;
      offset: number;
      query?: string;
    } = {
      limit,
      offset: (page - 1) * limit,
    }

    // Add search filter if provided
    if (search) {
      queryParams.query = search
    }

    const userList = await clerk.users.getUserList(queryParams)
    
    const users = userList.data.map(user => ({
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      role: user.publicMetadata?.role || 'user',
      banned: user.banned,
    }))

    return {
      users,
      total: userList.totalCount,
      page,
      limit,
      totalPages: Math.ceil(userList.totalCount / limit)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { error: 'Failed to fetch users', users: [], total: 0 }
  }
}

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  const authCheck = await checkSuperAdminRole()
  if (!authCheck.authorized) {
    return { error: authCheck.error }
  }

  try {
    const clerk = await clerkClient()
    
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        role
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { error: 'Failed to update user role' }
  }
}

export async function deleteUser(userId: string) {
  const authCheck = await checkSuperAdminRole()
  if (!authCheck.authorized) {
    return { error: authCheck.error }
  }

  try {
    const clerk = await clerkClient()
    await clerk.users.deleteUser(userId)
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { error: 'Failed to delete user' }
  }
}