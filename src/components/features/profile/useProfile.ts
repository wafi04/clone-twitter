import { useUser } from "@/hooks/useUser";
import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";

export function useProfile() {
  const { user } = useUser();
  const [displayName, setDisplayName] = useState<string>(
    user?.displayName || ""
  );
  const [bio, setBio] = useState<string>(user?.bio || "");
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
    user?.backgorundImage
  );
  const [profileImage, setProfileImage] = useState<string | undefined>(
    user?.image
  );

  const updateUser = useMutation(api.users.updateUser);
  const generateUploadUrl = useMutation(api.status.generateUploadUrl);
  const { toast } = useToast();

  const uploadImage = async (
    imageUrl: string | undefined
  ): Promise<string | undefined> => {
    if (!imageUrl) return undefined;

    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: await (await fetch(imageUrl)).arrayBuffer(),
      });

      if (!result.ok) {
        throw new Error("Image upload failed");
      }

      const { storageId } = await result.json();
      return storageId;
    } catch (error) {
      console.error("Image upload error:", error);
      toast({ description: "Failed to upload image" });
      return undefined;
    }
  };

  const handleChange =
    (field: "displayName" | "bio") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (field === "displayName") {
        setDisplayName(value);
      } else if (field === "bio") {
        setBio(value);
      }
    };

  const handleSubmit = useCallback(async () => {
    const backgroundImageId = await uploadImage(backgroundImage);
    const profileImageId = await uploadImage(profileImage);

    try {
      await updateUser({
        updateData: {
          backgorundImage: backgroundImageId,
          bio,
          displayName,
          image: profileImageId,
        },
      });
      toast({ description: "Profile updated successfully!" });
    } catch (error) {
      console.error("Update error:", error);
      toast({ description: "Something went wrong" });
    }
  }, [
    backgroundImage,
    profileImage,
    bio,
    displayName,
    updateUser,
    toast,
    uploadImage,
  ]);

  return {
    displayName,
    setDisplayName,
    profileImage,
    setProfileImage,
    backgroundImage,
    setBackgroundImage,
    bio,
    setBio,
    handleChange,
    handleSubmit,
  };
}
