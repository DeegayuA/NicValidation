import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getSession();
  if (!session) {
    // redirect("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session ? session.user?.name || "NaN" : "Guest"}!</p>
    </div>
  );
}
