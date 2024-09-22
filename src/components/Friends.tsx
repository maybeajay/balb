import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';
import { catchErrors } from '../slices/errorsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { activeChat } from '../slices/userSlice.js';
interface User {
  id: string;
  username: string;
  email: string;
}

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  is_accepted: boolean;
  is_pending: boolean;
}
function Friends() {
  const [friendsData, setFriendsData] = useState<Friend>([]);
  const [myFriends, setMyFriends] = useState<User>([]);
  const dispatch = useDispatch();
  const {userData} = useSelector(state=>state.user);
  console.log("userData", userData)
  const getFriends = async () => {
    if (friendsData.length > 0) {
      const { data: users, error } = await supabase
        .from('users')
        .select()
        .eq('id', friendsData[0]?.friend_id);
        console.log(friendsData)
      if (error) {
        catchErrors(error.message);
      } else {
        setMyFriends(users);
      }
    }
  };

  useEffect(() => {
    (async function getUserFriends() {
      try {
        const { data: friends, error } = await supabase
          .from('friends')
          .select()
          .eq('user_id', userData?.user.id)
          .eq('is_accepted', true)
          .eq('is_pending', false);
        if (error) {
          catchErrors(error.message);
        } else {
          setFriendsData(friends);
        }
      } catch (error) {
        catchErrors(error.message);
      }
    })();
  }, []);


  console.log("MYFREINDS", myFriends)

  useEffect(() => {
    getFriends();
    dispatch(activeChat(friendsData[0]))
  }, [friendsData]);

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-600 mb-2">
        All Chats
      </h2>
      <ul>
        {myFriends.length>=1 && myFriends?.map((friend:any, index:number) => (
          <li key={index} className={`? "bg-violet-500 text-white rounded-md" : "text-gray-500"} "flex items-center p-2 rounded-md cursor-pointer"`} onClick={()=>dispatch(activeChat(friend))}>
            <div className='flex flex-row gap-5 p-3'>
            <img
              src={friend?.profile_url} 
              className="w-10 h-10 rounded-full"
              alt="User"
              loading='lazy'
            />
                <h3 className="text-md font-semibold text-black">{friend?.user_name}</h3>
              </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Friends;
