import React from 'react';
import classNames from 'classnames';

const Flashcard = ({ word, sentence, isFlipped, setIsFlipped }) => {
  return (
    <div 
      className="flashcard-container"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={classNames('flashcard', { 'is-flipped': isFlipped })}>
        {/* 表面: 単語 */}
        <div className="flashcard-face flashcard-front">
          <span className="card-label">WORD</span>
          <h1 className="word-text">{word}</h1>
          <p className="instruction-text">タップして裏返す</p>
        </div>

        {/* 裏面: 例文 */}
        <div className="flashcard-face flashcard-back">
          <span className="card-label">SENTENCE</span>
          <p className="sentence-text">{sentence}</p>
          <p className="instruction-text">タップして表に戻す</p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
