"use client";

import { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SocketProv } from "@/Context/SocketContext";
import OnlineCard from "../OnlineComponent/OnlineCard";
import { GetOnlineUsers } from "@/actions/user-action";

type Online = Awaited<ReturnType<typeof GetOnlineUsers>>;

const OnlineUsers = () => {
  const socketContext = useContext(SocketProv);
  const [onlineUsers, setOnlineUsers] = useState<Online>();

  useEffect(() => {

    console.log("Hello first point here")
    const socket = socketContext?.socketRef.current;
    const connected = socketContext?.connected;


    console.log("socket: ", socket)
    if (!connected) return

    const unsub = socketContext?.onMessage(async (data) => {
      console.log("My data:", data);
      const parsedData = JSON.parse(data)
      console.log("Parsed: ", parsedData);

      const users = await GetOnlineUsers(parsedData.payload)

      setOnlineUsers(users)
      console.log("Re render scheduled ?");
      
      return unsub
    });

    return () => {
      socket?.close()
    }
  }, [socketContext?.connected, socketContext]);

  return (
    <Card className="sticky top-80">
      <CardHeader>
        <CardTitle>
          <h1>Online Users</h1>
        </CardTitle>
      </CardHeader>
      {onlineUsers?.length === 0 ? (
        <CardContent>No Online Users</CardContent>
      ) : (
        onlineUsers?.map((user, id) => {
          return (
            <OnlineCard
              name={user.name || ""}
              username={user.username}
              key={id}
            />
          );
        })
      )}
    </Card>
  );
};

export default OnlineUsers;
