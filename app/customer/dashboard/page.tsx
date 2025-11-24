'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, History, Calendar, CheckCircle2, XCircle } from 'lucide-react';

export default function CustomerDashboard() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscription = async () => {
      // Wait for token to be available
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated. Please login again.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/v1/customer/subscription');
        setSubscription(response.data.subscription);
      } catch (err: any) {
        console.error('Failed to fetch subscription:', err);
        if (err.response?.status === 401) {
          setError('Authentication failed. Please login again.');
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } else if (err.response?.status === 404) {
          // No subscription found - this is okay
          setSubscription(null);
        } else {
          setError(err.response?.data?.message || 'Failed to load subscription');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loading) {
    return (
      <Layout role="customer">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="customer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your subscriptions and view your account</p>
        </div>
        
        {subscription ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <CardTitle>Current Subscription</CardTitle>
                </div>
                <Badge variant={subscription.status === 'active' ? 'success' : 'secondary'}>
                  {subscription.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Plan</p>
                  <p className="text-lg font-semibold">{subscription.pack.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="flex items-center space-x-2">
                    {subscription.is_valid ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-lg font-semibold">
                      {subscription.is_valid ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned</p>
                  <p className="text-lg font-semibold">
                    {new Date(subscription.assigned_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expires</p>
                  <p className="text-lg font-semibold flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(subscription.expires_at).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Active Subscription</CardTitle>
              <CardDescription>You don't have an active subscription yet</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/customer/subscription">Request Subscription</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/customer/subscription">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle>Manage Subscription</CardTitle>
                </div>
                <CardDescription>View or request subscriptions</CardDescription>
              </CardHeader>
            </Link>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/customer/history">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <History className="h-5 w-5 text-primary" />
                  <CardTitle>Subscription History</CardTitle>
                </div>
                <CardDescription>View your subscription history</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
