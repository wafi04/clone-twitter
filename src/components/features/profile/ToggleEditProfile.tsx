import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserData } from "@/lib/types";
import React, { useRef, useState } from "react";
import { useProfile } from "./useProfile";
import { Camera } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Resizer from "react-image-file-resizer";
import { CropImageDialog } from "../status/components/ButtonImage";

const ToggleEditProfile = ({ user }: { user: UserData }) => {
  const {
    bio,
    displayName,
    handleChange,
    backgroundImage,
    profileImage,
    setBackgroundImage,
    setProfileImage,
    handleSubmit,
  } = useProfile();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full font-semibold bg-transparent hover:bg-gray-200/25 text-black dark:text-white  border-2">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] sm:max-w-[500px] overflow-y-auto border-card pb-5 pt-0">
        <div className="flex items-center justify-between py-2">
          <h4>Edit Profile</h4>
          <Button className="rounded-full" onClick={handleSubmit}>
            Save
          </Button>
        </div>
        <div className="relative">
          <EditBackgroundImage
            image={backgroundImage}
            onImageChange={setBackgroundImage}
          />
          <ProfileImage image={profileImage} onImageChange={setProfileImage} />
          <div className="px-4 pt-20 space-y-4">
            <Input
              placeholder="Display name"
              value={displayName}
              onChange={handleChange("displayName")}
            />
            <Textarea
              placeholder="Bio"
              value={bio}
              onChange={handleChange("bio")}
              className="h-24"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ToggleEditProfile;

interface ImageEditorProps {
  image: string | undefined;
  onImageChange: (image: string | undefined) => void;
}

function ProfileImage({ image, onImageChange }: ImageEditorProps) {
  return (
    <div className="absolute top-20 left-4 w-32 h-32 rounded-full bg-none">
      <div className="w-full h-full bg-transparent overflow-hidden">
        {image && (
          <Image
            src={image}
            alt="Profile"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        )}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <ButtonCamera
          src={image || "/avatar-placeholder.png"}
          onImageCropped={(blob) =>
            onImageChange(blob ? URL.createObjectURL(blob) : undefined)
          }
          aspectRatio={1}
        />
      </div>
    </div>
  );
}

function EditBackgroundImage({ image, onImageChange }: ImageEditorProps) {
  return (
    <div className="w-full h-40 relative bg-white">
      {image && (
        <Image src={image} alt="Background" layout="fill" objectFit="cover" />
      )}
      <div className="absolute inset-0 flex w-full items-center justify-center gap-4">
        <ButtonCamera
          src={image || "/avatar-placeholder.png"}
          onImageCropped={(blob) =>
            onImageChange(blob ? URL.createObjectURL(blob) : undefined)
          }
          aspectRatio={2.5}
        />
      </div>
    </div>
  );
}

interface ButtonCameraProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
  aspectRatio: number;
}

function ButtonCamera({ src, onImageCropped, aspectRatio }: ButtonCameraProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) return;

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file"
    );
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        ref={fileInputRef}
        className="sr-only"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block w-full h-full"
      >
        <span className="absolute  inset-0 flex items-center justify-center  bg-opacity-30  ">
          <Button className="rounded-full p-2 text-white bg-gray-400 transition-colors duration-200 group-hover:bg-gray-600">
            <Camera size={24} />
          </Button>
        </span>
      </button>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={aspectRatio}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
}
