const QRTimer = ({ timeLeft }) => (
  <aside className="  p-4 mb-2 bg-white mt-2 rounded-2xl">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-danger-dark mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-danger-dark font-medium">Time remaining:</span>
      </div>
      <time className="text-danger-dark font-bold text-lg">
        {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
      </time>
    </div>
    <div className="mt-2 p-4 bg-warning-bg border border-warning-border rounded-2xl">
          <span className="text-xs text-warning-text text-center">
            ⚠️ Please keep this page open until your payment is confirmed.
          </span>
        </div>
  </aside>
);

export default QRTimer;
