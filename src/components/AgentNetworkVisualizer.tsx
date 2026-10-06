import React from 'react';
import type { AgentInfo, AgentMessage, AgentRole } from '../types/travel';
import { Cpu, ArrowRight, CheckCircle2, Clock, MessageSquare, Zap } from 'lucide-react';

interface AgentNetworkVisualizerProps {
  agents: Record<AgentRole, AgentInfo>;
  traceLogs: AgentMessage[];
  currentStepTitle: string;
  progressPercent: number;
}

export const AgentNetworkVisualizer: React.FC<AgentNetworkVisualizerProps> = ({
  agents,
  traceLogs,
  currentStepTitle,
  progressPercent
}) => {
  const agentList = Object.values(agents);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in font-sans pb-16">
      
      {/* Header & Progress Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 font-outfit">Multi-Agent Network Visualizer</h2>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Observing real-time agent-to-agent message passing & task negotiation
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Execution Progress</span>
            <span className="text-2xl font-extrabold text-blue-600 font-outfit">{progressPercent}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span className="truncate">{currentStepTitle || 'Multi-agent system initializing...'}</span>
            <span className="shrink-0 font-bold text-blue-600">{progressPercent === 100 ? 'Execution Complete' : 'Active Pipeline'}</span>
          </div>
        </div>
      </div>

      {/* Agent Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentList.map((agent) => {
          const isThinking = agent.status === 'thinking';
          const isCommunicating = agent.status === 'communicating';
          const isDone = agent.status === 'done';

          return (
            <div
              key={agent.id}
              className={`bg-white rounded-3xl p-6 border relative overflow-hidden transition-all shadow-sm ${
                isThinking || isCommunicating
                  ? 'border-blue-500 ring-2 ring-blue-500/20 agent-active-glow'
                  : isDone
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Top Color Accent */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5" 
                style={{ backgroundColor: agent.color }}
              />

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-xs"
                    style={{ backgroundColor: agent.accentBg }}
                  >
                    {agent.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-outfit">{agent.name}</h3>
                    <p className="text-[11px] text-slate-500">{agent.roleTitle}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {isDone && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Done</span>
                    </span>
                  )}
                  {(isThinking || isCommunicating) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold animate-pulse">
                      <Zap className="w-3 h-3 text-blue-600" />
                      <span>{isThinking ? 'Thinking' : 'Communicating'}</span>
                    </span>
                  )}
                  {agent.status === 'idle' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium">
                      <Clock className="w-3 h-3" />
                      <span>Idle</span>
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">{agent.description}</p>

              {/* Task Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Current Task:</span>
                <span className={`font-semibold truncate max-w-[200px] ${
                  isThinking || isCommunicating ? 'text-blue-600' : 'text-slate-600'
                }`}>
                  {agent.currentTask || 'Waiting for trigger...'}
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Inter-Agent Communication Console */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 font-outfit">Inter-Agent Communication Log</h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            {traceLogs.length} Messages
          </span>
        </div>

        {/* Message Feed */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {traceLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs font-medium">
              No messages logged yet. Launch the planner to inspect live agent communication.
            </div>
          ) : (
            traceLogs.map((msg) => {
              const senderAgent = agents[msg.sender];
              const receiverAgent = msg.receiver !== 'all' ? agents[msg.receiver] : null;

              return (
                <div
                  key={msg.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-bold text-white flex items-center gap-1"
                        style={{ backgroundColor: senderAgent?.color || '#2563eb' }}
                      >
                        <span>{senderAgent?.avatar}</span>
                        <span>{senderAgent?.name || msg.sender}</span>
                      </span>

                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />

                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-white text-slate-700 border border-slate-200">
                        {receiverAgent ? `${receiverAgent.avatar} ${receiverAgent.name}` : '🌐 All Agents'}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 font-outfit">
                    {msg.title}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{msg.content}</p>

                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
