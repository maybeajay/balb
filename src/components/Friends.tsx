import { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';
import { catchErrors } from '../slices/errorsSlice';
import { useDispatch } from 'react-redux';
import { activeChat } from '../slices/userSlice.js';
import { useAppSelector } from '../types.js';
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
  const [friendsData, setFriendsData] = useState<Friend[]>([]);
  const [myFriends, setMyFriends] = useState<User[]>([]);
  const dispatch = useDispatch();
  const {userData, activeChatID} = useAppSelector(state=>state.user);
  const getFriends = async () => {
    if (friendsData.length > 0) {
      const friendIds = friendsData.map(friend => friend.friend_id);
      const { data: users, error } = await supabase
      .from('users')
      .select()
      .in('id', friendIds);
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
        catchErrors(error?.message);
      }
    })();
  }, []);


  useEffect(() => {
    getFriends();
    dispatch(activeChat(friendsData[0]?.friend_id))
  }, [friendsData]);

  // for selecting custom friend and highlight the user
  const handleFriendSelect = (selectedFriend)=>{
    dispatch(activeChat(selectedFriend?.id));
  }

  console.log("friendsData", myFriends, "userData?.user.id", userData?.user.id)
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-600 mb-2">
        All Chats
      </h2>
      <ul>
        {myFriends.length>=1 && myFriends?.map((friend:any, index:number) => (
           <li
           key={index}
           className={`flex items-center p-4 rounded-md cursor-pointer ${
             friend.id === activeChatID
               ? 'bg-[#8b5cf6] text-white'
               : 'bg-white text-black'
           }`}
           style={{ height: '60px' }}
           onClick={() => handleFriendSelect(friend)}
         >
            <div className='flex flex-row gap-5 p-3'>
            <img
              src={friend?.profile_url} 
              className="w-10 h-10 rounded-full"
              alt="User"
              loading='lazy'
            />
                <h3 className="text-md font-semibold">{friend?.user_name}</h3>
              </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Friends;
