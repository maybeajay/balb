type Props = {};
import { useEffect, useState } from "react";
import { supabase } from "../../supabase.js";
import { UserRoundPlus, Check } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
export default function ProfilePage({}: Props) {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [userProfile, setuserProfile] = useState([]);
  const [userDetails, setuserDetails] = useState("");
  const {userData} = useSelector(state=>state.user);
  useEffect(() => {
    (async function getUserProfile() {
      try {
        let { data: users, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userData?.user?.id);
        if (!error) {
          setuserProfile(users);
        }
      } catch (error) {}
    })();
    (async function getUserDetails() {
      try {
        let { data: friends, error } = await supabase
          .from("friends")
          .select("*").eq("friend_id", "aabd8b96-518b-4357-ae47-03f3749c138c")
          console.log(friends)
          if(!error){
            setuserDetails(friends);
          }
      } catch (error) {}
    })();
  }, []);
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
    }
  };
  return (
    <div className="container mx-auto p-4">
      {/* main profile section */}
      <section className="w-full">
        <div className=" flex flex-col justify-center items-center gap-5">
          <div className="mt-5">
            <img
              src={userProfile[0]?.profile_url}
              className="w-52 h-52 rounded-full object-fit"
            />
            {/* user name and other details */}
            <div className="">
              <p className="text-black font-medium text-center mt-3">
                {userProfile[0]?.first_name + " " + userProfile[0]?.last_name}
              </p>
              {/* bio */}
              <p className="text-gray-600 mt-5 max-w-80 text-center text-wrap whitespace-pre-line">
                {userProfile[0]?.bio}
              </p>
            </div>

            {/* joined */}
            <div className="text-center mt-5">
              <p className="font-smeibod">Member Since</p>
              <p>
                {userProfile[0]?.created_at &&
                  format(userProfile[0]?.created_at, "dd-MM-yyyy")}
              </p>
            </div>
          </div>

          {/* bio */}
          {/* add friend button */}
          {
            !userDetails[0]?.is_accepted ? <button
            className="bg-purple-500 text-white p-3 rounded-md flex flex-row gap-2 text-xl"
            onClick={() =>
              addFriend(
                "aabd8b96-518b-4357-ae47-03f3749c138c",
                "aabd8b96-518b-4357-ae47-03f3749c138c",
                "ajay",
                "ramola"
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
