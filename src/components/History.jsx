import React, { useState, useEffect } from 'react';
import { getHistory, updateHistoryAction } from '../utils/storageUtils';
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';

const History = ({ onBack }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleToggle = (id, currentAction) => {
    const newAction = currentAction === 'KNOW' ? 'DONT_KNOW' : 'KNOW';
    updateHistoryAction(id, newAction);
    setHistory(getHistory());
  };

  return (
    <div className="history-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="study-header" style={{ marginBottom: '1rem' }}>
        <button className="btn-icon" onClick={onBack}>
          <ChevronLeft size={24} /> 戻る
        </button>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>学習履歴 (誤タップ修正)</h2>
        <div style={{ width: 40 }}></div> {/* spacer for centering */}
      </div>
      
      {history.length === 0 ? (
        <div className="empty-state">履歴がありません。</div>
      ) : (
        <div className="history-list">
          {history.map(item => (
            <div key={item.id} className="history-item">
              <div className="history-word">
                <span className="word-text-small">{item.word}</span>
                <span className="timestamp">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="history-action">
                <button 
                  className={`toggle-btn ${item.action === 'KNOW' ? 'know-active' : 'dontknow-active'}`}
                  onClick={() => handleToggle(item.id, item.action)}
                >
                  {item.action === 'KNOW' ? (
                    <><CheckCircle2 size={16} /> わかる</>
                  ) : (
                    <><XCircle size={16} /> わからない</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
