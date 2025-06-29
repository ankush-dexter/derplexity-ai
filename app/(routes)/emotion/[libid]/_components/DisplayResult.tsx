import {
  Icon,
  Loader2Icon,
  LucideImage,
  LucideList,
  LucideSparkles,
  LucideVideo,
  Send,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { SEARCH_RESULT } from "@/services/Shared";
import { supabase } from "@/services/supabase";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import DisplaySummary from "@/app/(routes)/search/[libid]/_components/DisplaySummary";

function DisplayResult({ searchInputRecord }: any) {
  const [searchResult, setSearchResult] = useState(searchInputRecord);
  const { libid } = useParams();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [userInput, setUserInput] = useState("");
  useEffect(() => {
    searchInputRecord?.Chats?.length == 0
      ? GenerateAiResp()
      : GetSearchRecords();
    setSearchResult(searchInputRecord);
    // console.log(searchResult);
  }, [searchInputRecord]);

  const GenerateAiResp = async () => {
    const result = await axios.post("/api/llm-model-emotion", {
      searchInput: userInput.trim()
        ? userInput
        : searchInputRecord?.searchInput,
      recordId: libid,
    });
    // console.log(result.data);
    // console.log(result.data.ids[0]);
    const runId = result.data.ids[0];

    const interval = setInterval(async () => {
      const runResp = await axios.post("/api/get-inngest-status", {
        runId: runId,
      });

      if (runResp.data.data[0].status === "Completed") {
        // console.log("completed");
        await GetSearchRecords();
        clearInterval(interval);
      }
    }, 1000);
  };

  const GetSearchRecords = async () => {
    let { data: Library, error } = await supabase
      .from("Library")
      .select("*,Chats(*)")
      .eq("libid", libid)
      .order("id", { foreignTable: "Chats", ascending: true });

    setSearchResult(Library?.[0]);
  };

  return (
    <div className="mt-5 mb-8">
      {/* <h2 className="font-medium text-3xl line-clamp-2">
        {searchInputRecord?.searchInput}
      </h2> */}
      {searchResult?.Chats?.map((chat: any, index: number) => (
        <div key={index} className="mb-10">
          <h2 className="font-medium text-3xl line-clamp-2">
            {chat?.userSearchInput}
          </h2>
          <div className="flex items-center space-x-6 border-b border-gray-200 pb-2 mt-6">
            <div className="flex items-center space-x-2">
              <LucideSparkles className="w-6 h-6 text-blue-500" />
              <span className="text-gray-500">AI Response</span>
            </div>
          </div>
          <div className="mt-4">
            <DisplaySummary aiResp={chat?.aiResp}/>
          </div>
          <hr className="my-7" />
        </div>
      ))}
      <div className="bg-gray-500 w-full fixed bottom-5 max-w-md lg:max-w-xl xl:max-w-2xl border rounded-lg shadow-md p-3 px-4 flex items-center flex-row justify-between space-x-2">
        <input
          type="text"
          placeholder="Chat further!!"
          className="outline-none w-full"
          onChange={(e) => setUserInput(e.target.value)}
        />
        {userInput && (
          <Button onClick={GenerateAiResp} disabled={loadingSearch}>
            {loadingSearch ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <Send />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default DisplayResult;
