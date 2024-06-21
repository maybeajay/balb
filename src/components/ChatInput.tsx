import React, { ReactEventHandler, useRef, useState } from 'react'
import { LuSendHorizonal } from "react-icons/lu";
import { FaRegLaugh } from "react-icons/fa";
import {supabase} from "../../supabase.js"
import PickEmoji from '../shared/PickEmoji.js';
import { HiOutlineUpload } from "react-icons/hi";
import Loader from '../shared/Loader.js';
import { useSelector } from 'react-redux';
type Props = {}

const ChatInput = (props: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading ,setisLoading] = useState<boolean>(false);
  const [showEmoji, setshowEmoji] = useState<boolean>(false);
  const { userData} = useSelector((state: any) => state.user);
  const [imagePreview, setimagePreview] = useState('');
  const uploadRef = useRef();
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

  let isDisabled =  imagePreview!="" ? false : true || message.trim().length<=0 ? true : false ;
  // for uploading images in the chats
  const handleImageUpload = (e:React.SyntheticEvent)=>{
    const file = e.target.files[0];
    const objectUrl = URL.createObjectURL(file);
    setimagePreview(objectUrl);
  }
  return (
    <div className="border-t border-gray-200 px-6 py-3 flex flex-col justify-between">
    <div className="flex gap-2">
      <input
        type="text"
        className="flex-grow border border-gray-300 rounded-l-lg p-2 focus:outline-[#7678ed]"
        placeholder="Type a message..."
        value={message}
        onChange={(e)=>handleChange(e)}
      />
      {
        imagePreview && <div>
          <img src={imagePreview} width={150} height={150} alt='image'/>
          </div>
      }
      <button className={` transition-all w-[50] h-[50] rounded-md relative right-10`} onClick={()=>setshowEmoji(!showEmoji)}><FaRegLaugh color={`${showEmoji ? "#9b51e0" : "black"}`} size={25}/></button>
      <button className={`text-white px-4 py-2 rounded-r-lg ${isDisabled ? "bg-gray-300" : "bg-blue-500"}`} disabled={isDisabled} onClick={addMessage}>
      {isLoading ? <Loader size={1} color='blue'/> :  <LuSendHorizonal />}
      </button>

      {/* upload  images */}
      <div className='flex justify-center items-center w-[40px] h-[40px] mx-3 bg-gray-300 rounded-md hover:cursor-pointer' onClick={()=>uploadRef.current.click()}>
      <button className='transition-all rounded-md relative'>
      <HiOutlineUpload />
      </button>
      <input type='file' ref={uploadRef} style={{display: 'none'}} accept="image/*" onChange={(e)=>handleImageUpload(e)}/>
      </div>
    </div>
    <div className='flex flex-col items-end transition-all ease-out mx-3'>
    {
      showEmoji && <PickEmoji  setMessage={setMessage} message={message}/>
    }
    </div>
  </div>
  )
}

export default ChatInput;