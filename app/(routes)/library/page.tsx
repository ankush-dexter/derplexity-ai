"use client";

import { supabase } from "@/services/supabase";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
function Library() {
  const { user } = useUser();
  const router = useRouter();
  // console.log("second");
  interface LibraryItem {
    id: number;
    searchInput: string;
    searchType: string;
    created_at: string;
    userEmail: string;
    libid: string;
  }
  // console.log("third");

  const [libraryHistory, setLibraryHistory] = useState<LibraryItem[]>([]);
  useEffect(() => {
    user && GetLibraryHistory();
  }, [user]);

  const GetLibraryHistory = async () => {
    // console.log("first");
    let { data: Library, error } = await supabase
      .from("Library")
      .select("*")
      .eq("userEmail", user?.primaryEmailAddress?.emailAddress)
      .order("id", { ascending: false });

    // console.log(Library);
    setLibraryHistory(Library || [{ Hi: "No Data" }]);
  };


  return (
    <div className="px-10 md:px-20 lg:px-40 xl:px-60 mt-20">
      <h2 className="font-bold text-3xl">Library</h2>
      <div>
        {libraryHistory.length > 0 ? (
          <ul className="mt-5">
            {libraryHistory.map((item: any, index: number) => (
              <li key={index} className="mb-3">
                <div
                  className="p-4 border rounded-md shadow-sm cursor-grab hover:shadow-md transition-shadow duration-200"
                  onClick={() => (item.searchType=="search"?(router.push(`/search/${item.libid}`)):(router.push(`/emotion/${item.libid}`)))}
                >
                  <span>{moment(item.created_at).fromNow()} </span>
                  <h3 className="font-semibold text-xl">{item.searchInput}</h3>
                  <p className="text-gray-400">Type: {item.searchType}</p>
                  <p className="text-gray-500">
                    Date: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-gray-500">No search history found.</p>
        )}
      </div>
    </div>
  );
}

export default Library;
