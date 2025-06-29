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
import AnswerDisplay from "./AnswerDisplay";
import axios from "axios";
import { SEARCH_RESULT } from "@/services/Shared";
import { supabase } from "@/services/supabase";
import { useParams } from "next/navigation";
import ImageListTab from "./ImageListTab";
import SourceList from "./SourceList";
import SourceListTab from "./SourceListTab";
import { Button } from "@/components/ui/button";
import VideoListTab from "./VideoListTab";

const tabs = [
  { label: "Answer", icon: LucideSparkles },
  { label: "Images", icon: LucideImage },
  { label: "Videos", icon: LucideVideo },
  { label: "Sources", icon: LucideList, badge: 10 },
];

type Chats = {
  id: number;
  libid: string;
  userSearchInput: string;
  aiResp: string | null;
  searchResultVideo: any[];
  searchResultImage: any[];
  searchResultWeb: any[];
}
function DisplayResult({ searchInputRecord }: any) {
  const [activeTab, setActiveTab] = useState("Answer");
  const [searchResult, setSearchResult] = useState(searchInputRecord);
  const { libid } = useParams();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [userInput, setUserInput] = useState("");
  useEffect(() => {
    searchInputRecord?.Chats?.length == 0
      ? GetSearchApiResult()
      : GetSearchRecords();
    setSearchResult(searchInputRecord);
    // console.log(searchResult);
  }, [searchInputRecord]);

  const GetSearchApiResult = async () => {
    setLoadingSearch(true);

    const result = await axios.post("/api/search-api", {
      searchInput: userInput.trim()
        ? userInput
        : searchInputRecord?.searchInput,
      searchType: searchInputRecord?.searchtype ?? "Search",
    });
    // console.log(userInput)
    // console.log(result.data);
    // console.log(JSON.stringify(result.data));
    const searchResp = result.data;
    const formattedResultVideo = searchResp?.videoResults?.map(
      (item: any, index: Number) => ({
        title: item?.title,
        thumbnail: item?.thumbnail,
        channel: item?.channel,
        url: item?.url,
      })
    );
    // console.log(formattedResult);
    const formattedResultImage = searchResp?.imageResults?.map(
      (item: any, index: Number) => ({
        title: item?.title,
        thumbnail: item?.thumbnail,
        imageUrl: item?.imageUrl,
      })
    );
    // console.log(formattedResult);
    const formattedResultWeb = searchResp?.webResults?.map(
      (item: any, index: Number) => ({
        title: item?.title,
        link: item?.link,
        snippet: item?.snippet,
        displayLink: item?.displayLink,
      })
    );
    // console.log(formattedResult);

    const { data, error } = await supabase
      .from("Chats")
      .insert([
        {
          libid: libid,
          searchResultVideo: formattedResultVideo,
          searchResultImage: formattedResultImage,
          searchResultWeb: formattedResultWeb,
          userSearchInput: userInput.trim()
            ? userInput
            : searchInputRecord?.searchInput,
        },
      ])
      .select();

    // console.log(data?.[0]?.id);
    await GetSearchRecords();
    setLoadingSearch(false);
    await GenerateAiResp(formattedResultWeb, data?.[0]?.id);
  };

  const GenerateAiResp = async (formattedResultWeb: any, recordId?: any) => {
    const result = await axios.post("/api/llm-model", {
      searchInput: userInput.trim()
        ? userInput
        : searchInputRecord?.searchInput,
      searchResultWeb: formattedResultWeb,
      recordId: recordId,
    });

    // console.log(result.data.ids[0]);
    const runId = result.data.ids[0];

    const interval = setInterval(async () => {
      const runResp = await axios.post("/api/get-inngest-status", {
        runId: runId,
      });

      if (runResp.data.data[0].status === "Completed") {
        console.log("completed");
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
    <div className="mt-5 ">
      {/* <h2 className="font-medium text-3xl line-clamp-2">
        {searchInputRecord?.searchInput}
      </h2> */}
      {searchResult?.Chats?.map((chat: Chats, index: any) => 
        chat?.aiResp !== null && (
          <div key={index} className="mb-10">
            <h2 className="font-medium text-3xl line-clamp-2">
              {chat?.userSearchInput}
            </h2>
            <div className="flex items-center space-x-6 border-b border-gray-200 pb-2 mt-6">
              {tabs.map(({ label, icon: Icon, badge }) => (
                <button
                  key={label}
                  onClick={() => setActiveTab(label)}
                  className={`flex items-center gap-1 relative text-sm font-medium text-gray-400 hover:text-white ${
                    activeTab === label ? "text-black" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {badge && (
                    <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {badge}
                    </span>
                  )}
                  {activeTab === label && (
                    <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-white rounded"></span>
                  )}
                </button>
              ))}
              <div className="ml-auto text-sm text-gray-400">
                1task <span className="ml-1">↗</span>
              </div>
            </div>
            <div>
              {activeTab === "Answer" ? (
                <AnswerDisplay chat={chat} loadingSearch={loadingSearch} />
              ) : activeTab == "Images" ? (
                <ImageListTab chat={chat} />
              ) : activeTab == "Sources" ? (
                <SourceListTab chat={chat} />
              ) : activeTab == "Videos" ? (
                <VideoListTab chat={chat} loadingSearch={loadingSearch} />
              ) : null}
            </div>
            <hr className="my-7" />
          </div>
        )
      )}

      <div className="bg-gray-500 w-full fixed bottom-5 max-w-md lg:max-w-xl xl:max-w-2xl border rounded-lg shadow-md p-3 px-4 flex items-center flex-row justify-between space-x-2">
        <input
          type="text"
          placeholder="Search anything!!"
          className="outline-none w-full"
          onChange={(e) => setUserInput(e.target.value)}
        />
        {userInput && (
          <Button onClick={GetSearchApiResult} disabled={loadingSearch}>
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
