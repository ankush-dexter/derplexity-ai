import React from 'react'

function DisplayDiscover({latestNews}: {latestNews: Array<any>}) {
  return (
    <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {latestNews?.map((news: any, index: number) => (
        <div key={index} className="rounded-lg overflow-hidden border border-gray-700 bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
          <div className="aspect-video w-full relative overflow-hidden">
            <img
              src={news.thumbnail}
              alt={news.title}
              className="w-full h-full object-cover absolute inset-0"
      
            />
          </div>
          
          <div className="p-4 flex flex-col gap-2">
            <h3 className="text-xl font-semibold line-clamp-2">{news.title}</h3>
            {news.description && (
              <p className="text-gray-400 line-clamp-3">{news.description}</p>
            )}
            <a
              href={news.contextLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 mt-2 inline-block"
              title="Read more about this news"
            >
              Read more
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DisplayDiscover