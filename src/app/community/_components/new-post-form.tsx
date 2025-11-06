"use client";

import { Input } from "@/components/ui/input";
import { MinimalTiptap } from "@/components/ui/shadcn-io/minimal-tiptap";
import {
  Dropzone,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { Image as ImageIcon } from "lucide-react";

interface NewPostFormProps {
  title: string;
  content: string;
  images: File[];
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onImagesChange: (images: File[]) => void;
}

export function NewPostForm({
  title,
  content,
  images,
  onTitleChange,
  onContentChange,
  onImagesChange,
}: NewPostFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">제목</label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="제목을 입력하세요"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">내용</label>
        <MinimalTiptap
          content={content}
          onChange={onContentChange}
          placeholder="내용을 입력하세요..."
          className="min-h-[300px]"
        />
      </div>
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium">
          <ImageIcon className="h-4 w-4" />
          이미지 업로드
        </label>
        <Dropzone
          accept={{ "image/*": [] }}
          maxFiles={10}
          maxSize={1024 * 1024 * 10}
          minSize={1024}
          onDrop={(files) => onImagesChange([...images, ...files])}
          src={images}
        >
          <DropzoneEmptyState />
        </Dropzone>
      </div>
    </div>
  );
}
