
import FriendRequest from "../shared/FriendRequest";
import { UsersRound } from "lucide-react";
type FriendsProps ={
  isFocused: boolean,
  onClick: ()=>void
}

export default function FriendsIcon({isFocused, onClick}: FriendsProps) {
  return (
    <div className="flex" onClick={onClick}>
        <UsersRound color={isFocused ? "white" : "#8b5cf6"}/> 
       { isFocused && <FriendRequest />}
    </div>
  )
}