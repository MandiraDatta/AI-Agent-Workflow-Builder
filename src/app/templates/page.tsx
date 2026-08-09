import Link from "next/link";
import { ArrowRight, Bot, Webhook, FileJson, GitBranch, ShieldCheck, Bell } from "lucide-react";

export default function Templates() {
  const templateSteps = [
    { name: "Webhook", icon: Webhook, color: "text-purple-400", bg: "bg-purple-500/20" },
    { name: "LLM", icon: Bot, color: "text-blue-400", bg: "bg-blue-500/20" },
    { name: "HTTP", icon: FileJson, color: "text-green-400", bg: "bg-green-500/20" },
    { name: "Conditional", icon: GitBranch, color: "text-orange-400", bg: "bg-orange-500/20" },
    { name: "Approval", icon: ShieldCheck, color: "text-red-400", bg: "bg-red-500/20" },
    { name: "Notify", icon: Bell, color: "text-yellow-400", bg: "bg-yellow-500/20" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#F5F5F5]">Templates</h1>
        <p className="text-zinc-400 mt-2">Start with a pre-built workflow template to save time.</p>
      </div>

      <div className="bg-[#08060E] border border-[#2D273F] rounded-xl overflow-hidden shadow-sm">
        <div className="p-8 border-b border-[#2D273F]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="inline-block px-3 py-1 bg-primary-500/20 text-primary-500 font-medium text-xs rounded-full mb-3">
                Featured
              </div>
              <h2 className="text-xl font-bold text-[#F5F5F5]">Customer Support Automation</h2>
              <p className="text-zinc-400 mt-2 max-w-2xl">
                Automatically process incoming customer requests. Uses an LLM to categorize and extract information, 
                fetches user data via HTTP, routes the request based on priority, requires manual approval for high-risk actions, 
                and notifies the team.
              </p>
            </div>
            <Link 
              href="/workflow/template-1"
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-md font-medium transition-colors"
            >
              Use Template
            </Link>
          </div>
        </div>
        
        <div className="p-8 bg-[#100C16]">
          <h3 className="text-sm font-semibold text-zinc-500 mb-6 uppercase tracking-wider">Workflow Preview</h3>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {templateSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.name} className="flex items-center gap-2 shrink-0">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-14 h-14 rounded-xl shadow-sm border border-[#2D273F] flex items-center justify-center bg-[#181423] z-10 relative`}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${step.bg} ${step.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-zinc-400">{step.name}</span>
                  </div>
                  
                  {index < templateSteps.length - 1 && (
                    <div className="w-8 flex items-center justify-center text-zinc-600 mb-6">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
