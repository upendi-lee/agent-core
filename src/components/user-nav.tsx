
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { User } from 'lucide-react';

export function UserNav() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <Link href="/login" passHref>
      <Button asChild variant="ghost" className="relative h-10 w-10 rounded-full">
        <Avatar className="h-10 w-10 border-2 border-primary/50">
          {userAvatar ? (
            <AvatarImage
              src={userAvatar.imageUrl}
              alt="사용자 아바타"
              data-ai-hint={userAvatar.imageHint}
            />
          ) : (
            <User className="h-5 w-5" />
          )}
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </Button>
    </Link>
  );
}
