import { useEffect, useState } from "react";
import { supabase } from "../../supabase.js";
import ToastNotifs from "./ToastNotifs.js";
interface Notification {
  content: string | null;
  created_at: string | null;
  read: boolean | null;
  type: string | null;
}

const Notifications = () => {
  const [notifs, setNotifs] = useState<Notification[]>([
    {
      content: null,
      read: null,
      created_at: null,
      type: null,
    },
  ]);
  useEffect(() => {
    const getRealtimeNotifications = async () => {
      const channels = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "notifications" },
          (payload) => {
            console.log("Change received!", payload);
            setNotifs((prev)=>[...prev, payload.new])
          }
        ).subscribe();
      return channels;
    };

    // get the real time notifcations
    const channel  = getRealtimeNotifications();
    return()=>supabase.removeChannel(channel)
    console.log("NOTFTSS", notifs);
  }, []);
  return (
    <div>
      <ToastNotifs
        content={notifs[0].content}
        Time={notifs[0]?.created_at}
        type={notifs[0]?.type}
        fullName={null}
      />
    </div>
  );
};

export default Notifications;
