
import { useState, useEffect } from 'react';
import { X, Eye } from 'lucide-react';
import { CreativeFile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CreativePreviewProps {
  creative: CreativeFile;
  onRemove: (id: string) => void;
  onChange: (id: string, data: Partial<CreativeFile>) => void;
  useGlobalUrls: boolean;
}

const CreativePreview = ({
  creative,
  onRemove,
  onChange,
  useGlobalUrls,
}: CreativePreviewProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(creative.preview);
    };
  }, [creative.preview]);

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-auto overflow-hidden group">
        <img
          src={creative.preview}
          alt={creative.file.name}
          className="w-full h-full object-contain bg-gray-100 max-h-40"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setPreviewOpen(true)}
            className="mr-2"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove(creative.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium truncate max-w-[200px]">
            {creative.file.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {creative.width && creative.height
              ? `${creative.width}×${creative.height}`
              : 'Unknown size'}
          </div>
        </div>

        {!useGlobalUrls && (
          <div className="space-y-2">
            <div>
              <Label htmlFor={`click-${creative.id}`} className="text-xs">
                Click URL
              </Label>
              <Input
                id={`click-${creative.id}`}
                value={creative.clickUrl}
                onChange={(e) => onChange(creative.id, { clickUrl: e.target.value })}
                placeholder="https://"
                className="h-8 text-xs"
              />
            </div>

            <div>
              <Label htmlFor={`imp1-${creative.id}`} className="text-xs">
                Impression URL 1
              </Label>
              <Input
                id={`imp1-${creative.id}`}
                value={creative.impressionUrl1}
                onChange={(e) => onChange(creative.id, { impressionUrl1: e.target.value })}
                placeholder="https://"
                className="h-8 text-xs"
              />
            </div>

            <div>
              <Label htmlFor={`imp2-${creative.id}`} className="text-xs">
                Impression URL 2
              </Label>
              <Input
                id={`imp2-${creative.id}`}
                value={creative.impressionUrl2}
                onChange={(e) => onChange(creative.id, { impressionUrl2: e.target.value })}
                placeholder="https://"
                className="h-8 text-xs"
              />
            </div>
          </div>
        )}
      </CardContent>

      {/* Full size preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="w-full max-w-3xl">
          <DialogHeader>
            <DialogTitle>{creative.file.name}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center overflow-auto">
            <img
              src={creative.preview}
              alt={creative.file.name}
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {creative.width && creative.height
              ? `${creative.width}×${creative.height} pixels`
              : 'Unknown dimensions'}
            <span className="mx-2">•</span>
            {Math.round(creative.file.size / 1024)} KB
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CreativePreview;
