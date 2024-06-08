import React, { ReactEventHandler, useState } from 'react'
import { LuSendHorizonal } from "react-icons/lu";
import { FaRegLaugh } from "react-icons/fa";
import {supabase} from "../../supabase.js"
import PickEmoji from '../shared/PickEmoji.js';
import Loader from '../shared/Loader.js';
import { useSelector } from 'react-redux';
type Props = {}

const ChatInput = (props: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading ,setisLoading] = useState<boolean>(false);
  const [showEmoji, setshowEmoji] = useState<boolean>(false);
  const { userData} = useSelector((state: any) => state.user);
  async function addMessage() {
      try {
        setisLoading(true);
        const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          created_at: new Date(),
          message: message,
          type: "global",
          document: null,
          sender_id: userData?.user.id,
          is_deleted: false
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Inserted data:", data);
      setMessage("");
    }
      } catch (error) {
        setisLoading(false);
        console.log("error occureddd",error);
      }finally{
        setisLoading(false);
      }
  }
  const handleChange = async(e:React.ChangeEvent<HTMLInputElement>)=>{
    setMessage(e.target.value);
  }
  let isDisabled = message.trim().length<=0 ? true : false;
  return (
    <div className="border-t border-gray-200 px-6 py-3 flex flex-col justify-end">
    <div className="flex gap-2">
      <input
        type="text"
        className="flex-grow border border-gray-300 rounded-l-lg p-2 focus:outline-[#7678ed]"
        placeholder="Type a message..."
        value={message}
        onChange={(e)=>handleChange(e)}
      />
      <button className={` transition-all w-[50] h-[50] rounded-md relative right-10 ${showEmoji == true ? "animate-bounce duration-100" : "animate-none"}`} onClick={()=>setshowEmoji(!showEmoji)}><FaRegLaugh color={`${showEmoji ? "#9b51e0" : "black"}`} size={25}/></button>
      <button className={`text-white px-4 py-2 rounded-r-lg ${isDisabled ? "bg-gray-300" : "bg-blue-500"}`} disabled={isDisabled} onClick={addMessage}>
      {isLoading ? <Loader size={1} color='blue'/> :  <LuSendHorizonal />}
      </button>
    </div>
    <div className='flex flex-col items-end transition-all ease-out'>
    {
      showEmoji && <PickEmoji  setMessage={setMessage} message={message}/>
    }
    </div>
  </div>
  )
}

export default ChatInput;