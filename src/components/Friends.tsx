import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';
import { catchErrors } from '../slices/errorsSlice';

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

  const getFriends = async () => {
    if (friendsData.length > 0) {
      const { data: users, error } = await supabase
        .from('users')
        .select()
        .eq('id', friendsData[0]?.user_id);

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
          .eq('user_id', 'aae35fae-8252-4b53-98bc-0267c482990c')
          .eq('is_accepted', true)
          .eq('is_pending', false);
          console.log("friends", friends)
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

  useEffect(() => {
    getFriends();
  }, [friendsData]);

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-600 mb-2">
        All Chats
      </h2>
      <ul>
        {myFriends.map((friend, index) => (
          <li key={index} className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
            <img
              src={friend?.profile_url}
              className="w-10 h-10 rounded-full mr-2"
              alt="User"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">{friend.user_name}</h3>
                <span className="text-xs text-gray-400">12:30 PM</span>
              </div>
              <p className="text-xs text-gray-500">
                Thank you very much, I am...
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Friends;
