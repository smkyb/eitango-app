/**
 * 単語のリストから、次に出題する単語を選択します。
 * `knownCount`（わかるを選択した数）が小さい単語を優先的に抽出してランダムに提示します。
 * 
 * @param {Array} words - 単語データの配列
 * @returns {Object|null} 選択された単語、もしくはnull（単語がない場合）
 */
export function selectNextWord(words) {
  if (!words || words.length === 0) return null;

  // knownCountの最小値を見つける
  const minKnownCount = Math.min(...words.map(w => w.knownCount || 0));

  // 最小値を持つ単語のグループを抽出
  const candidateByKnow = words.filter(w => (w.knownCount || 0) === minKnownCount);

  // その中で、dontKnowCountの最小値を見つける
  const minDontKnowCount = Math.min(...candidateByKnow.map(w => w.dontKnowCount || 0));

  // knownCountとdontKnowCountの両方の条件を満たすグループを抽出
  const candidateWords = candidateByKnow.filter(w => (w.dontKnowCount || 0) === minDontKnowCount);

  // グループの中からランダムに1つ選択
  const randomIndex = Math.floor(Math.random() * candidateWords.length);
  return candidateWords[randomIndex];
}
