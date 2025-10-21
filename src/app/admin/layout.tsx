import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/user';
import { ADMIN_EMAILS } from '@/lib/admin';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/sign-in?redirect_url=/admin');
  }

  const userEmail = user.primaryEmailAddress?.emailAddress;
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    redirect('/?error=admin_access_required');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}