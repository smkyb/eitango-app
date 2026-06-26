import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import Settings from './components/Settings';
import History from './components/History';
import DataImporter from './components/DataImporter';
import Flashcard from './components/Flashcard';
import Controls from './components/Controls';
import { getWords, incrementKnownCount, incrementDontKnowCount, clearWords, addHistory, recordDailyActivity, calculateStreak, getTheme, setTheme } from './utils/storageUtils';
import { selectSessionWords } from './utils/wordSelector';
import { ChevronLeft, Clock, CheckCircle2 } from 'lucide-react';

function App() {
    const [words, setWords] = useState([]);
    const [currentWord, setCurrentWord] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [cardKey, setCardKey] = useState(0);

    // 画面状態: 'MENU', 'STUDY', 'IMPORT', 'HISTORY', 'SETTINGS'
    const [currentScreen, setCurrentScreen] = useState('MENU');
    const [previousScreen, setPreviousScreen] = useState('MENU');

    // セッション管理用ステート
    const [currentSessionQueue, setCurrentSessionQueue] = useState([]);
    const [nextSessionQueue, setNextSessionQueue] = useState([]);
    const [currentRound, setCurrentRound] = useState(1);
    const [isSessionComplete, setIsSessionComplete] = useState(false);
    const [sessionTotalWords, setSessionTotalWords] = useState(0);

    // テーマとストリークの管理
    const [theme, setAppTheme] = useState('light');
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const loadedWords = getWords();
        setWords(loadedWords);

        // テーマの初期ロードと適用
        const savedTheme = getTheme();
        setAppTheme(savedTheme);
        setTheme(savedTheme);

        // ストリークの初期計算
        setStreak(calculateStreak());
    }, []);

    // 画面遷移時にストリークを再計算（特に学習完了から戻った際などに反映）
    useEffect(() => {
        if (currentScreen === 'MENU') {
            setStreak(calculateStreak());
        }
    }, [currentScreen]);

    const handleToggleTheme = (newTheme) => {
        setAppTheme(newTheme);
        setTheme(newTheme);
    };

    const processNextTurn = (isKnow, updatedWordsList) => {
        setIsAnimatingOut(true);

        let newCurrentQueue = [...currentSessionQueue].slice(1);
        let newNextQueue = [...nextSessionQueue];
        let nextRound = currentRound;
        let isComplete = false;

        if (!isKnow) {
            newNextQueue.push(currentWord);
        }

        if (newCurrentQueue.length === 0) {
            if (newNextQueue.length === 0) {
                isComplete = true;
            } else {
                newCurrentQueue = newNextQueue;
                newNextQueue = [];
                nextRound = currentRound + 1;
            }
        }

        setTimeout(() => {
            setIsFlipped(false);
            setWords(updatedWordsList);

            if (isComplete) {
                setIsSessionComplete(true);
                setCurrentWord(null);
            } else {
                setCurrentSessionQueue(newCurrentQueue);
                setNextSessionQueue(newNextQueue);
                setCurrentRound(nextRound);
                setCurrentWord(newCurrentQueue[0]);
                setCardKey(prev => prev + 1);
            }
            setIsAnimatingOut(false);
        }, 200);
    };

    const handleKnow = () => {
        if (!currentWord || isAnimatingOut) return;
        let updatedWords = words;
        // 1周目のみグローバル状態と履歴を更新
        if (currentRound === 1) {
            addHistory(currentWord, 'KNOW');
            recordDailyActivity('KNOW');
            updatedWords = incrementKnownCount(currentWord.id);
        }
        processNextTurn(true, updatedWords);
    };

    const handleDontKnow = () => {
        if (!currentWord || isAnimatingOut) return;
        let updatedWords = words;
        // 1周目のみグローバル状態と履歴を更新
        if (currentRound === 1) {
            addHistory(currentWord, 'DONT_KNOW');
            recordDailyActivity('DONT_KNOW');
            updatedWords = incrementDontKnowCount(currentWord.id);
        }
        processNextTurn(false, updatedWords);
    };

    const handleDataLoaded = (loadedWords) => {
        setWords(loadedWords);
        setCurrentScreen(previousScreen);
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
            const sessionWords = selectSessionWords(words, 10);
            setCurrentSessionQueue(sessionWords);
            setNextSessionQueue([]);
            setCurrentRound(1);
            setIsSessionComplete(false);
            setSessionTotalWords(sessionWords.length);
            setCurrentWord(sessionWords[0]);
            setIsFlipped(false);
            setCardKey(prev => prev + 1);
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
                        streak={streak}
                        onStart={startStudy}
                        onSettings={() => setCurrentScreen('SETTINGS')}
                    />
                )}

                {currentScreen === 'SETTINGS' && (
                    <Settings
                        wordCount={words.length}
                        currentTheme={theme}
                        onToggleTheme={handleToggleTheme}
                        onBack={() => setCurrentScreen('MENU')}
                        onImport={() => {
                            setPreviousScreen('SETTINGS');
                            setCurrentScreen('IMPORT');
                        }}
                        onHistory={() => {
                            setPreviousScreen('SETTINGS');
                            setCurrentScreen('HISTORY');
                        }}
                        onClear={handleClearData}
                    />
                )}

                {currentScreen === 'HISTORY' && (
                    <History onBack={() => {
                        setWords(getWords());
                        setCurrentScreen(previousScreen);
                    }} />
                )}

                {currentScreen === 'IMPORT' && (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <button className="btn-icon" onClick={() => setCurrentScreen(previousScreen)}>
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

                            {!isSessionComplete && (
                                <div className="progress-indicator">
                                    学習中 ({currentRound}周目: 残り{currentSessionQueue.length}単語)
                                </div>
                            )}

                            <button className="btn-icon" onClick={() => {
                                setPreviousScreen('STUDY');
                                setCurrentScreen('HISTORY');
                            }} title="履歴（修正）">
                                <Clock size={24} />
                            </button>
                        </div>

                        {isSessionComplete ? (
                            <div className="session-complete-view" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <CheckCircle2 size={64} color="var(--success-color)" style={{ marginBottom: '1rem' }} />
                                    <h2>セッション完了！</h2>
                                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{sessionTotalWords}単語の学習が終わりました。</p>
                                </div>
                                <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <button className="btn-primary" onClick={startStudy}>
                                        続けて次の10単語を学習
                                    </button>
                                    <button className="btn-outline" onClick={() => setCurrentScreen('MENU')}>
                                        メニューに戻る
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={`card-wrapper ${isAnimatingOut ? 'slide-out' : 'slide-in'}`}>
                                    {currentWord && (
                                        <Flashcard
                                            key={cardKey}
                                            word={currentWord.word}
                                            sentence={currentWord.sentence}
                                            isFlipped={isFlipped}
                                            setIsFlipped={setIsFlipped}
                                        />
                                    )}
                                </div>

                                <Controls
                                    onKnow={handleKnow}
                                    onDontKnow={handleDontKnow}
                                    disabled={isAnimatingOut || !currentWord}
                                />
                            </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
