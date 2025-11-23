import React from 'react'
import { FaShareAlt, FaTelegram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { FaFacebookMessenger, FaXTwitter } from 'react-icons/fa6';
const ShareLinkToSocial = ({productDetail}) => {
  return (
   
    <nav className="flex items-center gap-3 pt-4">
        <span className="text-gray-700 font-medium">Share:</span>

        {/* Messenger (opens chat with the link in Messenger app) */}
        <a
           href={`https://www.facebook.com/dialog/share?app_id=YOUR_APP_ID&href=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share via Facebook"
            className="text-blue-600 hover:text-blue-800"
        >
            <FaFacebookMessenger size={20} />
        </a>

        {/* Telegram (opens chat with pre-filled link) */}
        <a
            href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(productDetail.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Send via Telegram"
            className="text-blue-400 hover:text-blue-600"
        >
            <FaTelegram size={20} />
        </a>

        {/* WhatsApp (opens chat with pre-filled link) */}
        <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(productDetail.name + ' ' + window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Send via WhatsApp"
            className="text-green-500 hover:text-green-700"
        >
            <FaWhatsapp size={20} />
        </a>
    </nav>

  )
}

export default ShareLinkToSocial
