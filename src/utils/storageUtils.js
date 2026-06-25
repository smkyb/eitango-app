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
  localStorage.removeItem(DAILY_STATS_KEY);
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
  const oldAction = history[recordIndex].action;
  history[recordIndex].action = newAction;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

  // 日次データも調整 (本日のデータの場合のみ)
  updateDailyStatsFromHistory(oldAction, newAction);
};

// --- Daily Stats Management ---
export const DAILY_STATS_KEY = 'eitango_daily_stats';

/**
 * 今日の日付文字列を YYYY-MM-DD 形式で取得します。
 */
const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * 過去7日間の日付文字列の配列を取得します。
 */
const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }
  return days;
};

/**
 * 日次の学習データを取得します。
 */
export const getDailyStats = () => {
  const data = localStorage.getItem(DAILY_STATS_KEY);
  return data ? JSON.parse(data) : {};
};

/**
 * グラフ描画用に、過去7日分のデータを整形して返します。
 */
export const getChartData = () => {
  const stats = getDailyStats();
  const days = getLast7Days();
  return days.map(dayStr => {
    const [, month, date] = dayStr.split('-');
    const shortDate = `${parseInt(month)}/${parseInt(date)}`;
    const dayData = stats[dayStr] || { learned: 0, know: 0, dontKnow: 0 };
    return {
      date: shortDate,
      learned: dayData.learned,
      know: dayData.know,
      dontKnow: dayData.dontKnow
    };
  });
};

/**
 * 本日の学習データを記録します。
 * @param {string} action 'KNOW' または 'DONT_KNOW'
 */
export const recordDailyActivity = (action) => {
  const stats = getDailyStats();
  const today = getTodayStr();
  
  if (!stats[today]) {
    stats[today] = { learned: 0, know: 0, dontKnow: 0 };
  }
  
  stats[today].learned += 1;
  if (action === 'KNOW') stats[today].know += 1;
  if (action === 'DONT_KNOW') stats[today].dontKnow += 1;
  
  localStorage.setItem(DAILY_STATS_KEY, JSON.stringify(stats));
};

/**
 * 履歴からアクションが変更された際に日次データも調整します。（本日のデータのみ対象とする）
 */
const updateDailyStatsFromHistory = (oldAction, newAction) => {
  const stats = getDailyStats();
  const today = getTodayStr();
  
  if (!stats[today]) return;
  
  if (oldAction === 'KNOW') stats[today].know = Math.max(0, stats[today].know - 1);
  if (oldAction === 'DONT_KNOW') stats[today].dontKnow = Math.max(0, stats[today].dontKnow - 1);
  
  if (newAction === 'KNOW') stats[today].know += 1;
  if (newAction === 'DONT_KNOW') stats[today].dontKnow += 1;
  
  localStorage.setItem(DAILY_STATS_KEY, JSON.stringify(stats));
};

/**
 * 連続学習日数を計算します。
 */
export const calculateStreak = () => {
  const stats = getDailyStats();
  const today = new Date();
  
  let streak = 0;
  const checkDate = new Date(today);

  const getFormatStr = (dateObj) => {
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  };

  // 今日のチェック
  const todayStr = getFormatStr(checkDate);
  if (stats[todayStr] && stats[todayStr].learned > 0) {
    streak += 1;
  }

  // 昨日のチェックから順にさかのぼる
  checkDate.setDate(checkDate.getDate() - 1);
  while (true) {
    const dateStr = getFormatStr(checkDate);
    if (stats[dateStr] && stats[dateStr].learned > 0) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

// --- Theme Management ---
export const THEME_KEY = 'eitango_theme';

export const getTheme = () => {
  return localStorage.getItem(THEME_KEY) || 'light';
};

export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
};
