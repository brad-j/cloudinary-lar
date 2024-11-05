'use client';

import { useParams, useRouter } from 'next/navigation';
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
import { ChevronLeft, Loader2, Image as ImageIcon } from 'lucide-react';

type Asset = {
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  last_access: string;
  url: string;
  secure_url: string;
};

type ApiResponse = {
  resources: Asset[];
  next_cursor?: string;
};

export default function ReportDetails() {
  const params = useParams();
  const router = useRouter();
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [nextCursor, setNextCursor] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = React.useState(true);

  const fetchAssets = async (cursor?: string) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        max_results: '25', // Match the smaller batch size
      });

      if (cursor) {
        queryParams.append('next_cursor', cursor);
      }

      const response = await fetch(
        `/api/get-report/${params.id}?${queryParams.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error(errorData.error || 'Failed to fetch report details');
      }

      const data = await response.json();

      if (cursor) {
        setAssets((prev) => [...prev, ...data.resources]);
      } else {
        setAssets(data.resources || []);
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
    fetchAssets();
  }, [params.id]);

  const handleLoadMore = () => {
    if (nextCursor) {
      fetchAssets(nextCursor);
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

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  if (isLoading && assets.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent>
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
              Error loading report details: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-4">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Reports
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Report Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No assets found in this report.
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Dimensions</TableHead>
                      <TableHead>Last Access</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((asset) => (
                      <TableRow key={asset.public_id}>
                        <TableCell className="font-mono truncate max-w-[200px]">
                          <a href={asset.secure_url} target="_blank">
                            {asset.secure_url}
                          </a>
                        </TableCell>
                        <TableCell>
                          {asset.resource_type}/{asset.type}
                        </TableCell>
                        <TableCell>{asset.format}</TableCell>
                        <TableCell>{formatBytes(asset.bytes)}</TableCell>
                        <TableCell>
                          {asset.width} × {asset.height}
                        </TableCell>
                        <TableCell>{formatDate(asset.last_access)}</TableCell>
                        <TableCell>{formatDate(asset.created_at)}</TableCell>
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
    </div>
  );
}
