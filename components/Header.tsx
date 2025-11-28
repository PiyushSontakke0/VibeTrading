import Link from "next/link"
import Image from "next/image"
import { NavigationMenuDemo } from "./nav-header-menu"

const Header = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <header className="sticky top-0 shadow-sm z-50 bg-card/90 border-b border-border backdrop-blur-sm">
            <div className="container mx-auto flex items-center justify-between py-3 px-4">

                {/* Left: Logo */}
                <Link href="/">
                    <Image
                        src="/vercel.svg"
                        alt="Logo"
                        width={140}
                        height={32}
                        className="h-8 w-auto cursor-pointer "
                    />
                </Link>

                {/* Right: Nav */}
                <NavigationMenuDemo>{children}</NavigationMenuDemo>
            </div>
        </header>
    )
}

export default Header
