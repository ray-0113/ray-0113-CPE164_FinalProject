import { ThemeProvider } from "@/Components/theme-provider";
import { Head } from "@inertiajs/react";
import { ModeToggle } from "@/Components/mode-toggle";
import { Toaster } from "@/Components/ui/toaster"
import MqttProvider from "@/Components/MQTT/mqtt-context_new";

export default function ProjectDashboard() {
    return (
        <div>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <div>
                    <Toaster />
                </div>

                <Head title="Dashboard" />
      
                <div className="absolute top-2 right-10 p-5">
                    <ModeToggle />
                </div>

                <div className=''>
                <MqttProvider />
                </div>

            </ThemeProvider>
        </div>
    );
}
