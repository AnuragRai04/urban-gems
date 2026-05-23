import "./globals.css";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Link from "next/link";
import { getCurrentUser } from "../lib/auth";
import LogoutButton from "../components/LogoutButton";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dmsans" });

export const metadata = {
  title: "UrbanGems | Local Place Discovery",
  description: "Discover and review the best local spots around you.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={`${dmSans.className} ${dmSans.variable} ${playfair.variable} bg-gray-50 min-h-screen flex flex-col text-gray-900`}>
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold font-playfair tracking-tight">
              UrbanGems
            </Link>
            <div className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/places" className="hover:text-blue-600 transition-colors">
                Explore Places
              </Link>
              {user ? (
                <>
                  <span className="text-gray-500">Hi, {user.username}</span>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:text-blue-600 transition-colors">Log In</Link>
                  <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <main className="flex-grow">{children}</main>
        <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} UrbanGems. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}