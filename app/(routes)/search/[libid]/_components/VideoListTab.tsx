import he from "he";
import { Youtube } from "lucide-react";

const VideoListTab = ({
  chat,
  loadingSearch,
}: {
  chat: any;
  loadingSearch: boolean;
}) => {
  if (loadingSearch) {
    return <div className="text-white p-4">Loading...</div>;
  }

  if (!chat?.searchResultVideo?.length) {
    return <div className="text-white p-4">No videos found.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {chat.searchResultVideo.map((video: any, index: number) => (
        <div
          key={index}
          className="flex items-center w-full flex-col md:flex-row bg-gray-800 rounded-xl p-4 shadow-md"
        >
          <img
            src={video.thumbnail}
            alt="Video thumbnail"
            className="w-40 h-24 object-cover rounded-lg mr-4"
          />
          <div className="flex w-full flex-col justify-between text-white">
            <div className="text-lg line-clamp-3 font-semibold flex flex-row-reverse gap-2">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500"
              >
                <Youtube size={28} />
              </a>
              <div className="line-clamp-3">{he.decode(video.title)}</div>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {he.decode(video.channel)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoListTab;
