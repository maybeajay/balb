import React, { useRef, useState } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { FaRegLaugh } from "react-icons/fa";
import { supabase } from "../../supabase.js";
import PickEmoji from "../shared/PickEmoji.js";
import { HiOutlineUpload } from "react-icons/hi";
import Loader from "../shared/Loader.js";
import { useDispatch } from "react-redux";
import { catchErrors } from "../slices/errorsSlice.js";
import { useAppSelector} from "../types.js";
const ChatInput = () => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [showEmoji, setshowEmoji] = useState<boolean>(false);
  const { userData }:any = useAppSelector((state) => state.user);
  const [imagePreview, setimagePreview] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const uploadRef:any = useRef();
  const dispatch = useDispatch();
  async function addMessage(imageURl: string | null) {
    let finalURL;
    if (imageURl) {
      finalURL = `${imageURl}-${Date.now() * 1000}`;
    } 

    let userDetails = await getSenderDetails();
    try {
      setisLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            created_at: new Date(),
            message: message ? message : null,
            type: "global",
            document: finalURL ? finalURL : null,                         
            sender_id: userData?.user?.id,
            is_deleted: false,
            first_name: userDetails?.first_name,
            last_name: userDetails?.last_name
          },
        ])
        .select();

      if (error) {
        console.error("Error inserting data:", error);
      } else {
        setMessage("");
      }
    } catch (error) {
      setisLoading(false);
      console.log("error occureddd", error);
    } finally {
      setisLoading(false);
    }
  }

  async function getSenderDetails() {
    let { data: users, error } = await supabase.from("users").select("*").eq("id", userData?.user?.id);
    if(users){
      return users[0];
    }
    if(error){
      console.error(error);
    }
  }

  async function uploadImage(file: File | null) {
    try {
      setisLoading(true);
      const { data, error } = await supabase.storage
        .from("balb_document/images")
        .upload(file?.name, file, {
          cacheControl: "3600",
        });
      if (data) {
        const publicURL = supabase.storage
          .from("balb_document/images")
          .getPublicUrl(file?.name);
        addMessage(publicURL?.data?.publicUrl);
        setimagePreview("");
        setImage(null);
      }
      if (error) {
        console.error("Error uploading file:", error);
        dispatch(catchErrors("Error uploading File"));
        setImage(null);
        setimagePreview("");
        return null;
      }
      return data?.fullPath;
    } catch (error) {
    } finally {
      setisLoading(false);
    }
  }

  const handleMessageSend = async () => {
    if (imagePreview != "") {
      uploadImage(image);
    } else {
      addMessage(null);
    }
  };
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  let isDisabled = message.trim().length <= 0 && imagePreview == "";
  // let isDisabled = false
  // for uploading images in the chats
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>
   ) => {
    try {
      setisLoading(true);
      if(!e.target.files) return ;
      const file = e?.target?.files && e?.target?.files[0];
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setimagePreview(objectUrl);
    } finally {
      setisLoading(false);
    }
  };
  return (
    <div className="border-t border-gray-200 px-6 py-3 flex flex-col justify-between">
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-l-lg p-2 focus:outline-[#7678ed]"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => handleChange(e)}
        />
        {imagePreview && (
          <div className="w-1/5 h-1/5 absolute z-20 right-[30vh] bottom-[20vh]">
            <img src={imagePreview} alt="image" />
          </div>
        )}
        <button
          className={` transition-all w-[50] h-[50] rounded-md relative right-10`}
          onClick={() => setshowEmoji(!showEmoji)}
        >
          <FaRegLaugh color={`${showEmoji ? "#9b51e0" : "black"}`} size={25} />
        </button>
        <button
          className={`text-white px-4 py-2 rounded-r-lg ${
            isDisabled ? "bg-gray-300" : "bg-blue-500"
          }`}
          disabled={isDisabled}
          onClick={() => handleMessageSend()}
        >
          {isLoading ? <Loader size={1} color="blue" /> : <LuSendHorizonal />}
        </button>

        {/* upload  images */}
        <div
          className="flex justify-center items-center w-[40px] h-[40px] mx-3 bg-gray-300 rounded-md hover:cursor-pointer"
          onClick={() => uploadRef?.current?.click()}
          // animate={{ x: 100 }}
          // initial={false}
        >
          <button className="transition-all rounded-md relative">
            <HiOutlineUpload />
          </button>
          <input
            type="file"
            ref={uploadRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
          />
        </div>
      </div>
      <div className="flex flex-col items-end transition-all ease-out mx-3">
        {showEmoji && <PickEmoji setMessage={setMessage} message={message} />}
      </div>
    </div>
  );
};

export default ChatInput;
