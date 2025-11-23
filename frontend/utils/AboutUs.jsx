import React, { useEffect } from 'react'
import pisey from '../src/assets/ceo/Pisey.png'
import endy from '../src/assets/ceo/endyong.png'
import panha from '../src/assets/ceo/panhaPlaceholder.png'
import facebookIcon from '../src/assets/logoes/facebook_logo.png'
import instagramIcon from '../src/assets/logoes/ig_logo.png'
import telegramIcon from '../src/assets/logoes/telegram_logo.png'
import githubIcon from '../src/assets/logoes/github_logo.png'

const SocialLinks = ({ links }) => (
  <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
    {links.github && (
      <a
        href={links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-900 hover:bg-gray-700 p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 shadow-sm hover:shadow-md"
      >
        <img src={githubIcon} alt="GitHub" className="h-4 w-4 object-contain" />
      </a>
    )}
    {links.facebook && (
      <a
        href={links.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 shadow-sm hover:shadow-md"
      >
        <img src={facebookIcon} alt="Facebook" className="h-4 w-4 object-contain" />
      </a>
    )}
    {links.instagram && (
      <a
        href={links.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 shadow-sm hover:shadow-md"
      >
        <img src={instagramIcon} alt="Instagram" className="h-4 w-4 object-contain" />
      </a>
    )}
    {links.telegram && (
      <a
        href={links.telegram}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-sky-500 hover:bg-sky-400 p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 shadow-sm hover:shadow-md"
      >
        <img src={telegramIcon} alt="Telegram" className="h-4 w-4 object-contain" />
      </a>
    )}
  </div>
)

const teamMembers = [
  {
    name: 'Khen Chandarapisey',
    role: 'Web developer',
    description: '',
    image: pisey,
    links: {
      github: 'https://github.com/SeYz-GHB',
      facebook: 'https://www.facebook.com/pisey.khenchandara',
      telegram: 'https://t.me/Reajasey',
    },
  },
  {
    name: 'Ong Endy',
    role: 'Frontend developer',
    description: '',
    image: endy,
    links: {
      github: 'https://github.com/Endy0611',
      facebook: 'https://www.facebook.com/ong.endy',
      telegram: 'https://t.me/endyong96',
    },
  },
  {
    name: 'Hak Titpanha',
    role: 'Marketing Specialist',
    description: '',
    image: panha,
    links: {
      github: '',
      facebook: 'https://www.facebook.com/hak.tit.panha.2025',
      telegram: '',
    },
  },
]

const AboutUs = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('show')
        })
      },
      { threshold: 0.15 }
    )

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .fade-in, .fade-left, .fade-right, .scale-in {
          opacity: 0;
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .fade-in.show { opacity: 1; transform: translateY(0); }
        .fade-left { transform: translateX(-40px); }
        .fade-left.show { opacity: 1; transform: translateX(0); }
        .fade-right { transform: translateX(40px); }
        .fade-right.show { opacity: 1; transform: translateX(0); }
        .scale-in { transform: scale(0.85); }
        .scale-in.show { opacity: 1; transform: scale(1); }

        .gradient-text {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .team-card-image-container {
          height: 220px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
        }

        @media (min-width: 640px) {
          .team-card-image-container { height: 260px; }
        }

        @media (min-width: 1024px) {
          .team-card-image-container { height: 300px; }
        }
      `}</style>

      <div className="bg-gradient-to-b from-white via-gray-50 to-white min-h-screen py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Title */}
          <div className="text-center space-y-4 pt-8 fade-in">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
              About <span className="gradient-text">ASTO</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-lg">
              Your trusted online store for quality tech products.
            </p>
          </div>

          {/* Mission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-gray-100 hover:border-green-500 fade-left">
              <h2 className="text-xl sm:text-3xl font-bold">Our Mission</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-green-600 my-3"></div>
              <p className="text-gray-600 text-sm sm:text-base">
                To make online shopping easy and enjoyable with fast delivery and secure transactions.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-gray-100 hover:border-green-500 fade-right">
              <h2 className="text-xl sm:text-3xl font-bold">What We Offer</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-green-600 my-3"></div>
              <ul className="space-y-3 text-gray-600 text-sm sm:text-base">
                <li className="flex gap-3">• Premium tech accessories</li>
                <li className="flex gap-3">• Comfortable chairs and bags</li>
                <li className="flex gap-3">• Fast delivery across Cambodia</li>
                <li className="flex gap-3">• Friendly customer service</li>
              </ul>
            </div>
          </div>

          {/* Team */}
          <div className="space-y-10">
            <div className="text-center fade-in">
              <h2 className="text-2xl sm:text-4xl font-bold">Meet Our Team</h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
                Passionate developers working together to bring you the best experience.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {teamMembers.map((member, i) => (
                <div
                  key={i}
                  className="group rounded-xl overflow-hidden w-full sm:w-72 lg:w-80 bg-white shadow hover:shadow-xl scale-in"
                >
                  <div className="team-card-image-container">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-contain group-hover:scale-105 transition"
                    />
                  </div>

                  <div className="p-5 text-center">
                    <h3 className="text-lg sm:text-xl font-bold group-hover:text-green-600">
                      {member.name}
                    </h3>
                    <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full block my-1">
                      {member.role}
                    </span>
                    <SocialLinks links={member.links} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Closing */}
          <div className="text-center pt-10 border-t border-gray-200 fade-in">
            <p className="text-gray-600 italic text-sm sm:text-lg">
              "At ASTO, we build trust one order at a time."
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutUs
