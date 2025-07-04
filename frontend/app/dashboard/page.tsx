// src/app/dashboard/page.tsx
// This page is a Server Component by default

import { createClient } from "@/utils/supabase/server"; // Server-side Supabase client
import { signOut } from "@/app/auth/signout/actions"; // Import the sign out action
import Link from "next/link"; // For any internal navigation links

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Basic check for logged-in user, though middleware should handle redirects
  if (error || !user) {
    // This case should ideally be caught by middleware redirecting to /magic
    // But it's good practice to have a fallback or show a "not logged in" message.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-foreground bg-background text-center">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg mb-8">
          You must be logged in to view the dashboard.
        </p>
        <Link
          href="/magic"
          className="py-2 px-4 rounded-md no-underline bg-blue-600 text-white hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-foreground bg-background">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 animate-gradient-x">
          Your Dashboard
        </h1>
        <p className="text-xl text-gray-200 mb-8">
          Welcome, {user.email?.split("@")[0]}! This is your personalized
          dashboard for Group Fitness Manager.
        </p>

        {/* You can add dashboard-specific content here */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="#"
              className="py-3 px-6 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition duration-200"
            >
              Manage Classes
            </Link>
            <Link
              href="#"
              className="py-3 px-6 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition duration-200"
            >
              Manage Instructors
            </Link>
            {/* Add more dashboard links as needed */}
          </div>
        </div>

        {/* --- Sign Out Button on the Dashboard --- */}
        <form action={signOut} className="inline-block mt-4">
          <button
            type="submit"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10 transition duration-300 ease-in-out"
          >
            Sign Out
          </button>
        </form>
        {/* --- END Sign Out Button --- */}
      </div>

      <footer className="mt-20 text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Group Fitness Manager. All rights
          reserved.
        </p>
        <p className="mt-2">Powered by Next.js and Supabase</p>
      </footer>
    </div>
  );
}
