import { useEffect, useState } from "react";
import { supabase } from "../../supabase.js";
import { useSelector } from "react-redux";

type Props = {};

export default function FriendRequest({}: Props) {
  const [activeRequests, setactiveRequests] = useState([]);
  const { userData } = useSelector((state: any) => state.user);
  useEffect(() => {
    async function getFriendRequests() {
      let { data: friends, error } = await supabase
        .from("friends")
        .select('*, users:friend_id (id, user_name, profile_url)')
        .eq("user_id", userData?.user?.id) // This fetches friend requests sent to the current user
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
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-purple-600 text-white flex justify-between items-center rounded-t-lg">
          <h3 className="text-lg font-semibold">Pending Friend Requests</h3>
          <button className="text-white hover:text-gray-300 focus:outline-none">
            ✕
          </button>
        </div>
        {/* Modal Body */}
        {activeRequests.length >= 0 &&
          activeRequests.map((item) => (
            <div className="p-6 space-y-4" key={item?.user_id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                 {item?.users?.profile_url?  <img
                    src={item?.users?.profile_url}
                    alt="Profile Picture"
                    className="w-10 h-10 rounded-full"
                  />
                :
                <img
                src={"/emptyUser.svg"}
                alt="Profile Picture"
                className="w-10 h-10 rounded-full"
              />
                }
                  <span className="text-gray-800 font-medium">{item?.users?.user_name}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-green-500 text-white px-4 py-1 rounded-full hover:bg-green-600 focus:outline-none"
                    onClick={() => acceptRequest(item?.users?.id, item?.user_id)}
                  >
                    Accept
                  </button>
                  <button className="bg-red-500 text-white px-4 py-1 rounded-full hover:bg-red-600 focus:outline-none">
                    ✕
                  </button>
                </div>
              </div>
              <hr className="border-gray-200" />
            </div>
          ))}
        {/* Modal Footer */}
        <div className="px-6 py-3 bg-gray-100 flex justify-end rounded-b-lg">
          <button className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 focus:outline-none">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
