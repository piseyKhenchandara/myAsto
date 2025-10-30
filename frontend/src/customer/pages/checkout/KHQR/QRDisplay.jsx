import QRCode from 'react-qr-code';

const QRDisplay = ({ resFromKHQR }) => (
  <div>
    <h2
      className="text-center bg-red-600 text-white pb-10 py-2 font-semibold text-lg"
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 100% 100%, 90% 60%, 0 60%)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
      }}
    >
      KHQR
    </h2>

    <div className="pb-2">
      <div className="border-b-2 border-dashed pb-5 border-gray-400 pl-10">
        <p>{resFromKHQR.data.BAKONG_ACCOUNT_NAME}</p>
        <span className="font-bold md:text-2xl">${parseFloat(resFromKHQR.data.amount).toFixed(2)}</span>
      </div>

      <figure className="relative pt-5 px-10">
        <QRCode value={resFromKHQR.data.qr_code} size={256} level="H" className="w-full h-auto" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center">
          <span className="text-white rounded-full text-xl font-bold bg-black px-[14px] py-[6px]">$</span>
        </div>
      </figure>

      <footer className="mt-5 text-center">
        <p className="text-xs text-gray-500">MD5: {resFromKHQR.data.qr_md5?.substring(0, 16)}...</p>
      </footer>
    </div>
  </div>
);

export default QRDisplay;
