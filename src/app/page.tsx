import GenerateReportForm from '@/components/GenerateReportForm';
import ReportsList from '@/components/ReportsList';

export default function Home() {
  return (
    <main className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cloudinary Last Access Reports</h1>
        <GenerateReportForm />
      </div>
      <ReportsList />
    </main>
  );
}
