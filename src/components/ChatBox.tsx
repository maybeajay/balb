import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase.js";
import { format } from "date-fns";
import EmptyMessage from "./EmptyMessage.js";
type Props = {
  userId: string;
};

function ChatBox({ userId }: Props) {
  const [messages, setMessage] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [newMsg, setnewMsg] = useState<string>("")
  const subscribeToRealtime = async () => {
    try {
      setisLoading(true);
      const channels = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "individual_chats" },
          (payload) => {
            setMessage((prevMessages) => {
              let index = prevMessages.findIndex(
                (message) =>
                  message.id === payload.old?.id ||
                  message.id === payload.new.id
              );
              if (payload.new.is_deleted) {
                // If the new payload indicates the message is deleted
                if (index !== -1) {
                  // Update the message to show it is deleted
                  const updatedMessages = [...prevMessages];
                  updatedMessages[index] = {
                    ...payload.new,
                    content: "This message is deleted",
                  };
                  return updatedMessages;
                }
              } else {
                if (payload.old?.id) {
                  // Update the message if it exists
                  if (index !== -1) {
                    const updatedMessages = [...prevMessages];
                    updatedMessages[index] = payload.new;
                    return updatedMessages;
                  }
                } else {
                  // Add the new message to the messages array
                  return [...prevMessages, payload.new];
                }
              }
              return prevMessages; // Return previous state if no changes are made
            });
          }
        )
        .subscribe();
    } catch (error) {
      console.error("Error subscribing to real-time updates:", error);
    }finally{
      setisLoading(false);
    }
  };
  useEffect(() => {
    (async function getMessages() {
      let { data: individual_chats, error } = await supabase
        .from("individual_chats")
        .select("*")
        .order('created_at', { ascending: true })

      if (individual_chats) {
        setMessage(individual_chats);
      }
    })();
    subscribeToRealtime();
  }, []);

  const sendMessage = async ()=>{
    try {
      setisLoading(true);
      const { data, error } = await supabase
    .from("individual_chats")
    .insert([
      {
        created_at: new Date(),
        content: newMsg,
        sender_id: 'c447596a-8a94-428d-a9d3-cf1794551453',
        receiver_id: "aabd8b96-518b-4357-ae47-03f3749c138c",
        is_deleted: false,
        read: false
      },
    ])
    .select();
    setnewMsg("")

  if (error) {
    console.error("Error inserting data:", error);
  }
    } catch (error) {
      setisLoading(false);
      console.log("error occureddd",error);
    }finally{
      setisLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col h-[50vh] mt-10 border-gray-50">
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {/* Sender Message */}
            {
                (messages.length >=1 && !isLoading) ? messages.map((msg, id)=> <div  className={`${msg?.sender_id === "aae35fae-8252-4b53-98bc-0267c482990c" ? "self-end bg-blue-500 text-white" : "self-start bg-gray-400 text-white"} max-w-xs p-3  rounded-l-lg rounded-br-lg shadow-md`} key={id}>
                <p>{msg.content}</p>
                <span className="text-xs text-gray-200">{msg?.created_at && format(msg?.created_at, "MM/dd/yyyy")}</span>
              </div> )  : <EmptyMessage />
            }
          </div>
        </div>

        {/* Chat Input */}
        <div className="flex items-center p-4 bg-white border-t border-gray-300">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 mr-2 border rounded-full border-gray-300 focus:outline-none focus:border-blue-500"
            onChange={(e)=>setnewMsg(e.target.value)}
            value={newMsg}
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700" disabled={newMsg.trim().length <1} onClick={sendMessage} >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
