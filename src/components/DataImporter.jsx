import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { saveWords } from '../utils/storageUtils';

const DataImporter = ({ onDataLoaded }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        if (Array.isArray(jsonData)) {
          const initializedData = saveWords(jsonData);
          onDataLoaded(initializedData);
        } else {
          alert("JSONフォーマットが正しくありません。配列である必要があります。");
        }
      } catch (error) {
        alert("ファイルの読み込みまたはパースに失敗しました。");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="importer-container">
      <div className="importer-card">
        <Upload size={48} className="importer-icon" />
        <h2>学習データを読み込む</h2>
        <p>スマートフォンのローカルにあるJSONファイルを選択してください。</p>
        <button 
          className="btn-primary"
          onClick={() => fileInputRef.current.click()}
        >
          ファイルを選択
        </button>
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
      </div>
    </div>
  );
};

export default DataImporter;
