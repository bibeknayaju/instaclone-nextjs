"use client";
import { PostWithExtras } from "@/lib/definitions";
import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";
import { cn } from "@/lib/utils";
import { deletePost } from "@/lib/actions";

const PostOptions = ({
  post,
  userId,
  className,
}: {
  post: PostWithExtras;
  userId?: string;
  className?: string;
}) => {
  const isPostMine = post.userId === userId;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <MoreHorizontal
          className={cn(
            "h-5 w-5 cursor-pointer dark:text-neutral-400",
            className
          )}
        />
      </DialogTrigger>
      <DialogContent className="dialogContent">
        {isPostMine && (
          <form
            action={async (formData) => {
              const { message } = await deletePost(formData);
              toast(message);
            }}
            className="postOption">
            <input type="hidden" name="id" value={post.id} />
            <SubmitButton className="text-red-500 font-bold disabled:cursor-not-allowed w-full p-3">
              Delete post
            </SubmitButton>
          </form>
        )}

        {isPostMine && (
          <Link
            scroll={false}
            href={`/dashboard/p/${post.id}/edit`}
            className="postOption p-3">
            Edit
          </Link>
        )}

        <form action="" className="postOption border-0">
          <button className="w-full p-3">Hide like count</button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostOptions;
