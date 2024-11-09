import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export type UserProfile = {
  id: string;
  created_at: string;
  profile_url: string;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  friends: null | string[];
  last_active: string;
  is_active: boolean;
};

export type User = {
  id: string;
};

export type userTypeData = {
  userData: User;
};

export type Message = {
  id: string;
  created_at: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  is_deleted: boolean;
  is_seen: boolean;
};
