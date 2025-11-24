'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { formatValidity } from '@/lib/format-validity';

export default function CustomerSubscription() {
  const [subscription, setSubscription] = useState<any>(null);
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [selectedSku, setSelectedSku] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subRes, packsRes] = await Promise.all([
        api.get('/api/v1/customer/subscription').catch(() => ({ data: null })),
        api.get('/api/v1/customer/subscription-packs?limit=100').catch((err) => {
          console.error('Failed to load packs:', err);
          console.error('Error details:', err.response?.data || err.message);
          return { data: { packs: [] } };
        }),
      ]);
      setSubscription(subRes.data?.subscription || null);
      
      // Handle different response formats
      const packsData = packsRes.data?.packs || packsRes.data || [];
      const packsArray = Array.isArray(packsData) ? packsData : [];
      setPacks(packsArray);
      
      if (packsArray.length === 0) {
        console.warn('No subscription packs available. An admin needs to create subscription packs first.');
        setMessage('No subscription packs available. Please contact an admin.');
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    if (!selectedSku) {
      setMessage('Please select a subscription pack');
      return;
    }

    setRequesting(true);
    setMessage('');

    try {
      await api.post('/api/v1/customer/subscription', { sku: selectedSku });
      setMessage('Subscription request submitted successfully!');
      setSelectedSku('');
      setTimeout(() => loadData(), 1000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to request subscription');
    } finally {
      setRequesting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm('Are you sure you want to deactivate your subscription?')) return;

    try {
      await api.delete('/api/v1/customer/subscription');
      setMessage('Subscription deactivated successfully!');
      setTimeout(() => loadData(), 1000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to deactivate subscription');
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">My Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription details</p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg border ${
            message.includes('success') 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>{message}</span>
            </div>
          </div>
        )}

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
                  <p className="text-sm font-medium text-muted-foreground">Plan Name</p>
                  <p className="text-lg font-semibold">{subscription.pack.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SKU</p>
                  <p className="text-lg font-semibold">{subscription.pack.sku}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p className="text-lg font-semibold">${subscription.pack.price}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="flex items-center space-x-2">
                    {subscription.status === 'active' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-lg font-semibold">{subscription.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned</p>
                  <p className="text-lg font-semibold flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {subscription.assigned_at 
                        ? new Date(subscription.assigned_at).toLocaleDateString()
                        : subscription.approved_at
                        ? new Date(subscription.approved_at).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expires</p>
                  <p className="text-lg font-semibold flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {subscription.expires_at 
                        ? new Date(subscription.expires_at).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </p>
                </div>
              </div>
              {subscription.status === 'active' && (
                <Button onClick={handleDeactivate} variant="destructive" className="w-full">
                  Deactivate Subscription
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Request New Subscription</CardTitle>
              <CardDescription>Select a subscription pack to request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pack">Select Subscription Pack</Label>
                <Select
                  id="pack"
                  value={selectedSku}
                  onChange={(e) => setSelectedSku(e.target.value)}
                >
                  <option value="">Choose a pack...</option>
                  {packs.map((pack) => (
                    <option key={pack.id} value={pack.sku}>
                      {pack.name} - ${pack.price} ({formatValidity(pack.validityMonths || pack.validity_months)})
                    </option>
                  ))}
                </Select>
              </div>
              <Button
                onClick={handleRequest}
                disabled={requesting || !selectedSku}
                className="w-full"
              >
                {requesting ? 'Requesting...' : 'Request Subscription'}
              </Button>
              <p className="text-sm text-muted-foreground">
                Your request will be reviewed by an admin before activation.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
