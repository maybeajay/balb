import {  useEffect, useState } from "react";
import { supabase } from "../../supabase.js";
import { useSelector } from "react-redux";


export default function FriendRequest() {
  const [activeRequests, setactiveRequests] = useState([]);
  const { userData } = useSelector((state: any) => state.user);
  useEffect(() => {
    async function getFriendRequests() {
      let { data: friends, error } = await supabase
        .from("friends")
        .select('*, users:friend_id (id, user_name, profile_url)')
        .eq("user_id", userData?.user?.id) 
        .eq("is_accepted", false);
  
      if (error) {
        console.error("Error fetching friend requests:", error);
      } else {
        setactiveRequests(friends);
      }
    }
  
    getFriendRequests();
  }, [userData]);

  const acceptRequest = async (friendId:string, userId:string) => {
    try {
      const { data, error } = await supabase
        .from('friends')
        .update({ is_accepted: true, is_pending: false})
        .eq('friend_id', friendId)
        if(data){
          console.log(data);
        }
    if (error) {
        console.error('Error updating friend request status:', error);
        return null;
    }
    } catch (error) {}
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
                    onClick={() => acceptRequest(item?.users?.id, item?.user_id)}
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