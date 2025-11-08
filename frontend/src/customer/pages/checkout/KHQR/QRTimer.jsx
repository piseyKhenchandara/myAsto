const QRTimer = ({ timeLeft }) => (
  <aside className="  p-4 mb-6 bg-white mt-2 rounded-2xl">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-red-600 font-medium">Time remaining:</span>
      </div>
      <time className="text-red-600 font-bold text-lg">
        {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
      </time>
    </div>
  </aside>
);

export default QRTimer;
