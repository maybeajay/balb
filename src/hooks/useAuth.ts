import { useEffect, useState } from "react";
import {supabase} from "../../supabase.js"
import { userTypeData } from "../types";
import { useSelector } from "react-redux";
export function useAuth(){
const [userDetails, setuserDetails] = useState([])
const { userData } = useSelector((state:userTypeData) => state.user);
  useEffect(() => {
    (async function getData() {
      let { data: users, error } = await supabase.from("users").select("*");
      if(!error){
        setuserDetails(users);
      }
    })();
  }, [userData?.user?.id]);

  return {userDetails}
}