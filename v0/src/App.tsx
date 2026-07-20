import { useState } from 'react';
import type { Proposal } from './types/proposal';
import { createInitialProposal } from './utils/defaults';
import { Header } from './components/Header/Header';
import { EditorSidebar } from './components/Editor/EditorSidebar';
import { ProposalPreview } from './components/Preview/ProposalPreview';

export function App() {
  const [proposal, setProposal] = useState<Proposal>(createInitialProposal());

  const handleReset = () => {
    setProposal(createInitialProposal());
  };

  return (
    <div className="app-container">
      <Header proposal={proposal} onReset={handleReset} />
      <main className="main-content">
        <EditorSidebar proposal={proposal} onChange={setProposal} />
        <ProposalPreview proposal={proposal} />
      </main>
    </div>
  );
}

export default App;
