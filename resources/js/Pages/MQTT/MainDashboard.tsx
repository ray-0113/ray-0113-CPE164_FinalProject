import { PropsWithChildren, ReactNode, useEffect } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/Components/theme-provider";
import toast, { Toaster } from 'react-hot-toast';
import { Separator } from "@/Components/ui/separator";
import { AppSidebar } from "@/Components/app-sidebar";
import { Head } from "@inertiajs/react";
import { ModeToggle } from "@/Components/mode-toggle";
import { MqttProvider } from "@/Components/MQTT/mqtt-context";

interface BreadcrumbItemProps {
    title: string;
    link: string;
}

interface Main_DashboardProps {
    header?: ReactNode;
    breadcrumbs?: BreadcrumbItemProps[];
}

export default function Main_Dashboard({
    header,
    breadcrumbs,
    children,
}: PropsWithChildren<Main_DashboardProps>) {

    useEffect(() => {
        return () => {
            toast.dismiss();
        };
    }, []);

    return (
        <MqttProvider> 
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <div>
                    <Toaster position="top-right"/>
                </div>

                <Head title="Dashboard" />

                <SidebarProvider>
                    <AppSidebar/>
                    <SidebarInset>
                        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />

                            <Separator orientation="vertical" className="mr-2 h-4" />

                            <ModeToggle />

                            <Separator orientation="vertical" className="mr-2 h-4" />
                        </header>

                        <div className="flex flex-1 flex-col gap-5 p-10 pt-10">
                            {header}
                            <div>{children}</div> 
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </ThemeProvider>
        </MqttProvider>
    );
}
