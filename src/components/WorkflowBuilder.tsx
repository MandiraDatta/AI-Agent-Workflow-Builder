"use client";

import { useState, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import { Save, Play, Settings, X, Plus, GripVertical } from 'lucide-react';

type CustomNodeData = {
  label: string;
  description: string;
  icon: string;
  category: string;
  status: string;
  type?: string;
  approvedBy?: string;
  currentUserRole?: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  requiredRole?: string;
};

type AppNode = Node<CustomNodeData, 'custom'>;

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const initialNodes: AppNode[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 100, y: 150 },
    data: { 
      label: 'Incoming Webhook', 
      description: 'Trigger on new support ticket',
      icon: 'webhook',
      category: 'trigger',
      status: 'completed'
    }
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 400, y: 150 },
    data: { 
      label: 'LLM Categorization', 
      description: 'Categorize issue & extract sentiment',
      icon: 'llm',
      category: 'action',
      status: 'completed'
    }
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 700, y: 150 },
    data: { 
      label: 'Fetch User Data', 
      description: 'Get CRM details via HTTP',
      icon: 'http',
      category: 'action',
      status: 'running'
    }
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 1000, y: 150 },
    data: { 
      label: 'VIP Check', 
      description: 'Conditional routing based on plan',
      icon: 'conditional',
      category: 'logic',
      status: 'pending'
    }
  },
  {
    id: '5',
    type: 'custom',
    position: { x: 1300, y: 50 },
    data: { 
      label: 'Manual Approval', 
      description: 'Approve refund request',
      icon: 'approval',
      type: 'approval',
      category: 'logic',
      status: 'paused'
    }
  },
  {
    id: '6',
    type: 'custom',
    position: { x: 1300, y: 250 },
    data: { 
      label: 'Notify Support', 
      description: 'Send Slack alert for standard issue',
      icon: 'notify',
      category: 'action',
      status: 'pending'
    }
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5', sourceHandle: 'a' },
  { id: 'e4-6', source: '4', target: '6', sourceHandle: 'b' },
];

export default function WorkflowBuilder({ workflowId }: { workflowId: string }) {
  const isTemplate = workflowId === 'template-1';
  
  const [nodes, setNodes, onNodesChange] = useNodesState(isTemplate ? initialNodes : []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(isTemplate ? initialEdges : []);
  
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<'owner' | 'editor' | 'viewer'>('owner');

  const handleApprove = useCallback(async (nodeId: string) => {
    setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, status: 'completed', approvedBy: 'Alice' } } : n));
    
    // Continue execution: Notify Support node
    setNodes(nds => nds.map(n => n.id === '6' ? { ...n, data: { ...n.data, status: 'running' } } : n));
    await new Promise(res => setTimeout(res, 800));
    setNodes(nds => nds.map(n => n.id === '6' ? { ...n, data: { ...n.data, status: 'completed' } } : n));
  }, [setNodes]);

  const handleReject = useCallback((nodeId: string) => {
    setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, status: 'failed', approvedBy: 'Alice' } } : n));
    // Workflow stops
  }, [setNodes]);

  // Inject current user role and handlers into nodes so CustomNode can read them
  const mappedNodes = nodes.map(n => ({
    ...n,
    data: {
      ...n.data,
      currentUserRole: userRole,
      onApprove: handleApprove,
      onReject: handleReject
    }
  }));

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = (_: any, node: any) => {
    setSelectedNode(node);
    setSidebarOpen(true);
  };

  const executeWorkflow = async () => {
    // 1. Reset all nodes
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, status: 'pending', approvedBy: undefined } })));
    
    // Simulate sequential execution
    const runNode = async (id: string, duration = 800) => {
      setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, status: 'running' } } : n));
      await new Promise(res => setTimeout(res, duration));
      setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, status: 'completed' } } : n));
    };

    await runNode('1'); // Webhook
    await runNode('2', 1000); // LLM
    await runNode('3'); // HTTP
    await runNode('4', 600); // Conditional

    // Node 5: Approval Gate (Paused)
    setNodes(nds => nds.map(n => n.id === '5' ? { ...n, data: { ...n.data, status: 'paused' } } : n));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-canvas-bg overflow-hidden relative">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-[#2D273F] bg-[#0A0710] flex items-center justify-between px-4 z-10 shrink-0 relative">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-[#F5F5F5]">
            {isTemplate ? "Customer Support Automation" : "New Workflow"}
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-[#181423] text-zinc-400 text-xs font-medium border border-[#2D273F]">
            Draft
          </span>
          <select 
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as any)}
            className="text-xs border border-[#2D273F] rounded px-2 py-1 ml-4 bg-[#181423] text-zinc-300 focus:outline-none"
          >
            <option value="owner">Role: Owner</option>
            <option value="editor">Role: Editor</option>
            <option value="viewer">Role: Viewer</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            disabled={userRole === 'viewer'}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-[#181423] rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button 
            disabled={userRole === 'viewer'}
            onClick={executeWorkflow}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            Execute
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <ReactFlow
          nodes={mappedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onPaneClick={() => setSidebarOpen(false)}
          fitView
          className="bg-canvas-bg"
        >
          <Background gap={24} size={2} color="#2D273F" variant={BackgroundVariant.Dots} />
          <Controls className="bg-[#181423] border-[#2D273F] shadow-sm !text-zinc-400" />
          <MiniMap 
            nodeColor={(node) => {
              if (node.data.category === 'trigger') return '#A855F7';
              if (node.data.category === 'logic') return '#F97316';
              return '#3B82F6';
            }}
            maskColor="rgba(10, 7, 16, 0.7)"
            className="border border-[#2D273F] shadow-sm rounded-lg overflow-hidden !bg-[#181423]"
          />
        </ReactFlow>

        {/* Right Configuration Panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-80 bg-[#0A0710] border-l border-[#2D273F] shadow-xl transition-transform duration-300 z-20 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {selectedNode ? (
            <div className="flex flex-col h-full">
              <div className="h-14 border-b border-[#2D273F] flex items-center justify-between px-4 shrink-0 bg-[#08060E]">
                <div className="font-semibold text-[#F5F5F5] flex items-center gap-2">
                  <Settings className="w-4 h-4 text-zinc-500" />
                  Configure Node
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white hover:bg-[#181423] rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Node Name</label>
                  <input 
                    type="text" 
                    value={(selectedNode?.data?.label as string) || ''} 
                    onChange={(e) => {
                      setNodes(nds => nds.map(n => {
                        if (n.id === selectedNode.id) {
                          return { ...n, data: { ...n.data, label: e.target.value } };
                        }
                        return n;
                      }));
                      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, label: e.target.value } });
                    }}
                    className="w-full px-3 py-2 border border-[#2D273F] rounded-md text-sm text-[#F5F5F5] bg-[#181423] focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    value={(selectedNode?.data?.description as string) || ''}
                    onChange={(e) => {
                      setNodes(nds => nds.map(n => {
                        if (n.id === selectedNode.id) {
                          return { ...n, data: { ...n.data, description: e.target.value } };
                        }
                        return n;
                      }));
                      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, description: e.target.value } });
                    }}
                    className="w-full px-3 py-2 border border-[#2D273F] rounded-md text-sm text-[#F5F5F5] bg-[#181423] focus:outline-none focus:ring-1 focus:ring-primary-500 min-h-[80px]"
                  />
                </div>

                {selectedNode.data.icon === 'llm' && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <label className="block text-xs font-semibold text-blue-400 mb-2">Prompt Template</label>
                    <textarea 
                      defaultValue="Analyze the following customer request and extract the sentiment and intent. Request: {{ $json.body }}"
                      className="w-full px-3 py-2 border border-blue-500/30 rounded-md text-sm text-blue-100 bg-[#181423] focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[120px] font-mono text-xs"
                    />
                  </div>
                )}

                {selectedNode.data.type === 'approval' && (
                  <div className="space-y-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="text-sm font-medium text-yellow-500 mb-2 border-b border-yellow-500/20 pb-2">Approval Settings</div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">Approval Title</label>
                      <input 
                        type="text" 
                        defaultValue="Approve Customer Refund" 
                        className="w-full px-3 py-2 border border-[#2D273F] rounded-md text-sm text-[#F5F5F5] bg-[#181423]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">Approval Description</label>
                      <textarea 
                        defaultValue="Review and approve the refund before processing" 
                        className="w-full px-3 py-2 border border-[#2D273F] rounded-md text-sm text-[#F5F5F5] bg-[#181423] min-h-[60px]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">Required Role</label>
                      <select className="w-full px-3 py-2 border border-[#2D273F] rounded-md text-sm text-[#F5F5F5] bg-[#181423]">
                        <option>Owner / Editor</option>
                        <option>Owner Only</option>
                        <option>Anyone</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedNode.data.icon === 'webhook' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">HTTP Method</label>
                      <select className="w-full px-3 py-2 border border-[#2D273F] rounded-md text-sm text-[#F5F5F5] bg-[#181423]">
                        <option>POST</option>
                        <option>GET</option>
                        <option>PUT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">Webhook URL</label>
                      <div className="flex">
                        <input type="text" readOnly value="https://api.myapp.com/wh/12345" className="flex-1 px-3 py-2 border border-[#2D273F] rounded-l-md text-sm text-zinc-400 bg-[#08060E] font-mono text-xs" />
                        <button className="px-3 py-2 bg-[#2D273F] text-zinc-300 text-xs font-medium rounded-r-md hover:bg-[#3D3550] transition-colors">Copy</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 p-8 text-center">
              <Settings className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm">Select a node to configure its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
