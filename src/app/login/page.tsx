import { LoginForm } from "./LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | AI Agent Workflow Builder",
  description: "Sign in to your workspace to access your organization's workflows and automation.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0710] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <LoginForm />
    </div>
  );
}
