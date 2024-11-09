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

// interface Friend {
//   id: string;
//   user_id: string;
//   friend_id: string;
//   is_accepted: boolean;
//   is_pending: boolean;
// }
function Friends() {
  const [friendsData, setFriendsData] = useState<any>([]);
  const [myFriends, setMyFriends] = useState<any>([]);
  const dispatch = useDispatch();
  const { userData, activeChatID }:any = useAppSelector((state) => state.user);

  // Fetch friend details from 'users' table
  const getFriends = async (friendIds: string[]) => {
    const { data: users, error } = await supabase
      .from('users')
      .select()
      .in('id', friendIds)
      .order('user_name', { ascending: true });
    if (error) {
      catchErrors(error.message);
    } else {
      setMyFriends(users || []);
    }
  };

  const subscribeToRealtime = () => {
    try {
      const channel = supabase
        .channel('custom-all-channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'friends' },
          (payload) => {
            console.log('Realtime change detected:', payload);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
          } else if (status === 'TIMED_OUT') {
            setTimeout(() => subscribeToRealtime(), 5000); // Retry after 5 seconds
          }
        });
  
      return channel;
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  };


  useEffect(() => {
    const getUserFriends = async () => {
      try {
        const { data: friends, error } = await supabase
          .from('friends')
          .select()
          .or(`user_id.eq.${userData?.user?.id},friend_id.eq.${userData?.user?.id}`)
          .eq('is_accepted', true)
          .eq('is_pending', false);
  
        if (error) {
          catchErrors(error.message);
        } else {
          setFriendsData(friends || []);
        }
      } catch (error) {
        catchErrors((error as Error).message || "An unexpected error occurred");
      }
    };
  
    getUserFriends();
  
    const channel = subscribeToRealtime();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userData?.user?.id]);
  useEffect(() => {
    if (friendsData.length > 0) {
      const friendIds = friendsData.map((friend) => 
        friend.user_id === userData?.user?.id ? friend.friend_id : friend.user_id
      );
      getFriends(friendIds);
    }
  }, [friendsData]);
  // for selecting a friend and highlighting the user
  const handleFriendSelect = (selectedFriend: User) => {
    dispatch(activeChat(selectedFriend?.id));
  };
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-600 mb-2">All Chats</h2>
      <ul>
        {myFriends.length >= 1 &&
          myFriends.map((friend: any, index: number) => (
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
              <div className="flex flex-row gap-5 p-3">
                <img
                  src={friend?.profile_url}
                  className="w-10 h-10 rounded-full"
                  alt="User"
                  loading="lazy"
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
