/**
 * 学習セッション用に指定された数（デフォルト10）の単語を選択します。
 * knownCountが小さい順 -> dontKnowCountが小さい順 -> ランダムの順に評価します。
 * 
 * @param {Array} words - 単語データの配列
 * @param {number} count - 取得する単語数
 * @returns {Array} 選択された単語の配列
 */
export function selectSessionWords(words, count = 10) {
  if (!words || words.length === 0) return [];
  
  // 1. シャッフルしてランダムな順序を保証する（同率時のランダム選択のため）
  const shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // 2. dontKnowCountの昇順で安定ソート
  shuffled.sort((a, b) => (a.dontKnowCount || 0) - (b.dontKnowCount || 0));
  
  // 3. knownCountの昇順で安定ソート
  shuffled.sort((a, b) => (a.knownCount || 0) - (b.knownCount || 0));

  return shuffled.slice(0, count);
}
