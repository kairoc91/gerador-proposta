import React from 'react';
import type { Proposal, HeaderSection } from '../../types/proposal';
import { HeaderEditor } from './HeaderEditor';

interface Props {
  proposal: Proposal;
  onChange: (updated: Proposal) => void;
}

export const EditorSidebar: React.FC<Props> = ({ proposal, onChange }) => {
  const headerIdx = proposal.sections.findIndex((s) => s.type === 'header');
  const headerSec = proposal.sections[headerIdx] as HeaderSection | undefined;

  const updateHeaderSection = (updated: HeaderSection) => {
    if (headerIdx === -1) return;
    const updatedSections = [...proposal.sections];
    updatedSections[headerIdx] = updated;
    onChange({ ...proposal, sections: updatedSections });
  };

  return (
    <div className="editor-pane">
      <div className="editor-scroll">
        {headerSec && (
          <HeaderEditor
            section={headerSec}
            onChange={updateHeaderSection}
          />
        )}
      </div>
    </div>
  );
};
