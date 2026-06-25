export const STORAGE_KEY = 'eitango_data';

/**
 * データをローカルストレージから取得します。
 * @returns {Array} 単語データの配列
 */
export const getWords = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * データをローカルストレージに保存します。
 * 各単語に `knownCount` プロパティが存在しない場合は初期化します。
 * @param {Array} words 単語データの配列
 */
export const saveWords = (words) => {
  const initializedWords = words.map(word => ({
    ...word,
    knownCount: typeof word.knownCount === 'number' ? word.knownCount : 0,
    dontKnowCount: typeof word.dontKnowCount === 'number' ? word.dontKnowCount : 0
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initializedWords));
  return initializedWords;
};

/**
 * 単語の「わかる」回数を増やします。
 * @param {number|string} id 単語のID
 * @returns {Array} 更新された単語データの配列
 */
export const incrementKnownCount = (id) => {
  const words = getWords();
  const updatedWords = words.map(word => {
    if (word.id === id) {
      return { ...word, knownCount: word.knownCount + 1 };
    }
    return word;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWords));
  return updatedWords;
};

/**
 * 単語の「わからない」回数を増やします。
 * @param {number|string} id 単語のID
 * @returns {Array} 更新された単語データの配列
 */
export const incrementDontKnowCount = (id) => {
  const words = getWords();
  const updatedWords = words.map(word => {
    if (word.id === id) {
      return { 
        ...word, 
        dontKnowCount: (word.dontKnowCount || 0) + 1 
      };
    }
    return word;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWords));
  return updatedWords;
};

/**
 * ローカルストレージのデータをクリアします。
 */
export const clearWords = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(HISTORY_KEY);
};

// --- History Management ---
export const HISTORY_KEY = 'eitango_history';

/**
 * 履歴を取得します。
 */
export const getHistory = () => {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * 学習アクションを履歴に追加します（最大50件）。
 * @param {Object} word 単語オブジェクト
 * @param {string} action 'KNOW' または 'DONT_KNOW'
 */
export const addHistory = (word, action) => {
  const history = getHistory();
  const newRecord = {
    id: Date.now().toString(), // unique ID for history record
    wordId: word.id,
    word: word.word,
    action: action,
    timestamp: new Date().toISOString()
  };
  
  // 新しいものを先頭に追加し、最大50件に制限
  const updatedHistory = [newRecord, ...history].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
};

/**
 * 過去の履歴のアクションを変更し、単語のカウントを調整します。
 */
export const updateHistoryAction = (historyId, newAction) => {
  const history = getHistory();
  const recordIndex = history.findIndex(h => h.id === historyId);
  
  if (recordIndex === -1) return;
  
  const record = history[recordIndex];
  if (record.action === newAction) return; // 変更なし
  
  // 単語のカウントを調整
  const words = getWords();
  const updatedWords = words.map(w => {
    if (w.id === record.wordId) {
      let knownCount = w.knownCount || 0;
      let dontKnowCount = w.dontKnowCount || 0;
      
      // 元のアクションをキャンセル
      if (record.action === 'KNOW') knownCount = Math.max(0, knownCount - 1);
      if (record.action === 'DONT_KNOW') dontKnowCount = Math.max(0, dontKnowCount - 1);
      
      // 新しいアクションを適用
      if (newAction === 'KNOW') knownCount += 1;
      if (newAction === 'DONT_KNOW') dontKnowCount += 1;
      
      return { ...w, knownCount, dontKnowCount };
    }
    return w;
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWords));
  
  // 履歴も更新
  history[recordIndex].action = newAction;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};
