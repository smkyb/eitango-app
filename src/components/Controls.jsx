import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const Controls = ({ onKnow, onDontKnow, disabled }) => {
  return (
    <div className="controls-container">
      <button 
        className="control-btn btn-dontknow" 
        onClick={onDontKnow}
        disabled={disabled}
      >
        <XCircle size={28} />
        <span>わからない</span>
      </button>
      <button 
        className="control-btn btn-know" 
        onClick={onKnow}
        disabled={disabled}
      >
        <CheckCircle2 size={28} />
        <span>わかる</span>
      </button>
    </div>
  );
};

export default Controls;
