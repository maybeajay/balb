import { useEffect, useState } from "react";
import { supabase } from "../../supabase.js";
import { format } from "date-fns";
import EmptyMessage from "./EmptyMessage.js";
import { useAppSelector } from "../types.js";
import { CheckCheck } from "lucide-react";
import { userTypeData, Message } from "../types.ts";

function ChatBox({ selectedId }: { selectedId: string | null }) {
  const [messages, setMessage] = useState<Message[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [newMsg, setnewMsg] = useState<string>("");
  const { userData } = useAppSelector(state=>state.user);

  // for realtime messages and updates
  const subscribeToRealtime = async () => {
    let channels;
    try {
      setisLoading(true);
      channels = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "individual_chats" },
          (payload) => {
            setMessage((prevMessages: Message[]) => {
              let index = prevMessages.findIndex(
                (message) =>
                  message.id === payload.old?.id || message.id === payload.new.id
              );
              if (payload.new.is_deleted) {
                if (index !== -1) {
                  const updatedMessages = [...prevMessages];
                  updatedMessages[index] = {
                    ...payload.new,
                    content: "This message is deleted",
                  };
                  return updatedMessages;
                }
              } else {
                if (payload.old?.id) {
                  if (index !== -1) {
                    const updatedMessages = [...prevMessages];
                    updatedMessages[index] = payload.new;
                    return updatedMessages;
                  }
                } else {
                  return [...prevMessages, payload.new];
                }
              }
              return prevMessages;
            });
          }
        )
        .subscribe();
    } catch (error) {
      console.error("Error subscribing to real-time updates:", error);
    } finally {
      setisLoading(false);
    }
    return channels;
  };

  useEffect(() => {
    (async function getMessages() {
      if (selectedId == null) return;
      let { data: individual_chats, error } = await supabase
        .from("individual_chats")
        .select("*")
        .eq("receiver_id", selectedId)
        .order("created_at", { ascending: true });

      if (individual_chats) {
        setMessage(individual_chats as Message[]);
      }
    })();

    const channel = subscribeToRealtime();
  }, [selectedId]);

  const updateMessageSeenStatus = async (messageId: string) => {
    const { error } = await supabase
      .from("individual_chats")
      .update({ is_seen: true })
      .eq("id", messageId);

    if (error) {
      console.error("Error updating message seen status:", error);
    }
  };

  useEffect(() => {
    const markMessagesAsSeen = async () => {
      const unseenMessages = messages.filter(
        (msg: Message) =>
          msg.receiver_id === userData?.user?.id && !msg.is_seen
      );

      for (const message of unseenMessages) {
        await updateMessageSeenStatus(message?.id);
      }
    };

    if (messages.length > 0) {
      markMessagesAsSeen();
    }
  }, [messages, userData?.user?.id]);

  const sendMessage = async () => {
    try {
      setisLoading(true);
      const { data, error } = await supabase
        .from("individual_chats")
        .insert([
          {
            created_at: new Date(),
            content: newMsg,
            sender_id: userData?.user?.id,
            receiver_id: selectedId,
            is_deleted: false,
            is_seen: false,
          },
        ])
        .select();
      setnewMsg("");

      if (error) {
        console.error("Error inserting data:", error);
      }
    } catch (error) {
      setisLoading(false);
      console.log("Error occurred", error);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <>
      <div className="w-full flex flex-row">
        <div className="w-full flex flex-col h-[50vh] mt-10 border-gray-50">
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col space-y-4">
              {messages.length >= 1 && !isLoading ? (
                messages.map((msg: Message, id) => (
                  <div
                    className={`${
                      msg?.sender_id === userData?.user?.id
                        ? "self-end bg-blue-500 text-white"
                        : "self-start bg-gray-400 text-white"
                    } max-w-xs p-3 rounded-l-lg rounded-br-lg shadow-md`}
                    key={id}
                  >
                    <p>{msg.content}</p>
                    <div className="flex flex-row items-center justify-center gap-3">
                      <span className="text-xs text-gray-200">
                        {msg?.created_at &&
                          format(new Date(msg?.created_at), "MM/dd/yyyy")}
                      </span>

                      {msg?.is_seen ? (
                        <CheckCheck size={20} color={"#cee0fd"} />
                      ) : (
                        <CheckCheck size={20} color={"#5995f7"} />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyMessage />
              )}
            </div>
          </div>

          {/* Chat Input */}
          <div className="flex items-center p-4 bg-white border-t border-gray-300">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 mr-2 border rounded-full border-gray-300 focus:outline-none focus:border-blue-500"
              onChange={(e) => setnewMsg(e.target.value)}
              value={newMsg}
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              disabled={newMsg.trim().length < 1}
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatBox;
