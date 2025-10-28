import React from 'react'
import asto_facebook_qr from '../../../assets/qrcode/asto_facebook_qr.jpg'
import asto_telegram_qr from '../../../assets/qrcode/asto_telegram_qr.jpg'
import asto_tiktok_qr from '../../../assets/qrcode/asto_tiktok_qr.jpg'

const ReciptHeader = ({asto_logo = false}) => {
    const shape = "w-20 h-20 md:w-25 md:h-25 object-contain";

  return (
    <header className="w-full border-b-1">
      <div className="flex justify-between items-center gap-2 sm:gap-4">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          {asto_logo && (
            <img 
              src={asto_logo} 
              alt="Asto Logo" 
              className="w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-30 md:h-30 object-contain"
            />
          )}
        </div>

        {/* QR Codes Section */}
        <div className="flex gap-1 xs:gap-2 sm:gap-3 md:gap-4 lg:gap-6 flex-shrink-0">
          <img 
            src={asto_facebook_qr} 
            alt="Facebook QR Code" 
            className={`${shape}`}
          />
          <img 
            src={asto_tiktok_qr} 
            alt="TikTok QR Code" 
            className={`${shape}`}
          />
          
        </div>
      </div>

    </header>
  )
}

export default ReciptHeader