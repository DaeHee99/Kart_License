"use client";

import { Input } from "@/components/ui/input";
import { MinimalTiptap } from "@/components/ui/shadcn-io/minimal-tiptap";
import {
  Dropzone,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { Image as ImageIcon, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface NewPostFormProps {
  title: string;
  content: string;
  images: File[];
  existingImages?: string[];
  category?: string;
  isAdmin?: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onImagesChange: (images: File[]) => void;
  onExistingImagesChange?: (images: string[]) => void;
  onCategoryChange?: (category: string) => void;
}

export function NewPostForm({
  title,
  content,
  images,
  existingImages = [],
  category = "general",
  isAdmin = false,
  onTitleChange,
  onContentChange,
  onImagesChange,
  onExistingImagesChange,
  onCategoryChange,
}: NewPostFormProps) {
  const handleRemoveExistingImage = (index: number) => {
    if (onExistingImagesChange) {
      const newImages = existingImages.filter((_, i) => i !== index);
      onExistingImagesChange(newImages);
    }
  };
  return (
    <div className="space-y-4">
      {/* 카테고리 선택 */}
      {onCategoryChange && (
        <div>
          <label className="mb-3 block text-sm font-medium">카테고리</label>
          <RadioGroup
            value={category}
            onValueChange={onCategoryChange}
            className="flex gap-2"
          >
            {isAdmin && (
              <div className="flex-1">
                <RadioGroupItem
                  value="notice"
                  id="category-notice"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="category-notice"
                  className="border-input hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground flex cursor-pointer items-center justify-center rounded-md border-2 px-4 py-2 text-sm font-medium transition-all"
                >
                  공지
                </Label>
              </div>
            )}
            <div className="flex-1">
              <RadioGroupItem
                value="general"
                id="category-general"
                className="peer sr-only"
              />
              <Label
                htmlFor="category-general"
                className="border-input hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground flex cursor-pointer items-center justify-center rounded-md border-2 px-4 py-2 text-sm font-medium transition-all"
              >
                일반
              </Label>
            </div>
            <div className="flex-1">
              <RadioGroupItem
                value="question"
                id="category-question"
                className="peer sr-only"
              />
              <Label
                htmlFor="category-question"
                className="border-input hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground flex cursor-pointer items-center justify-center rounded-md border-2 px-4 py-2 text-sm font-medium transition-all"
              >
                질문
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}

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
          이미지 업로드 (최대 10개, 기존 이미지 포함)
        </label>

        {/* 기존 이미지 표시 */}
        {existingImages.length > 0 && (
          <div className="mb-3 grid grid-cols-4 gap-2">
            {existingImages.map((imageUrl, index) => (
              <div key={index} className="group relative aspect-square">
                <img
                  src={imageUrl}
                  alt={`기존 이미지 ${index + 1}`}
                  className="h-full w-full rounded-md object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleRemoveExistingImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Dropzone
          accept={{ "image/*": [] }}
          maxFiles={10 - existingImages.length}
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
