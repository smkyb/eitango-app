import React, { useState, useEffect } from 'react';
import { BookOpen, Settings } from 'lucide-react';
import { getChartData } from '../utils/storageUtils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Menu = ({ wordCount, streak, onStart, onSettings }) => {
  const [chartData, setChartData] = useState([]);
  const [todayLearned, setTodayLearned] = useState(0);

  useEffect(() => {
    const data = getChartData();
    setChartData(data);
    const today = data[data.length - 1];
    setTodayLearned(today ? today.learned : 0);
  }, []);

  return (
    <div className="menu-container">
      {/* 1. 一番目立つ「学習を始める」ボタンと設定ボタン */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {wordCount > 0 && (
          <button className="btn-primary" onClick={onStart} style={{ padding: '1.2rem', fontSize: '1.1rem' }}>
            <BookOpen size={24} style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle' }} />
            学習を始める
          </button>
        )}
        <button className="btn-outline" onClick={onSettings}>
          <Settings size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
          設定
        </button>
      </div>

      {/* 2. 本日の学習数とストリーク（横並び）およびグラフ */}
      {wordCount > 0 && (
        <div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1, background: 'var(--surface-color)', padding: '1.2rem 1rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', textAlign: 'center', transition: 'background-color 0.3s, border-color 0.3s' }}>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: '500' }}>本日学習した単語数</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{todayLearned}</div>
            </div>
            
            <div style={{ flex: 1, background: 'var(--surface-color)', padding: '1.2rem 1rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', textAlign: 'center', transition: 'background-color 0.3s, border-color 0.3s' }}>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: '500' }}>連続学習日数</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                <span>🔥</span>
                <span>{streak}</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', transition: 'background-color 0.3s, border-color 0.3s' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', textAlign: 'center', fontWeight: '500' }}>直近7日間の学習推移</h3>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="date" tick={{fontSize: 12, fill: 'var(--text-secondary)'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: 'var(--text-secondary)'}} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                  labelStyle={{color: 'var(--text-primary)', fontWeight: 'bold'}}
                />
                <Bar dataKey="learned" radius={[4, 4, 0, 0]}>
                  {
                    chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? 'var(--accent-color)' : '#d1d5db'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
