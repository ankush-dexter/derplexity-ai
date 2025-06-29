import { createContext } from "react";

interface UserDetailContextType {
  userDetail: Object | null;
  setUserDetail: React.Dispatch<React.SetStateAction<Object | null>>;
}

export const UserDetailContext = createContext<UserDetailContextType | null>(
  null
);
