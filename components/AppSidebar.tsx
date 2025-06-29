"use client";

import react from "react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Compass,
  GalleryHorizontalEnd,
  Ghost,
  LogIn,
  Search,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const MenuOptions = [
  {
    tittle: "Home",
    icon: Search,
    path: "/",
  },
  {
    tittle: "Discover",
    icon: Compass,
    path: "/discover",
  },
  {
    tittle: "Library",
    icon: GalleryHorizontalEnd,
    path: "/library",
  },
  // {
  //   tittle: "Sign In",
  //   icon: LogIn,
  //   path: "/sign-in",
  // },
];
export function AppSidebar() {
  const path = usePathname();
  const { user } = useUser();

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-center py-4">
        <Image src={"/logo.webp"} alt="Perplexity" width={50} height={50} />
        <h1 className="font-bold font-stretch-50% text-2xl">Derplexity</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {MenuOptions.map((menu, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    className={`p-5 font-light text-lg hover:bg-cyan-800 hover:rounded-lg ${
                      path === menu.path ? "font-bold" : ""
                    }`}
                  >
                    <a href={`${menu.path}`}>
                      <menu.icon />
                      <span className="">{menu.tittle}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            {user ? (
              <SignOutButton>
                <Button className="rounded-full mx-7 mt-5 hover:cursor-pointer">Log Out</Button>
              </SignOutButton>
            ) : (
              <SignUpButton mode="modal">
                <Button className="rounded-full mx-7 mt-5 hover:cursor-pointer">Sign Up</Button>
              </SignUpButton>
            )}
          </SidebarContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 flex flex-col">
          <h2 className="text-gray-500">Try Now</h2>
          <p className="text-gray-400">Upgrade for Image upload, smarter AI</p>
          <Button variant={"ghost"} className="bg-gray-900 mb-3">
            Learn More
          </Button>
          <UserButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
