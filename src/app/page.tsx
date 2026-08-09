import Link from "next/link";
import { Plus, Play, MoreVertical } from "lucide-react";

export default function Dashboard() {
  const workflows = [
    { id: "1", name: "Onboarding Flow", status: "active", lastRun: "10 mins ago" },
    { id: "2", name: "Data Sync", status: "inactive", lastRun: "2 days ago" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#F5F5F5]">My Workflows</h1>
        <Link 
          href="/workflow/new"
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Workflow
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create from template card */}
        <div className="border border-dashed border-[#2D273F] rounded-lg p-6 flex flex-col items-center justify-center text-center bg-[#08060E] hover:bg-[#181423] transition-colors cursor-pointer min-h-[200px]">
          <div className="w-12 h-12 bg-primary-500/20 text-primary-500 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-[#F5F5F5] mb-2">Customer Support Automation</h3>
          <p className="text-sm text-zinc-400 mb-4">Template: Webhook → LLM → HTTP → Conditional → Approval → Notify</p>
          <Link href="/workflow/template-1" className="text-primary-500 font-medium text-sm hover:underline">
            Use Template
          </Link>
        </div>

        {/* Existing workflows */}
        {workflows.map((wf) => (
          <div key={wf.id} className="border border-[#2D273F] rounded-lg p-6 bg-[#181423] hover:border-zinc-500 transition-colors flex flex-col justify-between min-h-[200px] group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div 
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${
                    wf.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <Play className="w-5 h-5" />
                </div>
                <button className="text-zinc-500 hover:text-zinc-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <h3 className="font-semibold text-[#F5F5F5] text-lg">{wf.name}</h3>
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#2D273F]">
              <span className="text-xs text-zinc-500">Last run: {wf.lastRun}</span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {wf.status === 'active' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${wf.status === 'active' ? 'bg-green-500' : 'bg-zinc-600'}`}></span>
                </span>
                <span className="text-xs font-medium text-zinc-400 capitalize">{wf.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
