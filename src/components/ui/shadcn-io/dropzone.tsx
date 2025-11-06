'use client';

import { useCallback, useState } from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { Upload, X, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DropzoneProps extends DropzoneOptions {
  src?: File[];
  className?: string;
  children?: React.ReactNode;
}

export function Dropzone({ src, className, children, ...props }: DropzoneProps) {
  const [files, setFiles] = useState<File[]>(src || []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    props.onDrop?.(acceptedFiles, [], {} as any);
  }, [props]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...props,
    onDrop,
  });

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-primary/50',
          files.length > 0 && 'border-primary/50'
        )}
      >
        <input {...getInputProps()} />
        {children || (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? '파일을 여기에 놓으세요'
                : '클릭하거나 파일을 드래그하여 업로드'}
            </p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group rounded-lg border border-border overflow-hidden bg-muted/30"
            >
              <div className="aspect-square relative">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileImage className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                onClick={() => removeFile(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DropzoneEmptyState() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Upload className="w-8 h-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        클릭하거나 파일을 드래그하여 업로드
      </p>
      <p className="text-xs text-muted-foreground">
        이미지 파일만 업로드 가능 (최대 10개, 10MB)
      </p>
    </div>
  );
}

export function DropzoneContent() {
  return null;
}
