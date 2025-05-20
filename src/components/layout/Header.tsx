
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/Logo';
import { UserCircle, LogOut, LogIn, UserPlus } from 'lucide-react';

export function Header() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="flex items-center space-x-4">
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted"></div>
          ) : isAuthenticated ? (
            <>
              <span className="text-sm text-foreground hidden sm:inline">
                Welcome, {user?.username || 'User'}!
              </span>
              {/* <Button variant="ghost" size="sm" asChild>
                <Link href="/profile"> <UserCircle className="mr-2 h-4 w-4" /> Profile</Link>
              </Button> */}
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login"><LogIn className="mr-2 h-4 w-4" />Login</Link>
              </Button>
              <Button variant="default" size="sm" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/register"><UserPlus className="mr-2 h-4 w-4" />Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
