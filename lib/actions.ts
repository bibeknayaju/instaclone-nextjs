"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  BookmarkSchema,
  CreateComment,
  CreatePost,
  DeleteComment,
  DeletePost,
  FollowUser,
  LikeSchema,
  UpdatePost,
  UpdateUser,
} from "./schemas";
// import {getUserId}
import { getUserId } from "./utils";

export async function createPost(values: z.infer<typeof CreatePost>) {
  const userId = await getUserId();

  const validateFields = CreatePost.safeParse(values);

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to create post",
    };
  }
  const { fileUrl, caption } = validateFields.data;

  //   create a post logic here
  try {
    await prisma.post.create({
      data: {
        caption,
        fileUrl,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to create post",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deletePost(formData: FormData) {
  const userId = await getUserId();

  const { id } = DeletePost.parse({
    id: formData.get("id"),
  });

  const post = await prisma.post.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  try {
    await prisma.post.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Post Deleted Successfully" };
  } catch (error) {
    throw new Error("Database Error: Failed to delete post");
  }
}

export async function likePost(value: FormDataEntryValue | null) {
  const userId = await getUserId();

  const validatedFields = LikeSchema.safeParse({ postId: value });

  if (!validatedFields.success) {
    return {
      message: "Missing Fields. Failed to like post",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { postId } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const like = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (like) {
    try {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      revalidatePath("/dashboard");
      return { message: "Post Unliked Successfully" };
    } catch (error) {
      return { message: "Database Error: Failed to unlike post" };
    }
  }

  try {
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });

    revalidatePath("/dashboard");
    return { message: "Post Liked Successfully" };
  } catch (error) {
    return { message: "Database Error: Failed to like post" };
  }
}

export async function bookmarkPost(value: FormDataEntryValue | null) {
  const userId = await getUserId();

  const validatedFields = BookmarkSchema.safeParse({ postId: value });

  if (!validatedFields.success) {
    return {
      message: "Missing Fields. Failed to bookmark post",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { postId } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found.");
  }

  const bookmark = await prisma.savedPost.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });
  if (bookmark) {
    try {
      await prisma.savedPost.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      revalidatePath("/dashboard");
      return { message: "Unbookmarked Post." };
    } catch (error) {
      return {
        message: "Database Error: Failed to Unbookmark Post.",
      };
    }
  }

  try {
    await prisma.savedPost.create({
      data: {
        postId,
        userId,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Bookmarked Post." };
  } catch (error) {
    return {
      message: "Database Error: Failed to Bookmark Post.",
    };
  }
}

// create a comment
export async function createComment(values: z.infer<typeof CreateComment>) {
  const userId = await getUserId();

  const validatedFields = CreateComment.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Comment.",
    };
  }

  const { postId, body } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  try {
    await prisma.comment.create({
      data: {
        body,
        postId,
        userId,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Created Comment." };
  } catch (error) {
    return { message: "Database Error: Failed to Create Comment." };
  }
}

// for deleitng comment
export async function deleteComment(formData: FormData) {
  const userId = await getUserId();

  const { id } = DeleteComment.parse({
    id: formData.get("id"),
  });

  const comment = await prisma.comment.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  try {
    await prisma.comment.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Comment Deleted Successfully" };
  } catch (error) {
    return { message: "Database Error: Failed to delete comment" };
  }
}

export async function updatePost(values: z.infer<typeof UpdatePost>) {
  const userId = await getUserId();

  const validatedFields = UpdatePost.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Post.",
    };
  }

  const { id, fileUrl, caption } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  try {
    await prisma.post.update({
      where: {
        id,
      },
      data: {
        fileUrl,
        caption,
      },
    });
  } catch (error) {
    return { message: "Database Error: Failed to Update Post." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateProfile(values: z.infer<typeof UpdateUser>) {
  const userId = await getUserId();

  const validatedFields = UpdateUser.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Profile.",
    };
  }

  const { bio, gender, image, name, username, website } = validatedFields.data;

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        name,
        image,
        bio,
        gender,
        website,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Updated Profile." };
  } catch (error) {
    return { message: "Database Error: Failed to Update Profile." };
  }
}

export async function followUser(formData: FormData) {
  const userId = await getUserId();

  const { id } = FollowUser.parse({
    id: formData.get("id"),
  });

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const follows = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        // followerId is of the person who wants to follow
        followerId: userId,
        // followingId is of the person who is being followed
        followingId: id,
      },
    },
  });

  if (follows) {
    try {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: id,
          },
        },
      });
      revalidatePath("/dashboard");
      return { message: "Unfollowed User." };
    } catch (error) {
      return {
        message: "Database Error: Failed to Unfollow User.",
      };
    }
  }

  try {
    await prisma.follows.create({
      data: {
        followerId: userId,
        followingId: id,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Followed User." };
  } catch (error) {
    return {
      message: "Database Error: Failed to Follow User.",
    };
  }
}
