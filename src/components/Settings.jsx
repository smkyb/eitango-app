import React from 'react';
import { Upload, BookOpen, Trash2, ChevronLeft } from 'lucide-react';

const Settings = ({ wordCount, currentTheme, onToggleTheme, onImport, onHistory, onClear, onBack }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
        <button className="btn-icon" onClick={onBack}>
          <ChevronLeft size={24} /> 戻る
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0, paddingRight: '48px' }}>設定</h2>
      </div>

      <div style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
        {wordCount > 0 ? (
          <p>現在 <strong>{wordCount}</strong> 単語が登録されています。</p>
        ) : (
          <p>データが登録されていません。データを読み込んでください。</p>
        )}
      </div>

      {/* ダークモード切り替えトグル */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem', 
        background: 'var(--surface-color)', 
        borderRadius: 'var(--border-radius)', 
        border: '1px solid var(--border-color)', 
        marginBottom: '1.5rem',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}>
        <span style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '500' }}>ダークモード</span>
        <button 
          onClick={() => onToggleTheme(currentTheme === 'light' ? 'dark' : 'light')} 
          style={{
            width: '50px',
            height: '26px',
            borderRadius: '13px',
            backgroundColor: currentTheme === 'dark' ? 'var(--success-color)' : '#d1d5db',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          aria-label="ダークモード切り替え"
        >
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'white',
            position: 'absolute',
            top: '3px',
            left: currentTheme === 'dark' ? '27px' : '3px',
            transition: 'left 0.3s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button className="btn-outline" onClick={onImport}>
          <Upload size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
          データを読み込む
        </button>

        {wordCount > 0 && (
          <button className="btn-outline" onClick={onHistory}>
            <BookOpen size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            学習履歴（誤タップ修正）
          </button>
        )}

        {wordCount > 0 && (
          <button className="btn-danger-outline" onClick={onClear}>
            <Trash2 size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            学習データをリセット
          </button>
        )}
      </div>
    </div>
  );
};

export default Settings;
