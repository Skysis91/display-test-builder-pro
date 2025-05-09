
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CreativeFile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import FileUpload from '@/components/FileUpload';
import CreativePreview from '@/components/CreativePreview';
import { saveTest } from '@/services/fileService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CreateTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [creatives, setCreatives] = useState<CreativeFile[]>([]);
  const [testName, setTestName] = useState(`Test ${new Date().toLocaleDateString()}`);
  const [loading, setLoading] = useState(false);
  const [useGlobalUrls, setUseGlobalUrls] = useState(false);
  const [globalClickUrl, setGlobalClickUrl] = useState('');
  const [globalImpressionUrl1, setGlobalImpressionUrl1] = useState('');
  const [globalImpressionUrl2, setGlobalImpressionUrl2] = useState('');

  // Handle file upload
  const handleFilesAccepted = (newFiles: CreativeFile[]) => {
    setCreatives((prev) => [...prev, ...newFiles]);
  };

  // Remove a creative
  const handleRemoveCreative = (id: string) => {
    setCreatives((prev) => prev.filter((creative) => creative.id !== id));
  };

  // Update creative data
  const handleCreativeChange = (id: string, data: Partial<CreativeFile>) => {
    setCreatives((prev) =>
      prev.map((creative) =>
        creative.id === id ? { ...creative, ...data } : creative
      )
    );
  };

  // Apply global URLs to all creatives
  const applyGlobalUrls = () => {
    if (useGlobalUrls && creatives.length > 0) {
      const updatedCreatives = creatives.map((creative) => ({
        ...creative,
        clickUrl: globalClickUrl,
        impressionUrl1: globalImpressionUrl1,
        impressionUrl2: globalImpressionUrl2,
      }));
      setCreatives(updatedCreatives);
    }
  };

  // Basic URL validation
  const validateUrls = () => {
    if (useGlobalUrls) {
      // If using global URLs, validate them
      if (globalClickUrl && !globalClickUrl.startsWith('http')) {
        toast.error('Click URL must start with http:// or https://');
        return false;
      }
      if (globalImpressionUrl1 && !globalImpressionUrl1.startsWith('http')) {
        toast.error('Impression URL 1 must start with http:// or https://');
        return false;
      }
      if (globalImpressionUrl2 && !globalImpressionUrl2.startsWith('http')) {
        toast.error('Impression URL 2 must start with http:// or https://');
        return false;
      }
    } else {
      // If using individual URLs, validate each creative
      for (const creative of creatives) {
        if (creative.clickUrl && !creative.clickUrl.startsWith('http')) {
          toast.error(`Invalid Click URL for ${creative.file.name}`);
          return false;
        }
        if (creative.impressionUrl1 && !creative.impressionUrl1.startsWith('http')) {
          toast.error(`Invalid Impression URL 1 for ${creative.file.name}`);
          return false;
        }
        if (creative.impressionUrl2 && !creative.impressionUrl2.startsWith('http')) {
          toast.error(`Invalid Impression URL 2 for ${creative.file.name}`);
          return false;
        }
      }
    }
    return true;
  };

  // Generate the test
  const handleGenerateTest = async () => {
    if (creatives.length === 0) {
      toast.error('Please upload at least one creative file');
      return;
    }

    if (!testName.trim()) {
      toast.error('Please enter a test name');
      return;
    }

    if (!validateUrls()) {
      return;
    }

    setLoading(true);

    try {
      // Apply global URLs if enabled
      if (useGlobalUrls) {
        applyGlobalUrls();
      }

      // In a real app, this would upload files to a server
      // For this demo, we'll just simulate it
      const test = saveTest({
        name: testName,
        timestamp: Date.now(),
        creativeCount: creatives.length,
        author: user?.username || 'Unknown',
        creatives: creatives,
      });

      toast.success('Test generated successfully');
      navigate(`/test/${test.id}`);
    } catch (error) {
      console.error('Failed to generate test', error);
      toast.error('Failed to generate test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create New Display Test</h1>
          <p className="text-muted-foreground mt-1">
            Upload creatives and configure tracking URLs
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="test-name">Test Name</Label>
            <Input
              id="test-name"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Enter a name for this test"
            />
          </div>

          <FileUpload onFilesAccepted={handleFilesAccepted} />

          {creatives.length > 0 && (
            <div className="space-y-6 mt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Uploaded Creatives</h2>
                  <p className="text-sm text-muted-foreground">
                    {creatives.length} creative{creatives.length !== 1 ? 's' : ''} uploaded
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use-global-urls"
                    checked={useGlobalUrls}
                    onCheckedChange={(checked) => setUseGlobalUrls(!!checked)}
                  />
                  <Label htmlFor="use-global-urls">Use same URLs for all creatives</Label>
                </div>
              </div>

              {useGlobalUrls && (
                <div className="bg-muted/40 p-4 rounded-lg space-y-4">
                  <h3 className="font-medium">Global Tracking URLs</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <Label htmlFor="global-click-url">Click URL</Label>
                      <Input
                        id="global-click-url"
                        value={globalClickUrl}
                        onChange={(e) => setGlobalClickUrl(e.target.value)}
                        placeholder="https://"
                      />
                    </div>
                    <div>
                      <Label htmlFor="global-impression-url-1">Impression URL 1</Label>
                      <Input
                        id="global-impression-url-1"
                        value={globalImpressionUrl1}
                        onChange={(e) => setGlobalImpressionUrl1(e.target.value)}
                        placeholder="https://"
                      />
                    </div>
                    <div>
                      <Label htmlFor="global-impression-url-2">Impression URL 2</Label>
                      <Input
                        id="global-impression-url-2"
                        value={globalImpressionUrl2}
                        onChange={(e) => setGlobalImpressionUrl2(e.target.value)}
                        placeholder="https://"
                      />
                    </div>
                  </div>
                  <Button onClick={applyGlobalUrls}>Apply to All Creatives</Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {creatives.map((creative) => (
                  <CreativePreview
                    key={creative.id}
                    creative={creative}
                    onRemove={handleRemoveCreative}
                    onChange={handleCreativeChange}
                    useGlobalUrls={useGlobalUrls}
                  />
                ))}
              </div>

              {creatives.length > 0 && (
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleGenerateTest}
                    disabled={loading}
                    className="bg-brand-600 hover:bg-brand-700"
                    size="lg"
                  >
                    {loading ? 'Generating...' : 'Generate Test'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {creatives.length === 0 && (
            <Alert>
              <AlertDescription>
                No creatives uploaded yet. Use the upload area above to add display ads.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTest;
