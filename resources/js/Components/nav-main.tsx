"use client";

import {
    ChevronRight,
    Home,
    Joystick,
    Wifi,
    type LucideIcon,
} from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "@inertiajs/react";

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {/* <SidebarMenuButton>
                    <Link
                        href={route("dashboard.connect")}
                        className="flex items-center space-x-2"
                    >
                        <Wifi className="w-4 h-4" aria-hidden="true" />
                        <span className="">Connect</span>
                    </Link>
                </SidebarMenuButton> */}

                <SidebarMenuButton>
                    <Link
                        href={route("dashboard")}
                        className="flex items-center space-x-2"
                    >
                        <Home className="w-4 h-4" aria-hidden="true" />
                        <span className="">Dashboard</span>
                    </Link>
                </SidebarMenuButton>

                {/* <SidebarMenuButton>
                    <Link
                        href={route("dashboard.control_panel")}
                        className="flex items-center space-x-2"
                    >
                        <Joystick className="w-4 h-4" aria-hidden="true" />
                        <span className="">Control Panel</span>
                    </Link>
                </SidebarMenuButton> */}

                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton asChild>
                                                <Link href={subItem.url}>
                                                    <span>{subItem.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
