"use client";

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Bot, Webhook, FileJson, GitBranch, ShieldCheck, 
  Bell, Database, Play, CheckCircle2, Clock, XCircle, PauseCircle
} from 'lucide-react';
import clsx from 'clsx';

const iconMap: Record<string, any> = {
  webhook: Webhook,
  llm: Bot,
  http: FileJson,
  conditional: GitBranch,
  approval: ShieldCheck,
  notify: Bell,
  db: Database,
  manual: Play,
  scheduled: Clock,
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  trigger: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  action: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  logic: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
};

export const CustomNode = memo(({ data, isConnectable, selected }: NodeProps) => {
  const Icon = iconMap[data.icon as string] || FileJson;
  const colors = colorMap[data.category as string] || colorMap.action;
  const status = data.status as string | undefined;

  return (
    <div 
      className={clsx(
        "bg-[#181423] rounded-xl border-2 min-w-[200px] shadow-sm transition-all duration-200",
        selected ? "border-primary-500 shadow-md ring-2 ring-primary-500/20" : "border-[#2D273F] hover:border-zinc-600"
      )}
    >
      {/* Node Header */}
      <div className="p-3 flex items-center gap-3 border-b border-[#2D273F]">
        <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center border", colors.bg, colors.text, colors.border)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-[#F5F5F5]">{data.label as string}</div>
          <div className="text-xs text-zinc-400">{data.description as string}</div>
        </div>
      </div>

      {/* Execution Status / Approval UI */}
      {status && (
        <div className={clsx(
          "p-2 text-xs font-medium flex items-center justify-between border-t",
          status === 'completed' && "bg-green-500/10 text-green-400 border-green-500/20",
          status === 'failed' && "bg-red-500/10 text-red-400 border-red-500/20",
          status === 'running' && "bg-blue-500/10 text-blue-400 border-blue-500/20",
          status === 'pending' && "bg-[#0A0710] text-zinc-500 border-[#2D273F]",
          status === 'paused' && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        )}>
          <div className="flex items-center gap-1.5">
            {status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {status === 'failed' && <XCircle className="w-3.5 h-3.5" />}
            {status === 'running' && <Play className="w-3.5 h-3.5 animate-pulse" />}
            {status === 'paused' && <PauseCircle className="w-3.5 h-3.5" />}
            {status === 'pending' && <Clock className="w-3.5 h-3.5" />}
            <span className="capitalize">{status}</span>
          </div>
        </div>
      )}

      {/* Approval specific UI */}
      {status === 'paused' && data.type === 'approval' && (
        <div className="p-4 bg-yellow-500/10 border-t border-yellow-500/20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500/50"></div>
          <p className="text-sm text-[#F5F5F5] font-semibold mb-1">⏸ Workflow Paused</p>
          <p className="text-xs text-yellow-400/80 mb-3">Waiting for approval</p>
          
          <div className="text-left text-xs text-zinc-300 bg-[#0A0710]/50 p-2 rounded border border-[#2D273F] mb-3">
            <p className="font-semibold text-zinc-100 mb-1">{data.label as string}</p>
            <p className="text-zinc-400 mb-2">{data.description as string}</p>
            <p>Order: <span className="text-white">#1234</span></p>
            <p>Amount: <span className="text-white">₹2,500</span></p>
          </div>

          {(data.currentUserRole === 'owner' || data.currentUserRole === 'editor') ? (
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const onReject = data.onReject as (id: string) => void;
                  onReject?.(data.id as string);
                }}
                className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded transition-colors border border-zinc-700"
              >
                Reject
              </button>
              <button 
                onClick={() => {
                  const onApprove = data.onApprove as (id: string) => void;
                  onApprove?.(data.id as string);
                }}
                className="flex-1 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded transition-colors"
              >
                Approve
              </button>
            </div>
          ) : (
            <div className="p-2 bg-zinc-900/50 rounded border border-zinc-800/50 text-xs text-zinc-500">
              <p>You don't have permission to approve this step.</p>
              {/* Frontend-only role behavior for now. Real authorization will be enforced by Hasura Action/backend. Hiding this button is not a security mechanism. */}
            </div>
          )}
        </div>
      )}

      {/* Show approval info if completed or failed */}
      {(status === 'completed' || status === 'failed') && data.type === 'approval' && data.approvedBy && (
        <div className={clsx("p-2 border-t text-xs font-medium", status === 'completed' ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400")}>
          {status === 'completed' ? `✓ Approved by ${data.approvedBy}` : `✗ Rejected by ${data.approvedBy}`}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-zinc-400 border-2 border-[#181423]"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary-500 border-2 border-[#181423]"
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
