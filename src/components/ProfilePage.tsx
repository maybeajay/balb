type Props = {}
import { useState } from 'react'
import {supabase} from '../../supabase.js'
export default function ProfilePage({}: Props) {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const addFriend = async(userId:string, friendId: string, firstName: string, lastName: string)=>{
    try {
      setisLoading(true);
      const { data, error } = await supabase
      .from('friends')
      .insert([{ user_id: userId, friend_id: friendId }]);

      const notification = {
        user_id: friendId,
        type: 'friend_request',
        content: `${firstName} ${lastName} has sent you a friend request.`,
    };
    await supabase.from('notifications').insert([notification]);
    } catch (error) {
      
    }finally{
      setisLoading(false);
    }
  }
  return (
    <div className="container mx-auto p-4">
      {/* main profile section */}
      <section className='w-full'>
        <div className=' flex flex-col justify-center items-center gap-5'>
        <div className='mt-5'> 
          <img src='https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' className='object-cover rounded-full w-[180px] h-[180px] mx-auto'/>
          {/* user name and other details */}
          <div className="">
            <p className='text-black font-medium text-center mt-3'>Ajay Ramola</p>
          {/* bio */}
          <p className="text-gray-600 mt-5 max-w-80 text-center text-wrap whitespace-pre-line">Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus quas veniam voluptates, repellat non rem ducimus saepe dolor hic ad quos eveniet error repellendus dolores expedita impedit sapiente laborum ipsum sequi maxime laudantium!</p>
          </div>

          {/* joined */}
         <div className="text-center mt-5">
         <p className="font-smeibod">Member Since</p>
         <p>20 July, 2024</p>
         </div>
          </div>

          {/* bio */}
          {/* add friend button */}
          <button className='bg-purple-500 text-white p-3 rounded-md' onClick={()=>addFriend('aabd8b96-518b-4357-ae47-03f3749c138c', 'aabd8b96-518b-4357-ae47-03f3749c138c', "ajay", "ramola")}>Add Friend</button>
        </div>
      </section>
</div>

  )
}