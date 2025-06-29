"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/services/supabase";
import Header from "./_components/Header";
import DisplayResult from "./_components/DisplayResult";


function SearchQueryResult() {
  const { libid } = useParams();
  const [searchInputRecord, setSearchInputRecord] = useState({});

  useEffect(() => {
    GetSearchQueryRecord();
  }, []);

  const GetSearchQueryRecord = async () => {
    let { data: Library, error } = await supabase
      .from("Library")
      .select("*,Chats(*)")
      .eq("libid", libid);
    // console.log(Library?.[0]);
    setSearchInputRecord(Library?.[0]);

  };
  return (
    <div>
      <Header searchInputRecord={searchInputRecord} />
      <div className="px-10 md:px-20 lg:px-40 xl:px-60 mt-20">
        <DisplayResult searchInputRecord={searchInputRecord} />
      </div>
    </div>
  );
}

export default SearchQueryResult;
