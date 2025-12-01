import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Redirect based on role
  const role = session.user.role;

  if (role === "ADMIN") {
    redirect("/admin/dashboard");
  } else if (role === "TEACHER") {
    redirect("/teacher/dashboard");
  } else if (role === "STUDENT") {
    redirect("/student/dashboard");
  }

  return null;
}
