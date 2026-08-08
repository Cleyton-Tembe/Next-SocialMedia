import { Avatar, AvatarBadge, AvatarImage } from "../ui/avatar";
import { CardContent } from "../ui/card"


const OnlineCard = ({name, username}: {name: string, username: string}) => {
  return (
      <CardContent className="flex start gap-4">
        <Avatar className="cursor-pointer w-14 h-14">
          <AvatarImage src={"/user.png"} alt="user profile image" />
          <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
        <div>
          <h2>{name}</h2>
          <h3 className="text-muted-foreground">@{username}</h3>
        </div>
      </CardContent>
  );
}

export default OnlineCard