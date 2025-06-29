import React from "react";
import Image from "next/image";

function SourceList({
  webResult,
  loadingSearch,
}: {
  webResult: any;
  loadingSearch: boolean;
}): React.JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      {loadingSearch ? (
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((item: any, index: number) => (
            <div className="w-[200px] h-[100px] rounded-2xl bg-accent animate-pulse "></div>
          ))}
        </div>
      ) : (
        webResult?.searchResultVideo?.map((item: any, index: number) => (
          <div
            key={index}
            className="p-3 bg-accent rounded-lg w-[200px] cursor-pointer hover:bg-[#212514]"
            onClick={() => window.open(item?.url, "_blank")}
          >
            <div className="flex items-center gap-2">
              <Image src={item.thumbnail} alt="YT" width={20} height={20} />
              <h2 className="text-xs">{item?.channel}</h2>
            </div>
            <h2 className="text-xs text-gray-300 line-clamp-2">
              {item?.title}
            </h2>
          </div>
        ))
      )}
    </div>
  );
}

export default SourceList;
