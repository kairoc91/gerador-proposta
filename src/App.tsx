import { useState } from 'react';
import type { Proposal } from './types/proposal';
import { createInitialProposal } from './utils/defaults';
import { Header } from './components/Header/Header';
import { EditorSidebar } from './components/Editor/EditorSidebar';
import { ProposalPreview } from './components/Preview/ProposalPreview';

export function App() {
  const [proposal, setProposal] = useState<Proposal>(createInitialProposal());
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const handleReset = () => {
    setProposal(createInitialProposal());
  };

  return (
    <div className="app-container">
      <Header proposal={proposal} onReset={handleReset} />
      
      {/* Barra de Abas Responsiva para Mobile */}
      <div className="mobile-tabs">
        <button
          type="button"
          className={`mobile-tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveTab('editor')}
        >
          Editar Proposta
        </button>
        <button
          type="button"
          className={`mobile-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Visualizar PDF
        </button>
      </div>

      <div className="main-content">
        <div className={`pane-wrapper editor-wrapper ${activeTab === 'editor' ? 'active' : ''}`}>
          <EditorSidebar proposal={proposal} onChange={setProposal} />
        </div>
        <div className={`pane-wrapper preview-wrapper-pane ${activeTab === 'preview' ? 'active' : ''}`}>
          <ProposalPreview proposal={proposal} />
        </div>
      </div>
    </div>
  );
}

export default App;
