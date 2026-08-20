import { useState } from 'react';
import ChatInterface from '../components/chat/ChatInterface';
import AgentWorkflow from '../components/chat/AgentWorkflow';

export default function Chat() {
  const [pipelineState, setPipelineState] = useState({
    step: 0,
    text: 'Waiting for shopping query...',
    isProcessing: false,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-2.5">
          AI Shopping Assistant
        </h1>
        <p className="text-sm text-surface-400 mt-1">
          State your requirements naturally — PayPilot AI parses budgets, compares options, and builds your cart.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Chat Interface */}
        <div className="lg:col-span-8">
          <ChatInterface onPipelineUpdate={setPipelineState} />
        </div>

        {/* Dynamic Agent Workflow Tracker */}
        <div className="lg:col-span-4 sticky top-24">
          <AgentWorkflow
            currentStep={pipelineState.step}
            statusText={pipelineState.text}
            isProcessing={pipelineState.isProcessing}
          />
        </div>
      </div>
    </div>
  );
}
