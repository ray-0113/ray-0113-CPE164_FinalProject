import * as React from "react";
import { DatePicker } from "@/Components/date-picker";
import logo from "/Images/favicon-96x96.png";

import {
  Bolt,
  HomeIcon,
  ThermometerIcon
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";

const data = {
    navMain: [
        // {
        //   title: "Sensors",
        //   url: "#",
        //   icon: ThermometerIcon,
        //   items: [
        //       {
        //           title: "Temperature Chart",
        //           url: route("dashboard.temp_chart"),
        //       },
        //       {
        //           title: "Humidity Chart",
        //           url: route("dashboard.humid_chart"),
        //       },
        //   ],
        // },
        // {
        //   title: "Control Rooms",
        //   url: "#",
        //   icon: Bolt,
        //   items: [
        //       {
        //           title: "Room 115",
        //           url: route("dashboard.room_115"),
        //       },
        //       {
        //           title: "Room 116",
        //           url: route("dashboard.room_116"),
        //       }
        //   ],
        // },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader className="p-4 flex justify-center items-center">
                <div className="flex aspect-square size-16 items-center justify-center rounded-lg">
                    <img src={logo} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">MQTTIFY</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <DatePicker />
                <SidebarSeparator className="mx-0" />
                <NavMain items={data.navMain} />
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {/* <SidebarMenuButton>
                            <Plus />
                            <span>New Calendar</span>
                        </SidebarMenuButton> */}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
