'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Shield, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/admin/login', formData);
      const { token, email } = response.data;

      if (!token) {
        setError('Invalid response from server');
        setLoading(false);
        return;
      }

      setAuth({ id: 0, email, role: 'admin' }, token);
      localStorage.setItem('token', token);
      
      // Only redirect on success
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setLoading(false);
      
      // Don't redirect on error - show error message instead
      if (err.response) {
        // Server responded with error
        const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Login failed';
        setError(errorMessage);
        console.error('Server error:', errorMessage);
      } else if (err.request) {
        // Request made but no response
        setError('Unable to connect to server. Please check if the backend is running.');
        console.error('Network error:', err.request);
      } else {
        // Something else happened
        setError(err.message || 'An unexpected error occurred');
        console.error('Error:', err.message);
      }
    }
  };

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <Card className="w-full max-w-md theme-glow">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/20 p-4 theme-glow">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gradient-theme">Admin Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            {error && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md border-2 border-destructive/30 flex items-start space-x-2 animate-in fade-in-50">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Login Failed</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
