import React from "react";
import ReactMarkdown from "react-markdown";
function DisplaySummary({ aiResp }: any) {
  return (
    <div>
        {aiResp? (<h2>
        <ReactMarkdown
            components={{
                h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-bold mb-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-bold mb-1" {...props} />
                ),
                p: ({ node, ...props }) => (
                    <p className="text-m text-gray-300 mb-2" {...props} />
                ),
                li: ({ node, ...props }) => (
                    <li className="text-m text-gray-300 mb-1" {...props} />
                ),
                a: ({ node, ...props }) => (
                    <a className="text-blue-500" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-gray-500 pl-4 italic" {...props} />
                ),
                code: ({ node, ...props }) => (
                    <code className="bg-gray-800 text-gray-200 p-1 rounded" {...props} />
                ),
                pre: ({ node, ...props }) => (
                    <pre className="bg-gray-800 text-gray-200 p-4 rounded" {...props} />
                ),
                img: ({ node, ...props }) => (
                    <img className="rounded" {...props} />
                ),
                table: ({ node, ...props }) => (
                    <table className="border-collapse border border-gray-500" {...props} />
                ),
                th: ({ node, ...props }) => (
                    <th className="border border-gray-500 bg-gray-700 text-gray-200" {...props} />
                ),
                td: ({ node, ...props }) => (
                    <td className="border border-gray-500 bg-gray-800 text-gray-200" {...props} />
                ),
                strong: ({ node, ...props }) => (
                    <strong className="font-bold" {...props} />
                ),
                em: ({ node, ...props }) => (
                    <em className="italic" {...props} />
                ),
                ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside" {...props} />
                ),
                ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside" {...props} />
                ),
                hr: ({ node, ...props }) => (
                    <hr className="border-gray-500" {...props} />
                ),

            }}
        >{aiResp}</ReactMarkdown>
      </h2>) : ((
        <div className="flex flex-col w-full flex-wrap gap-2">
          {[1, 2, 3].map((item: any, index: number) => (
            <div className="w-[100px] h-[30px] rounded-2xl bg-accent animate-pulse "></div>
          ))}
        </div>
      ))}
      
    </div>
  );
}

export default DisplaySummary;
