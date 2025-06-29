"use client";
import React, { useEffect, ReactNode, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/services/supabase";
import { UserDetailContext } from "@/context/UserDetailContext";
function Provider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState(Object)

  useEffect(() => {
    user && CreateNewUser();
  }, [user]);
  const CreateNewUser = async () => {
    let { data: Users, error } = await supabase
      .from("Users")
      .select("*")
      .eq("email", user?.primaryEmailAddress?.emailAddress);

    // console.log(Users);

    if (Users?.length === 0) {
      const { data, error } = await supabase
        .from("Users")
        .insert([
          {
            name: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress,
          },
        ])
        .select();
      if (data) {
        setUserDetail(data[0]);
      }
      return;
    }
    if (Users) {
      setUserDetail(Users[0]);
    }
  };
  return (
    <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
      <div className="w-full">{children}</div>;
    </UserDetailContext.Provider>
  );
}

export default Provider;
