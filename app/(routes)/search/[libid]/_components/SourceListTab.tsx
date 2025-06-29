import React from "react";

function SourceListTab({ chat }: any) {
  return (
    <div>
      <div className="flex flex-col flex-wrap gap-3 mt-4">
        {chat?.searchResultWeb?.map((item: any, index: number) => (
          <div
            key={index}
            className="p-3 space-x-2 bg-gray-400 rounded-lg w-full cursor-pointer hover:bg-gray-600"
            onClick={() => window.open(item?.link, "_blank")}
          >
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row items-center gap-2">
                <h2 className="text-amber-100">{index + 1})</h2>
                <h2 className="text-l text-gray-900 font-bold line-clamp-1">
                  {item?.title}
                </h2>
              </div>
              <span>↗️</span>
            </div>
            <h3 className="text-l text-gray-950">{item.snippet}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SourceListTab;
