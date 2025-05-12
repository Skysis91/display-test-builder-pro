
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { getTestById, downloadTestHtml, downloadTestZip } from '@/services/fileService';
import { ArrowLeft, FileText, Download, Eye, Archive } from 'lucide-react';
import { GeneratedTest } from '@/types';
import { Separator } from '@/components/ui/separator';

const TestView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<GeneratedTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingZip, setDownloadingZip] = useState(false);

  useEffect(() => {
    if (!id) return;

    try {
      const foundTest = getTestById(id);
      if (foundTest) {
        setTest(foundTest);
      } else {
        toast.error('Test not found');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to load test', error);
      toast.error('Failed to load test');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const handleDownload = () => {
    if (test) {
      downloadTestHtml(test);
      toast.success('HTML file downloaded');
    }
  };

  const handleDownloadZip = async () => {
    if (!test) return;
    
    setDownloadingZip(true);
    try {
      await downloadTestZip(test);
      toast.success('ZIP file with HTML and images downloaded');
    } catch (error) {
      console.error('Failed to download ZIP:', error);
      toast.error('Failed to download ZIP file');
    } finally {
      setDownloadingZip(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!test) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Test not found</h2>
          <p className="text-muted-foreground mb-4">
            The requested test could not be found.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{test.name}</h1>
            <p className="text-muted-foreground">
              Created on {new Date(test.timestamp).toLocaleString()} by {test.author}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" /> Download HTML
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDownloadZip} 
            disabled={downloadingZip}
          >
            <Archive className="h-4 w-4 mr-1" /> 
            {downloadingZip ? 'Preparing ZIP...' : 'Download ZIP'}
          </Button>
          <a
            href={test.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button>
              <Eye className="h-4 w-4 mr-1" /> Open Preview
            </Button>
          </a>
        </div>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-lg font-medium">
            Creatives ({test.creativeCount})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {test.creatives.map((creative) => (
              <div key={creative.id} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-2 flex justify-center">
                  <img
                    src={creative.preview}
                    alt={creative.file.name}
                    className="max-h-40 object-contain"
                  />
                </div>
                <div className="p-3 text-sm">
                  <div className="font-medium truncate mb-1">{creative.file.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {creative.width}×{creative.height} • {Math.round(creative.file.size / 1024)} KB
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex">
                      <span className="font-medium w-16">Click:</span>
                      <span className="truncate">{creative.clickUrl || 'None'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-16">Imp 1:</span>
                      <span className="truncate">{creative.impressionUrl1 || 'None'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-16">Imp 2:</span>
                      <span className="truncate">{creative.impressionUrl2 || 'None'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TestView;
