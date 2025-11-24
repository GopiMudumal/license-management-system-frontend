'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, XCircle, Pause, Play, Edit, Trash2, ChevronLeft, ChevronRight, Clock, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingSub, setEditingSub] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ status: '', expires_at: '', expires_at_time: '' });

  useEffect(() => {
    loadSubscriptions();
  }, [pagination.page, statusFilter]);

  const loadSubscriptions = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await api.get(`/api/v1/admin/subscriptions?${params}`);
      setSubscriptions(response.data.subscriptions);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await api.post(`/api/v1/admin/subscriptions/${id}/approve`);
      loadSubscriptions();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve subscription');
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Are you sure you want to reject this subscription request?')) {
      return;
    }
    try {
      await api.post(`/api/v1/admin/subscriptions/${id}/reject`);
      loadSubscriptions();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject subscription');
    }
  };

  const handlePause = async (id: number) => {
    if (!confirm('Are you sure you want to pause this subscription?')) {
      return;
    }
    try {
      await api.post(`/api/v1/admin/subscriptions/${id}/pause`);
      loadSubscriptions();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to pause subscription');
    }
  };

  const handleUpdate = async (id: number, quickUpdate?: { status?: string; expires_at?: string }) => {
    try {
      const updateData: any = quickUpdate || {};
      
      if (!quickUpdate) {
        // From edit form
        if (editForm.status) updateData.status = editForm.status;
        if (editForm.expires_at) {
          // Combine date and time
          let date: Date;
          if (editForm.expires_at_time) {
            // Combine date and time
            const dateTimeString = `${editForm.expires_at}T${editForm.expires_at_time}`;
            date = new Date(dateTimeString);
          } else {
            // Just date, set to end of day
            date = new Date(editForm.expires_at);
            date.setHours(23, 59, 59, 999);
          }
          updateData.expires_at = date.toISOString();
        }
      } else if (quickUpdate.expires_at) {
        // Quick update with expires_at
        updateData.expires_at = quickUpdate.expires_at;
      }
      
      await api.patch(`/api/v1/admin/subscriptions/${id}`, updateData);
      setEditingSub(null);
      setEditForm({ status: '', expires_at: '', expires_at_time: '' });
      loadSubscriptions();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update subscription');
    }
  };

  const handleCheckExpired = async () => {
    try {
      const response = await api.post('/api/v1/admin/subscriptions/check-expired');
      alert(response.data.message || 'Expired subscriptions checked');
      loadSubscriptions();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to check expired subscriptions');
    }
  };

  const setExpirationToMinutes = async (id: number, minutes: number) => {
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + minutes);
    await handleUpdate(id, { expires_at: expirationDate.toISOString() });
  };

  const formatTimeRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return 'No expiration';
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff < 0) return 'Expired';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this subscription? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/api/v1/admin/subscriptions/${id}`);
      loadSubscriptions();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete subscription');
    }
  };

  const startEdit = (sub: any) => {
    setEditingSub(sub.id);
    const expiresDate = sub.expires_at ? new Date(sub.expires_at) : null;
    setEditForm({
      status: sub.status || '',
      expires_at: expiresDate ? expiresDate.toISOString().split('T')[0] : '',
      expires_at_time: expiresDate ? expiresDate.toTimeString().split(' ')[0].substring(0, 5) : '',
    });
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
            <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
            <p className="text-muted-foreground">Manage all subscription requests and assignments</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleCheckExpired}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Check Expired
            </Button>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-48"
            >
              <option value="">All Statuses</option>
              <option value="requested">Requested</option>
              <option value="approved">Approved</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <CardTitle>All Subscriptions</CardTitle>
            </div>
            <CardDescription>View and manage subscription requests</CardDescription>
          </CardHeader>
          <CardContent>
            {subscriptions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No subscriptions found.
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Pack</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead>Expires At</TableHead>
                        <TableHead>Time Remaining</TableHead>
                        <TableHead className="w-[350px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{sub.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{sub.customer_name || 'N/A'}</div>
                              <div className="text-sm text-muted-foreground">{sub.customer_email || ''}</div>
                            </div>
                          </TableCell>
                          <TableCell>{sub.pack_name}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                sub.status === 'active' ? 'success' :
                                sub.status === 'requested' ? 'warning' :
                                sub.status === 'expired' ? 'destructive' :
                                'secondary'
                              }
                            >
                              {sub.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {sub.requested_at ? new Date(sub.requested_at).toLocaleString() : '-'}
                          </TableCell>
                          <TableCell>
                            {sub.expires_at ? (
                              <div className="flex flex-col">
                                <span>{new Date(sub.expires_at).toLocaleDateString()}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(sub.expires_at).toLocaleTimeString()}
                                </span>
                              </div>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            {sub.expires_at ? (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span className={formatTimeRemaining(sub.expires_at) === 'Expired' ? 'text-red-500 font-semibold' : ''}>
                                  {formatTimeRemaining(sub.expires_at)}
                                </span>
                              </div>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            {editingSub === sub.id ? (
                              <div className="space-y-2 min-w-[220px]">
                                <div className="space-y-1">
                                  <Label className="text-xs">Status</Label>
                                  <Select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    className="w-full text-sm"
                                  >
                                    <option value="">Keep current</option>
                                    <option value="requested">Requested</option>
                                    <option value="approved">Approved</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="expired">Expired</option>
                                  </Select>
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">Expires At</Label>
                                  <div className="flex gap-1">
                                    <Input
                                      type="date"
                                      value={editForm.expires_at}
                                      onChange={(e) => setEditForm({ ...editForm, expires_at: e.target.value })}
                                      className="w-full text-sm"
                                    />
                                    <Input
                                      type="time"
                                      value={editForm.expires_at_time}
                                      onChange={(e) => setEditForm({ ...editForm, expires_at_time: e.target.value })}
                                      className="w-full text-sm"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-1 pt-1">
                                  <Button
                                    onClick={() => handleUpdate(sub.id)}
                                    size="sm"
                                    variant="default"
                                    className="text-sm flex-1"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setEditingSub(null);
                                      setEditForm({ status: '', expires_at: '' });
                                    }}
                                    size="sm"
                                    variant="outline"
                                    className="text-sm"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-1 flex-wrap">
                                {sub.status === 'requested' && (
                                  <>
                                    <Button
                                      onClick={() => handleApprove(sub.id)}
                                      size="sm"
                                      variant="outline"
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => handleReject(sub.id)}
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {sub.status === 'active' && (
                                  <>
                                    <Button
                                      onClick={() => handlePause(sub.id)}
                                      size="sm"
                                      variant="outline"
                                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                    >
                                      <Pause className="h-4 w-4 mr-1" />
                                      Pause
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                        >
                                          <Clock className="h-4 w-4 mr-1" />
                                          Set Expiry
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={() => setExpirationToMinutes(sub.id, 1)}
                                          className="cursor-pointer"
                                        >
                                          1 minute
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => setExpirationToMinutes(sub.id, 5)}
                                          className="cursor-pointer"
                                        >
                                          5 minutes
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => setExpirationToMinutes(sub.id, 10)}
                                          className="cursor-pointer"
                                        >
                                          10 minutes
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => setExpirationToMinutes(sub.id, 30)}
                                          className="cursor-pointer"
                                        >
                                          30 minutes
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </>
                                )}
                                {(sub.status === 'inactive' || sub.status === 'approved') && (
                                  <Button
                                    onClick={() => handleUpdate(sub.id, { status: 'active' })}
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  >
                                    <Play className="h-4 w-4 mr-1" />
                                    Activate
                                  </Button>
                                )}
                                <Button
                                  onClick={() => startEdit(sub)}
                                  size="sm"
                                  variant="outline"
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => handleDelete(sub.id)}
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            )}
                          </TableCell>
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
