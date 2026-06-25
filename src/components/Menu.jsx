import React from 'react';
import { BookOpen, Upload, Trash2 } from 'lucide-react';

const Menu = ({ wordCount, onStart, onImport, onHistory, onClear }) => {
  return (
    <div className="menu-container">
      <div className="menu-info">
        {wordCount > 0 ? (
          <p>現在 <strong>{wordCount}</strong> 単語が登録されています。</p>
        ) : (
          <p>データが登録されていません。まずはデータを読み込んでください。</p>
        )}
      </div>

      {wordCount > 0 && (
        <button className="btn-primary" onClick={onStart}>
          <BookOpen size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
          学習を始める
        </button>
      )}
      
      <button className="btn-outline" onClick={onImport}>
        <Upload size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
        データを読み込む
      </button>

      {wordCount > 0 && (
        <button className="btn-outline" onClick={onHistory} style={{ marginBottom: '1rem' }}>
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
  );
};

export default Menu;
