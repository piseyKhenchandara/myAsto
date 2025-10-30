const QRExpired = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p className="text-red-600 font-semibold text-lg">QR Code Expired</p>
    <p className="text-gray-500 text-sm mt-2">Please generate a new QR code</p>
  </div>
);

export default QRExpired;
