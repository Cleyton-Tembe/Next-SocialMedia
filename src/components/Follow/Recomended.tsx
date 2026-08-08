import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarImage } from "../ui/avatar";
import { GetRandomUsers } from "@/actions/user-action";
import FollowButton from "./FollowButton";


const Recomended = async () => {
    const users = await GetRandomUsers();

    if (users.length === 0) return null;

    return (
      <Card className="sticky top-20">
        <CardHeader>
          <CardTitle>Who to Follow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3.5">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between "
              >
                <div className="flex items-center gap-5">
                  <Link href={`/profile/${user.username}`}>
                    <Avatar>
                      <AvatarImage src={user.image ?? "/avatar.png"} />
                    </Avatar>
                  </Link>
                  <div className="text-xs">
                    <Link
                      href={`/profile/${user.username}`}
                      className="font-medium cursor-pointer"
                    >
                      {user.name}
                    </Link>
                    <p className="text-muted-foreground">@{user.username}</p>
                    <p className="text-muted-foreground">
                      {user._count.followers} followers
                    </p>
                  </div>
                </div>
                <FollowButton userid={user.id} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
}

export default Recomended