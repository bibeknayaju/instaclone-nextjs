import { PostWithExtras } from "@/lib/definitions";
import { Card } from "./ui/card";
import { auth } from "@/auth";
import UserAvatar from "./UserAvatar";
import Timestamp from "./Timestamp";
import PostOptions from "./PostOptions";
import Image from "next/image";
import Link from "next/link";
import PostActions from "./PostActions";
import Comments from "./Comments";

async function Post({ post }: { post: PostWithExtras }) {
  const session = await auth();

  const userId = session?.user?.id;
  const postUsername = post.user.username;

  if (!session?.user) return null;

  return (
    <div className="flex flex-col space-y-2.5">
      <div className="flex items-center justify-between px-3 sm:px-0">
        <div className="flex space-x-3 items-center">
          <UserAvatar user={post.user} />
          <div className="text-sm">
            <p className="space-x-1">
              <span className="font-semibold">{postUsername}</span>
              <span
                className="font-medium text-neutral-500 dark:text-neutral-400
                    text-xs
                  ">
                •
              </span>
              <Timestamp createdAt={post.createdAt} />
            </p>
            <p className="text-xs text-black dark:text-white font-medium">
              Dubai, United Arab Emirates
            </p>
          </div>
        </div>

        <PostOptions post={post} userId={userId} />
      </div>

      <Card className="relative h-[450px] w-full overflow-hidden rounded-none sm:rounded-md">
        <Image
          src={post.fileUrl}
          alt="post image"
          fill
          className="sm:rounded-md object-cover"
        />
      </Card>

      <PostActions post={post} userId={userId} className="px-3 sm:px-0" />

      {post.caption && (
        <div className="text-sm leading-none flex items-center space-x-2 font-medium px-3 sm:px-0">
          <Link className="font-bold" href={`/dashboard/${postUsername}`}>
            {postUsername}
          </Link>
          <p>{post.caption}</p>
        </div>
      )}

      <Comments postId={post.id} comments={post.comments} user={session.user} />
    </div>
  );
}

export default Post;
