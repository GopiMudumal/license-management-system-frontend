'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History as HistoryIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CustomerHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [pagination.page]);

  const loadHistory = async () => {
    try {
      const response = await api.get(`/api/v1/customer/subscription-history?page=${pagination.page}&limit=${pagination.limit}`);
      setHistory(response.data.history);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold tracking-tight">Subscription History</h1>
          <p className="text-muted-foreground">View your past and current subscriptions</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <HistoryIcon className="h-5 w-5" />
              <CardTitle>History</CardTitle>
            </div>
            <CardDescription>All your subscription records</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No subscription history found.
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assigned</TableHead>
                        <TableHead>Expires</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.pack_name}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                item.status === 'active' ? 'success' :
                                item.status === 'expired' ? 'destructive' :
                                'secondary'
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {item.assigned_at ? new Date(item.assigned_at).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>
                            {item.expires_at ? new Date(item.expires_at).toLocaleDateString() : '-'}
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
