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
  const { userData, activeChatID } = useAppSelector((state) => state.user);

  // Fetch friend details from 'users' table
  const getFriends = async (friendIds: string[]) => {
    console.log("frinds ids", friendIds);
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
          console.log('Subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to friends table realtime!');
          } else if (status === 'TIMED_OUT') {
            console.warn('WebSocket connection timed out. Retrying...');
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
          .eq('user_id', userData?.user?.id)
          .eq('is_accepted', true)
          .eq('is_pending', false);
  
        if (error) {
          catchErrors(error.message);
        } else {
          setFriendsData(friends || []);
        }
      } catch (error) {
        catchErrors(error?.message);
      }
    };
  
    getUserFriends();
  
    const subscribeToRealtime = () => {
      const channel = supabase
        .channel('friends')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'friends' }, (payload) => {
          console.log('Change received!', payload);

          console.log("payload.eventType", payload.eventType)
    
          if (payload.eventType === 'DELETE') {
            // Filter out the deleted friend from myFriends
            console.log("inside the payload delete  type")
            setMyFriends((prevFriends) =>
              prevFriends.filter((item) => item.id !== payload.old.id)
            );
          }
    
          if (payload.eventType === 'INSERT') {
            console.log("insie the insert statemnent")
            // Add the new friend to myFriends
            setMyFriends((prevFriends) => [...prevFriends, payload.new]);
          }
    
          // Optionally handle updates (if needed)
          if (payload.eventType === 'UPDATE') {
            setMyFriends((prevFriends) =>
              prevFriends.map((friend) =>
                friend.id === payload.new.id ? payload.new : friend
              )
            );
          }
        })
        .subscribe();
    
      return channel;
    };
    
  
    const channel = subscribeToRealtime();
  
    console.log("mounted!!!;;");
  
    return () => {
      supabase.removeChannel(channel);
      console.log("unmounted!!");
    };
  }, [userData?.user?.id]);

  useEffect(() => {
    if (friendsData.length > 0) {
      const friendIds = friendsData.map((friend) => friend.friend_id);
      getFriends(friendIds);
    }
  }, [friendsData]);

  // for selecting a friend and highlighting the user
  const handleFriendSelect = (selectedFriend: User) => {
    dispatch(activeChat(selectedFriend?.id));
  };


  console.log("my frinds", myFriends)

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-600 mb-2">All Chats</h2>
      <ul>
        {myFriends.length >= 1 &&
          myFriends.map((friend: User, index: number) => (
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
