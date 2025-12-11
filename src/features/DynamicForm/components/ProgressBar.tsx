import React from 'react';

interface ProgressBarProps {
  percent: number;
  height?: number;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  height = 8,
  showLabel = true,
}) => {
  const sanitisedVal = Math.max(0, Math.min(100, percent));

  return (
    <div style={{ width: '100%' }}>
      <div
        aria-hidden
        style={{
          width: '100%',
          background: '#eee',
          borderRadius: height / 2,
          height,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${sanitisedVal}%`,
            height: '100%',
            background: 'green',
            transition: 'width 300ms linear',
          }}
        />
      </div>

      {showLabel && (
        <div style={{ fontSize: 12, marginTop: 6, color: '#333' }}>{sanitisedVal}% completed</div>
      )}
    </div>
  );
};

export default ProgressBar;
