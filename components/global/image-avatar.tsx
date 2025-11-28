import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  color?: string;
}

export function ImageAvatar({
  name,
  email,
  imageUrl,
  color = "from-gray-500 to-gray-600",
}: AvatarProps) {
  // Safe string conversions
  const safeName = typeof name === "string" ? name.trim() : "";
  const safeEmail = typeof email === "string" ? email.trim() : "";

  // Initial fallback
  const initial =
    safeName.length > 0
      ? safeName.charAt(0).toUpperCase()
      : safeEmail.length > 0
      ? safeEmail.charAt(0).toUpperCase()
      : "?";

  // Validate image URL
  const hasImage =
    typeof imageUrl === "string" &&
    imageUrl.trim().length > 4 &&
    (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"));

  // Avatar when an image is available
  const ImageCircle = (
    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 cursor-pointer hover:scale-105 transition-all">
      <img
        src={imageUrl!}
        alt="Avatar"
        className="w-full h-full object-cover"
        onError={(e) => {
          // If the image fails, hide & fallback to initials
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );

  // Avatar when NO image exists
  const InitialCircle = (
    <div
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br text-white font-semibold text-sm",
        color
      )}
    >
      {initial}
    </div>
  );

  // If no image → return initials (NOT clickable)
  if (!hasImage) return InitialCircle;

  // If image exists → clickable dialog preview
  return (
    <Dialog>
      <DialogTrigger asChild>{ImageCircle}</DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Profile Photo</DialogTitle>
        </DialogHeader>

        <img
          src={imageUrl!}
          alt="Profile Full"
          className="w-full h-auto rounded-lg object-cover"
        />
      </DialogContent>
    </Dialog>
  );
}
