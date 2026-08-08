import { GetPost } from "@/actions/post-action";
import { GetDbUserId } from "@/actions/user-action";
import Recomended from "@/components/Follow/Recomended";
import OnlineUsers from "@/components/global/OnlineUsers";
import CreatePost from "@/components/Posts/CreatePost";
import PostCard from "@/components/Posts/PostCard";
import { currentUser } from "@clerk/nextjs/server";

type Post = NonNullable<Awaited<ReturnType<typeof GetPost>>>;

export default async function Home() {
  const user = await currentUser();
  const posts: Post = (await GetPost()) || [];
  const dbUserId = (await GetDbUserId()) || "";

  return (
    <main className="grid grid-cols-1 lg:grid-cols-10 gap-5">
      <div className="lg:col-span-6">
        {user ? <CreatePost /> : null}

        <div className="space-y-6 pb-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} dbUserId={dbUserId} />
          ))}
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-4 space-y-5">
        <Recomended />
        <OnlineUsers />
      </div>
    </main>
  );
}
