'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Package, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { formatValidity } from '@/lib/format-validity';

export default function AdminPacks() {
  const [packs, setPacks] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    validity_months: '',
  });

  useEffect(() => {
    loadPacks();
  }, [pagination.page]);

  const loadPacks = async () => {
    try {
      const response = await api.get(`/api/v1/admin/subscription-packs?page=${pagination.page}&limit=${pagination.limit}`);
      setPacks(response.data.packs);
      setPagination(response.data.pagination);
      // Show form automatically if no packs exist
      if (response.data.packs.length === 0 && !showForm) {
        setShowForm(true);
      }
    } catch (error) {
      console.error('Failed to load packs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/v1/admin/subscription-packs', {
        ...formData,
        price: parseFloat(formData.price),
        validity_months: parseInt(formData.validity_months),
      });
      setShowForm(false);
      setFormData({ name: '', description: '', sku: '', price: '', validity_months: '' });
      loadPacks();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create pack');
    }
  };

  if (loading) {
    return (
      <Layout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscription Packs</h1>
            <p className="text-muted-foreground">Manage subscription plans</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
            variant={showForm ? "outline" : "default"}
          >
            {showForm ? (
              <>
                <X className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create New Pack
              </>
            )}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create Subscription Pack</CardTitle>
              <CardDescription>Add a new subscription plan to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Premium Plan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Full access to all features"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    type="text"
                    placeholder="premium-plan"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="29.99"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validity">Validity (months)</Label>
                    <Input
                      id="validity"
                      type="number"
                      min="1"
                      max="12"
                      placeholder="12"
                      value={formData.validity_months}
                      onChange={(e) => setFormData({ ...formData, validity_months: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Create Pack</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ name: '', description: '', sku: '', price: '', validity_months: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <CardTitle>All Packs</CardTitle>
            </div>
            <CardDescription>List of all subscription packs</CardDescription>
          </CardHeader>
          <CardContent>
            {packs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No subscription packs found.
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Validity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packs.map((pack) => (
                        <TableRow key={pack.id}>
                          <TableCell className="font-medium">{pack.id}</TableCell>
                          <TableCell>{pack.name}</TableCell>
                          <TableCell className="font-mono text-sm">{pack.sku}</TableCell>
                          <TableCell>${pack.price}</TableCell>
                          <TableCell>{formatValidity(pack.validityMonths || pack.validity_months)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                      disabled={pagination.page * pagination.limit >= pagination.total}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
