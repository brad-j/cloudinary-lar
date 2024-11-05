// app/components/ReportsList.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, Loader2 } from 'lucide-react';

type Report = {
  id: string;
  status: string;
  created_at: string;
  params: {
    resource_type?: string;
    from_date?: string;
    to_date?: string;
  };
  total_resources: number;
};

export default function ReportsList() {
  const [reports, setReports] = React.useState<Report[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [nextCursor, setNextCursor] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = React.useState(true);

  const fetchReports = async (cursor?: string) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        max_results: '10',
      });

      if (cursor) {
        params.append('next_cursor', cursor);
      }

      const response = await fetch(`/api/get-reports?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();

      // Use the "reports" array from the response
      const reportsData = data.reports || [];

      if (cursor) {
        setReports((prev) => [...prev, ...reportsData]);
      } else {
        setReports(reportsData);
      }

      setNextCursor(data.next_cursor || null);
      setHasMore(!!data.next_cursor);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReports();
  }, []);

  const handleLoadMore = () => {
    if (nextCursor) {
      fetchReports(nextCursor);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && reports.length === 0) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="p-4 bg-red-50 text-red-600 rounded-md">
            Error loading reports: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generated Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reports generated yet. Use the button above to generate your
            first report.
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Resource Type</TableHead>
                    <TableHead>Total Resources</TableHead>
                    <TableHead>From Date</TableHead>
                    <TableHead>To Date</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-mono truncate max-w-[200px]">
                        {report.id}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            report.status === 'done'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {report.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {report.params.resource_type || 'N/A'}
                      </TableCell>
                      <TableCell>{report.total_resources}</TableCell>
                      <TableCell>
                        {report.params.from_date
                          ? formatDate(report.params.from_date)
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {report.params.to_date
                          ? formatDate(report.params.to_date)
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{formatDate(report.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {isLoading ? (
              <div className="mt-4 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              hasMore && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={!nextCursor}
                  >
                    Load More
                  </Button>
                </div>
              )
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
