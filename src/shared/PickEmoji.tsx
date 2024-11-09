import React, {Dispatch, SetStateAction} from 'react'
import EmojiPicker from 'emoji-picker-react';
type Props = {
  setMessage: Dispatch<SetStateAction<string>>,
  message: string,
}
const PickEmoji = ({message, setMessage}: Props) => {
  const handleEmojiAppend = (emoji:any)=>{
    setMessage((prevMessage) => prevMessage + emoji.emoji);
  }
  return (
    <div className='transition-all ease-in-out duration-200'>
      <EmojiPicker   onEmojiClick={(emoji)=>handleEmojiAppend(emoji)} lazyLoadEmojis={false}/>
    </div>
  )
}

export default PickEmoji