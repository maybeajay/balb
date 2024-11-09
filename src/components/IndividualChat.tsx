import SideNav from './SideNav'
import ChatBox from './ChatBox.js';
import { useEffect } from 'react';
import { useAppSelector } from '../types.js';
import {supabase} from "../../supabase.js"
function IndividualChat() {
  const {activeChatID, userData}:any = useAppSelector(state=>state?.user);

  // function to update the current active user 
  useEffect(() => {
    const interVal = setInterval(() => {
      updateUserStatus(true); 
    }, 180000); 

    // clear interval and change the status to false
    return () => {
      clearInterval(interVal);
      updateUserStatus(false); 
    };
  }, []); 
  
  const updateUserStatus = async (isActive) => {
    if (!userData?.user?.id) return;

    const { error } = await supabase
      .from('users')
      .update({ is_active: isActive })
      .eq('id', userData.user.id);  

    if (error) {
      console.error('Error updating user status:', error);
    }
  };
  return (
    <>
      <div className="flex">
        {/* SideNav with 20% width */}
        <div className="basis-1/5">
          <SideNav />
        </div>

        {/* Main Content (ChatBox) with 80% width */}
        <main className="flex-grow">
          <div className="flex">
            {activeChatID && <ChatBox  selectedId={activeChatID}/>}
          </div>
          <div>
            {/* Additional content can go here */}
          </div>
        </main>
      </div>
    </>
  );
  
}

export default IndividualChat