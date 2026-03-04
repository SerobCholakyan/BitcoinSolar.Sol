import { redirect } from "next/navigation";

export default function DashboardLayout({ children }) {
  const isLoggedIn = false; // replace with real auth check

  if (!isLoggedIn) {
    redirect("/login");
  }

  return <>{children}</>;
}
