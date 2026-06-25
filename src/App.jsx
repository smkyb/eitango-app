import React, { useState, useEffect, useCallback } from 'react';
import Menu from './components/Menu';
import History from './components/History';
import DataImporter from './components/DataImporter';
import Flashcard from './components/Flashcard';
import Controls from './components/Controls';
import { getWords, incrementKnownCount, incrementDontKnowCount, clearWords, addHistory } from './utils/storageUtils';
import { selectNextWord } from './utils/wordSelector';
import { ChevronLeft, Clock } from 'lucide-react';

function App() {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  
  // 画面状態: 'MENU', 'STUDY', 'IMPORT'
  const [currentScreen, setCurrentScreen] = useState('MENU');

  useEffect(() => {
    const loadedWords = getWords();
    setWords(loadedWords);
  }, []);

  const moveToNextWord = useCallback((updatedWordsList) => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentWord(selectNextWord(updatedWordsList));
      setWords(updatedWordsList);
      setCardKey(prev => prev + 1);
      setIsAnimatingOut(false);
    }, 200); 
  }, []);

  const handleKnow = () => {
    if (!currentWord) return;
    addHistory(currentWord, 'KNOW');
    const updatedWords = incrementKnownCount(currentWord.id);
    moveToNextWord(updatedWords);
  };

  const handleDontKnow = () => {
    if (!currentWord) return;
    addHistory(currentWord, 'DONT_KNOW');
    const updatedWords = incrementDontKnowCount(currentWord.id);
    moveToNextWord(updatedWords);
  };

  const handleDataLoaded = (loadedWords) => {
    setWords(loadedWords);
    setCurrentScreen('MENU');
  };

  const handleClearData = () => {
    if (window.confirm("学習データをすべて削除しますか？")) {
      clearWords();
      setWords([]);
      setCurrentWord(null);
    }
  };

  const startStudy = () => {
    if (words.length > 0) {
      setCurrentWord(selectNextWord(words));
      setCurrentScreen('STUDY');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Eitango App</h1>
      </header>

      <main className="app-main">
        {currentScreen === 'MENU' && (
          <Menu 
            wordCount={words.length}
            onStart={startStudy}
            onImport={() => setCurrentScreen('IMPORT')}
            onHistory={() => setCurrentScreen('HISTORY')}
            onClear={handleClearData}
          />
        )}

        {currentScreen === 'HISTORY' && (
          <History onBack={() => {
            // 履歴変更によりカウントが変わった可能性があるためデータを再読み込み
            setWords(getWords());
            setCurrentScreen('MENU');
          }} />
        )}

        {currentScreen === 'IMPORT' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ marginBottom: '1rem' }}>
              <button className="btn-icon" onClick={() => setCurrentScreen('MENU')}>
                <ChevronLeft size={24} /> 戻る
              </button>
            </div>
            <DataImporter onDataLoaded={handleDataLoaded} />
          </div>
        )}

        {currentScreen === 'STUDY' && (
          <div className="study-area">
            <div className="study-header">
              <button className="btn-icon" onClick={() => setCurrentScreen('MENU')}>
                <ChevronLeft size={24} /> 戻る
              </button>
              <div className="progress-indicator">
                学習中 ({words.length}単語)
              </div>
              <button className="btn-icon" onClick={() => setCurrentScreen('HISTORY')} title="履歴（修正）">
                <Clock size={24} />
              </button>
            </div>
            
            <div className={`card-wrapper ${isAnimatingOut ? 'slide-out' : 'slide-in'}`}>
              {currentWord ? (
                <Flashcard 
                  key={cardKey}
                  word={currentWord.word} 
                  sentence={currentWord.sentence} 
                  isFlipped={isFlipped}
                  setIsFlipped={setIsFlipped}
                />
              ) : (
                <div className="empty-state">表示できる単語がありません。</div>
              )}
            </div>

            <Controls 
              onKnow={handleKnow} 
              onDontKnow={handleDontKnow} 
              disabled={isAnimatingOut || !currentWord} 
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
