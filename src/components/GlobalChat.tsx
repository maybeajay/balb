import { useEffect, useState } from "react";
import { supabase } from "../supabase.js";
import { format, parseISO, isBefore, addMinutes } from "date-fns";
import { FaTrash } from "react-icons/fa";
import ChatInput from "./ChatInput.js";
import DeleteModal from "../Modals/DeleteModal.js";
import { useSelector } from "react-redux";
import ViewImage from "../Modals/ViewImage.js";
import { AnimatePresence, motion } from "framer-motion";
import ContentLoader from "react-content-loader";
import useChatScroll from "../hooks/useScrollRef.js";
type Data = {
  map: any;
  id: number;
  date: string;
  type: string;
  message: string;
  length: number;
  created_at: string;
  is_deleted: boolean;
  first_name: string;
  last_name: string;
  sender_id: number | undefined;
  document: string | undefined;
  payload: {};
};

function GlobalChat() {
  const [messages, setMessages] = useState<Data[]>([]);
  const [showModal, setshowModal] = useState<boolean>(false);
  const [uniqueId, setuniqueId] = useState<number | null>(null);
  const { userData } = useSelector((state: any) => state.user);
  const [isActive, setisActive] = useState<boolean>(false);
  const [imageUrl, setimageUrl] = useState<string | undefined>("");
  const [isnewMessage, setisNewMessage] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [showOptions, setshowOptions] = useState<boolean[]>(
    Array(messages.length).fill(false)
  );
  const fetchAllMessages = async () => {
    try {
      let { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });
      if (messages) {
        setMessages(messages);
      }
      if (error) {
        console.error(error);
      }
    } catch (error) {
    }
  };
  const subscribeToRealtime = async () => {
    let channels;
    try {
      setisLoading(true);
       channels = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          (payload) => {
            setMessages((prevMessages: any) => {
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
                  setisNewMessage(true);
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
    } finally {
      setisLoading(false);
    }
    return channels;
  };

  useEffect(() => {
    fetchAllMessages();
    let channel = subscribeToRealtime();
    return ()=>{
      supabase.removeChannel(channel);
    }
    // getCurrentUser();
  }, []);

  const formateDate = (date: string) => {
    if (!date) return;
    else {
      const newDate = parseISO(date);
      return format(newDate, "HH:mm");
    }
  };

  const handleMouseOver = (ind: number) => {
    setshowOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[ind] = true;
      return newOptions;
    });
  };

  const handleMouseLeave = (ind: number) => {
    setshowOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[ind] = false;
      return newOptions;
    });
  };

  const handleCloseModal = (uuid: number) => {
    setuniqueId(uuid);
    setshowModal(true);
  };

  const canDeleteMessage = (createdAt: string) => {
    const createdAtDate = parseISO(createdAt);
    const deadline = addMinutes(createdAtDate, 15);
    const currentTime = new Date();
    return isBefore(currentTime, deadline);
  };

  const handleImageModal = (url: string | undefined) => {
    setimageUrl(url);
    setisActive(true);
  };

  // ref of message 
  const chatScrollRef = useChatScroll(messages)
  return (
    <>
      {isLoading ? (
        <Shimmer />
      ) : (
        <div className="container mx-auto mt-3 flex items-center p-10">
          <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Messages */}
            <div className="p-6 h-96 overflow-y-scroll" ref={chatScrollRef}>
              <div className="space-y-4">
                {/* Message from others */}
                {/* Message from user */}
                <div >
                  <div className="text-white p-3 rounded-lg">
                    <div className="flex flex-col gap-2">
                      {messages.length > 0 &&
                        messages.map((msg: Data, ind: number) => (
                          <div
                            className={`chat-message flex ${
                              userData?.user?.id === msg.sender_id
                                ? "justify-end"
                                : "justify-start"
                            }`}
                            key={ind}
                          >
                            <div
                              className={`flex flex-col space-y-2 text-xs max-w-md mx-2 order-1 items-${
                                userData?.user?.id === msg.sender_id
                                  ? "end"
                                  : "start"
                              } justify-${
                                userData?.user?.id === msg.sender_id
                                  ? "end"
                                  : "start"
                              }`}
                            >
                              <div
                                className={`min-w-[18vw] ${
                                  msg?.message
                                    ? userData &&
                                      userData?.user &&
                                      userData?.user.id === msg?.sender_id
                                      ? "bg-[#7678ed] text-white"
                                      : "bg-gray-300 text-black"
                                    : ""
                                } rounded-md custom-rounded`}
                                onMouseEnter={() => handleMouseOver(ind)}
                                onMouseLeave={() => handleMouseLeave(ind)}
                              >
                                {showOptions[ind] === true &&
                                  canDeleteMessage(msg.created_at) &&
                                  msg.is_deleted !== true &&
                                  userData?.user?.id === msg.sender_id && (
                                    <div className="flex justify-between p-3">
                                      <FaTrash
                                        color={"#fff"}
                                        className="hover:cursor-pointer"
                                        size={20}
                                        onClick={() =>
                                          handleCloseModal(msg?.id)
                                        }
                                      />
                                    </div>
                                  )}
                                <p className="text-xs p-2 mr-3">
                                  {userData?.user?.id &&
                                  userData?.user.id === msg.sender_id
                                    ? "You"
                                    : `${msg?.first_name} ${msg?.last_name}`}
                                </p>
                                <div className="flex flex-col">
                                  {msg?.message ? (
                                    <span className="px-4 py-2 rounded-lg inline-block rounded-br-none font-semibold p-5 text-md">
                                      {msg?.is_deleted !== true
                                        ? msg?.message
                                        : "this message was deleted"}
                                    </span>
                                  ) : (
                                    <img
                                      src={msg?.document}
                                      alt="image-file"
                                      onClick={() =>
                                        handleImageModal(msg?.document)
                                      }
                                      className="hover:cursor-pointer image-shadow w-[50vw] h-[40vh] object-cover"
                                      loading="lazy"
                                    />
                                  )}
                                  <p className="px-4 py-2 rounded-lg inline-block rounded-br-none p-5 text-end">
                                    {formateDate(msg?.created_at)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* {msg?.sender_id === 1 ? (
                          <img
                            src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                            alt="My profile"
                            className="w-12 h-12 rounded-md order-2"
                          />
                        ) : (
                          <p>o immggg</p>
                        )} */}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              {isnewMessage && !userData.user?.id && (
                <motion.div>
                  <p>New Message</p>
                </motion.div>
              )}
            </div>
            <ChatInput />
            {/* Delete Modal */}
            <AnimatePresence>
              {showModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <DeleteModal
                    setshowModal={setshowModal}
                    uuid={uniqueId}
                    setMessages={setMessages}
                    // message={messages ? true : false}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
      {/* view image */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ViewImage
              imgUrl={imageUrl}
              setisActive={setisActive}
              isActive={isActive}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export const Shimmer = () => {
  return (
    <ContentLoader
      speed={3}
      width={800}
      height={460}
      viewBox="0 0 800 460"
      backgroundColor="#f5f5f5"
      foregroundColor="#dbdbdb"
    >
      {/* Outer frame rectangle */}
      <rect x="12" y="35" rx="0" ry="0" width="6" height="246" />
      <rect x="14" y="34" rx="0" ry="0" width="408" height="6" />
      <rect x="416" y="34" rx="0" ry="0" width="6" height="246" />
      <rect x="12" y="276" rx="0" ry="0" width="408" height="6" />

      <rect x="40" y="60" rx="10" ry="10" width="140" height="30" />
      <rect x="40" y="120" rx="10" ry="10" width="140" height="30" />

      <rect x="220" y="180" rx="10" ry="10" width="180" height="30" />
      <rect x="220" y="230" rx="10" ry="10" width="150" height="30" />
    </ContentLoader>
  );
};
export default GlobalChat;
