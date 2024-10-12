import { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';
import { useSelector } from 'react-redux';

const MyProfile = () => {
    const [profileData, setProfileData] = useState([]);
    const {userData} = useSelector(state=>state.user);
    const [isLoaded, setisLoaded] = useState(false);
    useEffect(() => {
        async function getProfileData() {
            try {
                setisLoaded(true);
                let { data: users, error } = await supabase
                    .from("users")
                    .select('*')
                    .eq("id", userData?.user?.id);
                if (!error) {
                    setProfileData(users);
                }
            } catch (error) {
                console.error(error);
            }finally{
                setisLoaded(false)
            }
        }

        getProfileData();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-6xl p-6">
                <div className="flex flex-col md:flex-row md:items-start mb-6">
                    <img className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-8" src={isLoaded ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" :profileData[0]?.profile_url} alt="Profile" />
                    <div>
                        <p className="text-gray-500 mb-4">Image size limit should be 125kb max.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="mb-1">Last Name</label>
                                <div className="p-2 text-gray-900">{profileData[0]?.last_name}</div>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1">First Name</label>
                                <div className="p-2 text-gray-900">{profileData[0]?.first_name}</div>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1">Email Address</label>
                                <div className="p-2 text-gray-900">{profileData[0]?.email}</div>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1">Phone Number</label>
                                <div className="p-2 text-gray-900">{profileData[0]?.phone_number || 'N/A'}</div>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1">Company Name</label>
                                <div className="p-2 text-gray-900">{profileData[0]?.company_name || 'N/A'}</div>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1">Site Information</label>
                                <div className="p-2 text-gray-900">{profileData[0]?.website || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
