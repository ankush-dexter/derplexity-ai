import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Clock, Link, Send } from "lucide-react";
import moment from "moment";
import React from "react";

function Header({ searchInputRecord }: any) {
  return (
    <div className="p-4 border-b flex justify-between">
      <div className="flex items-center gap-2">
        <UserButton />
        <div className="flex gap-1 items-center">
          <Clock className="h-4 w-4 text-gray-500"/>
          <h2 className="text-sm text-gray-500">{moment(searchInputRecord?.created_at).fromNow()}</h2>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-200">
        {searchInputRecord?.searchInput}
      </h2>
      <div className="flex gap-2">
        <Button className="bg-red-300"><Link /></Button>
        <Button className="bg-red-300"><Send />Share</Button>
      </div>
    </div>
  );
}

export default Header;
