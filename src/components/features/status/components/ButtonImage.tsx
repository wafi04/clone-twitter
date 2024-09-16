import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import "cropperjs/dist/cropper.css";
import { Cropper, ReactCropperElement } from "react-cropper";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageUploadsProps {
  disabled?: boolean;
  setSelectedImage: (file: File) => void;
  className?: string;
  setPreviewSrc?: (src: string | null) => void;
}

function HandleImageUploads({
  disabled,
  setSelectedImage,
  className,
  setPreviewSrc,
}: ImageUploadsProps) {
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCropSrc(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  const handleCropped = (blob: Blob | null) => {
    if (blob) {
      const croppedFile = new File([blob], "cropped_image.webp", {
        type: "image/webp",
      });
      setSelectedImage(croppedFile);
      if (setPreviewSrc) {
        setPreviewSrc(URL.createObjectURL(blob));
      }
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn(`hover:bg-transparent rounded-full`, className)}
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} className="text-[#1DA1F2]" />
      </Button>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {cropSrc && (
        <CropImageDialog
          src={cropSrc}
          cropAspectRatio={1}
          onCropped={handleCropped}
          onClose={() => setCropSrc(null)}
        />
      )}
    </>
  );
}

export function CropImageDialog({
  src,
  cropAspectRatio,
  onCropped,
  onClose,
}: {
  src: string;
  cropAspectRatio: number;
  onCropped: (blob: Blob | null) => void;
  onClose: () => void;
}) {
  const cropperRef = useRef<ReactCropperElement>(null);

  function crop() {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
        </DialogHeader>
        <Cropper
          src={src}
          aspectRatio={cropAspectRatio}
          guides={false}
          zoomable={false}
          ref={cropperRef}
          className="mx-auto h-[50vh] w-full"
        />
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={crop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default HandleImageUploads;
