import { useEffect, useState } from "react";
import {supabase} from "../../supabase.js"
import { useAppSelector } from "../types";
export function useAuth(){
const [userDetails, setuserDetails] = useState([])
const { userData }:any = useAppSelector(state => state.user);
  useEffect(() => {
    (async function getData() {
      let { data: users, error } = await supabase.from("users").select("*").eq("id", userData?.user?.id);
      if(!error){
        setuserDetails(users);
      }
    })();
  }, [userData?.user?.id]);

  return {userDetails}
}