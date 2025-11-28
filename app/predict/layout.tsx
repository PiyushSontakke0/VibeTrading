import Header from "@/components/Header";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PredictLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header>
                <ThemeToggle />
            </Header>
            <main>
                {children}
            </main>
        </div>
    );
}