import React from "react";
import Image from "next/image";
function ImageListTab({ chat }: any) {
    // console.log(chat.searchResultImage);
  return (
    <div className="flex gap-4 flex-wrap mt-5">
      {chat?.searchResultImage?.map((item: any, index: number) => (
        <Image
          src={item.thumbnail}
          alt="Not Available -_-"
          width={150}
          height={150}
          key={index}
          className="bg-accent rounded-xl object-contain hover:cursor-grab hover:scale-105 transition-transform duration-200 ease-in-out"
          onClick={() => {
            window.open(item.imageUrl, "_blank");
          }}
        />
      ))}
    </div>
  );
}

export default ImageListTab;
