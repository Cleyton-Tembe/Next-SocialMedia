"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function SyncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return;

    const checkuser = await prisma.user.findUnique({
      where: {
        clerkid: userId,
      },
    });

    if (checkuser) return checkuser;

    const saveUser = await prisma.user.create({
      data: {
        clerkid: userId,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        image: user.imageUrl,
      },
    });

    return saveUser;
  } catch (error) {
    console.log("SyncUser Error:", error);
  }
}

export async function GetUserByClerkId(clerkid: string) {
  try {
    return prisma.user.findUnique({
      where: {
        clerkid: clerkid,
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            post: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("GetUserByClerkId:", error);
  }
}

export async function GetDbUserId() {
  const { userId: clerkid } = await auth();

  if (!clerkid) return;

  const user = await GetUserByClerkId(clerkid);

  if (!user) return;

  return user.id;
}

export async function GetRandomUsers() {
  try {
    const userId = await GetDbUserId();

    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });

    return randomUsers;
  } catch (error) {
    console.error("Get RandomUser Error:", error);
    return [];
  }
}

export async function ToggleFollow(targetUserId: string) {
  try {
    const userId = await GetDbUserId();

    if(!userId) return;

    if (userId === targetUserId) throw new Error("You Can't follow yourself");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
        await prisma.$transaction([
            prisma.follows.create({
                data: {
                    followerId: userId,
                    followingId: targetUserId
                }
            }), 
            prisma.notification.create({
                data:{
                    type: "FOLLOW",
                    userId: targetUserId,
                    creatorId: userId,
                }
            })
        ])
    }

    revalidatePath("/")

    return {success: true}

  } catch (error) {
    console.error("Toggle Follow:", error);
    return {success: false,}
  }
}

export async function GetOnlineUsers(ids: string []) {
  const onlineUsers = await prisma.user.findMany({
    where: {
      id: {
        in: ids
      }
    },

    select: {
      name: true,
      username: true,
      image: true,
    }
  })

  console.log("Online users: ",onlineUsers)

  return onlineUsers
}
