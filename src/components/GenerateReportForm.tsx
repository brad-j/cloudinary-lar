// app/components/GenerateReportForm.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from 'lucide-react';

export default function GenerateReportForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [response, setResponse] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const [formData, setFormData] = React.useState({
    from_date: '',
    to_date: '',
    resource_type: '',
    exclude_folders: '',
    sort_by: 'accessed_at',
    sort_order: 'desc',
  });

  const resourceTypes = ['', 'image', 'video', 'raw'];
  const sortOptions = ['created_at', 'updated_at', 'resource_type'];

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResponse(null);

    try {
      const excludeFolders = formData.exclude_folders
        ? formData.exclude_folders.split(',').map((folder) => folder.trim())
        : [];

      const payload = {
        ...formData,
        exclude_folders: excludeFolders,
      };

      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch report');
      }

      setResponse(data);
      // Close modal after successful submission
      setTimeout(() => {
        setOpen(false);
        // Reset form after modal closes
        setFormData({
          from_date: '',
          to_date: '',
          resource_type: '',
          exclude_folders: '',
          sort_by: 'accessed_at',
          sort_order: 'desc',
        });
      }, 2000);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Last Access Report</DialogTitle>
          <DialogDescription>
            Generate a report of when your Cloudinary assets were last accessed.
            Select a date range and configure your report options below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">From Date</label>
              <input
                type="date"
                name="from_date"
                value={formData.from_date}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">To Date</label>
              <input
                type="date"
                name="to_date"
                value={formData.to_date}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Resource Type{' '}
              <span className="text-xs text-neutral-500">
                (Leave blank for all types)
              </span>
            </label>
            <select
              name="resource_type"
              value={formData.resource_type}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Exclude Folders{' '}
              <span className="text-xs text-neutral-500">
                (comma-separated, up to 50)
              </span>
            </label>
            <input
              type="text"
              name="exclude_folders"
              value={formData.exclude_folders}
              onChange={handleInputChange}
              placeholder="docs, website, temp"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <select
                name="sort_by"
                value={formData.sort_by}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Sort Order
              </label>
              <select
                name="sort_order"
                value={formData.sort_order}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Generating Report...' : 'Generate Report'}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>
          )}

          {response && (
            <div className="p-4 bg-green-50 text-green-600 rounded-md">
              Report generated successfully! Check your Cloudinary dashboard.
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
