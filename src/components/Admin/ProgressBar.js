import React from 'react';

const ProgressBar = ({ currentPage, totalPages }) => {
  const progressPercentage = ((currentPage - 1) / (totalPages - 1)) * 100;

  return (
    <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{ width: `${progressPercentage}%` }}
      ></div>
      <div className="progress-bar-labels">
        {Array.from({ length: totalPages }, (_, index) => (
          <div
            key={index}
            className={`progress-bar-label ${
              index + 1 === currentPage ? 'active' : ''
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
