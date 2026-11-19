exports.calculateAverageScore = (feedbacks) => {
  if (!feedbacks.length) return 0;

  const total = feedbacks.reduce((sum, f) => sum + (f.score || 0), 0);
  return Math.round((total / feedbacks.length) * 10) / 10;
};
