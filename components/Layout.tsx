'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, LayoutDashboard, Users, Package, FileText, History } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role?: 'admin' | 'customer';
}

export default function Layout({ children, role }: LayoutProps) {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth store to initialize from localStorage
    const timer = setTimeout(() => {
      setIsChecking(false);
      
      // Check authentication - only redirect if we're not on a login/signup page
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup');
      
      if (!isAuthPage && (!user || (role && user.role !== role))) {
        router.push('/');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user, role, router]);

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem('token');
    router.push('/');
  };

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user || (role && user.role !== role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50 theme-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} className="text-xl font-bold text-gradient-theme flex items-center space-x-2 hover:scale-105 transition-transform">
                <LayoutDashboard className="h-6 w-6" />
                <span>License Management</span>
              </Link>
              {user.role === 'admin' && (
                <>
                  <Link href="/admin/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-secondary/50">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/admin/customers" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-secondary/50">
                    <Users className="h-4 w-4" />
                    <span>Customers</span>
                  </Link>
                  <Link href="/admin/packs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-secondary/50">
                    <Package className="h-4 w-4" />
                    <span>Packs</span>
                  </Link>
                  <Link href="/admin/subscriptions" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-secondary/50">
                    <FileText className="h-4 w-4" />
                    <span>Subscriptions</span>
                  </Link>
                </>
              )}
              {user.role === 'customer' && (
                <>
                  <Link href="/customer/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-secondary/50">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/customer/subscription" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-secondary/50">
                    <Package className="h-4 w-4" />
                    <span>Subscription</span>
                  </Link>
                  <Link href="/customer/history" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-secondary/50">
                    <History className="h-4 w-4" />
                    <span>History</span>
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button onClick={handleLogout} variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
