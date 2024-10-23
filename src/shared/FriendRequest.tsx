import { useEffect, useState } from "react";
import { supabase } from "../../supabase.js";
import { useSelector } from "react-redux";

export default function FriendRequest() {
  const [activeRequests, setActiveRequests] = useState([]);
  const { userData } = useSelector((state: any) => state.user);

  const subscribeToRealtime = () => {
    const channel = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'friends' },
        (payload: any) => {
          setActiveRequests((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return channel;
  };

  useEffect(() => {
    async function getFriendRequests() {
      let { data: friends, error } = await supabase
        .from("friends")
        .select('*, users:user_id (id, user_name, profile_url)') 
        .eq("friend_id", userData?.user?.id) 
        .eq("is_accepted", false);
      if (error) {
        console.error("Error fetching friend requests:", error);
      } else {
        setActiveRequests(friends);
      }
    }
  
    getFriendRequests();
  
    const channel = subscribeToRealtime();
  
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userData]);

  

  const acceptRequest = async (friendId: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('friends')
        .update({ is_accepted: true, is_pending: false, is_rejected: false })
        .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`)
        .select();
  
      if (error) {
        console.error('Supabase error:', error);
        return null;
      }
  
      if (data?.length === 0) {
        console.log('No data returned, check if the record exists for the provided userId and friendId.');
        return null;
      }
  
      console.log('Friend request accepted:', data);
      return data; 
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };
  
  
  return (
    <div className="relative">
      <div className="absolute right-0 mt-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-72">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-700">Friend Requests</h3>
          <hr className="my-2" />
          {activeRequests.length > 0 ? (
            activeRequests.map((item) => (
              <div className="flex items-center justify-between py-2" key={item?.user_id}>
                <div className="flex items-center space-x-3">
                  {item?.users?.profile_url ? (
                    <img
                      src={item?.users?.profile_url}
                      alt="Profile Picture"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <img
                      src="/emptyUser.svg"
                      alt="Profile Picture"
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <span className="text-gray-800 font-medium">{item?.users?.user_name}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded-full hover:bg-green-600"
                    onClick={() => acceptRequest(item?.users?.id, userData?.user?.id)}
                  >
                    Accept
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600">
                    ✕
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-2 text-gray-500">No friend requests</div>
          )}
        </div>
      </div>
    </div>
  );
}
