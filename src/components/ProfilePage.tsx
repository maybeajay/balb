type Props = {};
import { useEffect, useState } from "react";
import { supabase } from "../../supabase.js";
import { UserRoundPlus, Check } from "lucide-react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../types.js";
import { UserProfile } from "../types.js";
export default function ProfilePage({}: Props) {
  const [isLoading, setisLoading] = useState<boolean>(true);
  const [userProfile, setuserProfile] = useState([]);
  const [userDetails, setuserDetails] = useState("");
  const [refresh, setRefresh] = useState(false);
  const {userData} = useAppSelector(state=>state.user);
  const params = useParams();
  const {user_name} = params;
  const subscribeToRealtime = ()=>{
    const channels = supabase.channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'friends' },
      (payload:any) => {
        // setactiveRequests({...activeRequests, ...payload.new})
        // setuserDetails({...userDetails, ...payload.new})
      }
    )
    .subscribe();
    return channels;
  }
  useEffect(() => {
    (async function getUserProfile() {
      setisLoading(true);
      try {
        let { data: users, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userData?.user?.id);
        if (!error) {
          setuserProfile(users);
        }else{
          console.log('error', error)
        }
      } finally{
        setisLoading(false);
      }

      // subscribig to changes
      // const channel = subscribeToRealtime();

      return () => {
        supabase.removeChannel(channel);
      };
    })();

    (async function getUserDetails() {
      try {
        let { data: friends, error } = await supabase
          .from("users")
          .select("*, friends:friends_friend_id_fkey (is_accepted, is_pending)").eq("user_name", user_name)
          if(!error){
            setuserDetails(friends);
          }else{
            console.log('error', error)
          }
      } catch (error) {}
    })();
  }, [userData?.user, user_name, refresh]);


  const addFriend = async (
    userId: string,
    friendId: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      setisLoading(true);
      const { data, error } = await supabase
        .from("friends")
        .insert([{ user_id: userId, friend_id: friendId }]);

      const notification = {
        user_id: friendId,
        type: "friend_request",
        content: `${firstName} ${lastName} has sent you a friend request.`,
      };
      await supabase.from("notifications").insert([notification]);
    } catch (error) {
    } finally {
      setisLoading(false);
      setRefresh((prev)=>!prev)
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* main profile section */}
      <section className="w-full">
        <div className=" flex flex-col justify-center items-center gap-5">
          <div className="mt-5">
           {userDetails[0]?.profile_url ? <img
              src={userDetails[0]?.profile_url}
              className="w-52 h-52 rounded-full object-fit"
            />
          : <img src={"/emptyUser.svg"} />
          }
            {/* user name and other details */}
            <div className="">
              <p className="text-black font-medium text-center mt-3">
                {userDetails[0]?.first_name + " " + userDetails[0]?.last_name}
              </p>
              {/* bio */}
              <p className="text-gray-600 mt-5 max-w-80 text-center text-wrap whitespace-pre-line">
                {userDetails[0]?.bio}
              </p>
            </div>

            {/* joined */}
            <div className="text-center mt-5">
              <p className="font-smeibod">Member Since</p>
              <p>
                {userDetails[0]?.created_at &&
                  format(userDetails[0]?.created_at, "dd-MM-yyyy")}
              </p>
            </div>
          </div>

          {/* bio */}
          {/* add friend button */}
          {
            !userDetails[0]?.friends[0]?.is_accepted    ? <button
            className="bg-purple-500 text-white p-3 rounded-md flex flex-row gap-2 text-xl"
            onClick={() =>
              addFriend(
              userData?.user?.id,
              userDetails[0]?.id,
              userProfile[0]?.first_name,
              userProfile[0]?.last_name
              )
            }
          >
            Add Friend
            <UserRoundPlus />
          </button> 
           : 
           <button
           className="bg-gray-300 text-black p-3 rounded-md flex flex-row gap-2 text-xl items-center"
           disabled
         >
          Added 
           <Check  />
         </button> 
          }
        </div>
      </section>
    </div>
  );
}
