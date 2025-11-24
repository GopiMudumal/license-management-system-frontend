import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Shield, Users, Key } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-gradient-theme mb-4">
            License Management System
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your licenses and subscriptions with ease
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="group">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <CardTitle className="text-gradient-theme">Admin Portal</CardTitle>
              </div>
              <CardDescription>
                Access the admin dashboard to manage the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/login">Admin Login</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <CardTitle className="text-gradient-theme">Customer Portal</CardTitle>
              </div>
              <CardDescription>
                Login to manage your subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/customer/login">Customer Login</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Key className="h-6 w-6 text-accent group-hover:scale-110 transition-transform" />
                <CardTitle className="text-gradient-theme">New Customer</CardTitle>
              </div>
              <CardDescription>
                Create a new customer account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/customer/signup">Sign Up</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
