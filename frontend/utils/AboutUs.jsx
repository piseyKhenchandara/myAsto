import React, { useEffect } from 'react'
import pisey from '../src/assets/ceo/Pisey.png'
import endy from '../src/assets/ceo/endyong.png'
import panha from '../src/assets/ceo/panhaPlaceholder.png'
import facebookIcon from '../src/assets/logoes/facebook_logo.png'
import instagramIcon from '../src/assets/logoes/ig_logo.png'
import telegramIcon from '../src/assets/logoes/telegram_logo.png'
import githubIcon from '../src/assets/logoes/github_logo.png'

const SocialLinks = ({ links }) => (
  <div className="flex items-center gap-2 mt-3">
    {links.github && (
      <a href={links.github} target="_blank" rel="noopener noreferrer" 
         className="bg-gray-900 hover:bg-gray-700 p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 shadow-sm hover:shadow-md">
        <img src={githubIcon} alt="GitHub" className="h-3.5 w-3.5 object-contain" />
      </a>
    )}
    {links.facebook && (
      <a href={links.facebook} target="_blank" rel="noopener noreferrer"
         className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 shadow-sm hover:shadow-md">
        <img src={facebookIcon} alt="Facebook" className="h-3.5 w-3.5 object-contain" />
      </a>
    )}
    {links.instagram && (
      <a href={links.instagram} target="_blank" rel="noopener noreferrer"
         className="bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 shadow-sm hover:shadow-md">
        <img src={instagramIcon} alt="Instagram" className="h-3.5 w-3.5 object-contain" />
      </a>
    )}
    {links.telegram && (
      <a href={links.telegram} target="_blank" rel="noopener noreferrer"
         className="bg-sky-500 hover:bg-sky-400 p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 shadow-sm hover:shadow-md">
        <img src={telegramIcon} alt="Telegram" className="h-3.5 w-3.5 object-contain" />
      </a>
    )}
  </div>
);

const teamMembers = [
  {
    name: 'Khen Chandarapisey',
    role: 'Backend-Frontend developer',
    description: 'Developer & Designer',
    image: pisey,
    links: {
      github: 'https://github.com/SeYz-GHB',
      facebook: 'https://www.facebook.com/pisey.khenchandara',
      telegram: 'https://t.me/Reajasey',
    }
  },
  {
    name: 'Ong Endy',
    role: 'Frontend developer',
    description: 'Developer',
    image: endy,
    links: {
      github: 'https://github.com/Endy0611',
      facebook: 'https://www.facebook.com/ong.endy',
      telegram: 'https://t.me/endyong96',
    }
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
    }
  }
];

const AboutUs = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .fade-in {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .fade-in.show {
          opacity: 1;
          transform: translateY(0);
        }

        .fade-left {
          opacity: 0;
          transform: translateX(-50px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .fade-left.show {
          opacity: 1;
          transform: translateX(0);
        }

        .fade-right {
          opacity: 0;
          transform: translateX(50px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .fade-right.show {
          opacity: 1;
          transform: translateX(0);
        }

        .scale-in {
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .scale-in.show {
          opacity: 1;
          transform: scale(1);
        }

        .gradient-text {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .team-card {
          height: 500px;
        }

        .team-card-image-container {
          height: 300px;
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f9fafb;
        }

        .team-card-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      `}</style>

      <div className="bg-gradient-to-b from-white via-gray-50 to-white min-h-screen py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* Title Section */}
          <div className="text-center space-y-4 pt-8 fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
              About <span className="gradient-text">ASTO</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Your trusted online store for quality tech products and accessories. 
              We bring you the latest items at prices you'll love.
            </p>
          </div>

          {/* Mission & Offer Grid */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-gray-100 hover:border-green-500 transition-all duration-300 hover:shadow-2xl fade-left fade-in">
              <div className="mb-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Our Mission</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
              </div>
              <p className="text-gray-600 leading-relaxed text-base">
                To make online shopping easy, fast, and enjoyable. We deliver high-quality products, 
                friendly service, and secure transactions.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-gray-100 hover:border-green-500 transition-all duration-300 hover:shadow-2xl fade-right fade-in">
              <div className="mb-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">What We Offer</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
              </div>
              <ul className="space-y-3 text-gray-600 text-base">
                <li className="flex items-start gap-3 transition-all duration-200 hover:translate-x-1">
                  <span className="text-green-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0"></span>
                  <span>Premium tech accessories</span>
                </li>
                <li className="flex items-start gap-3 transition-all duration-200 hover:translate-x-1">
                  <span className="text-green-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0"></span>
                  <span>Comfortable chairs and bags</span>
                </li>
                <li className="flex items-start gap-3 transition-all duration-200 hover:translate-x-1">
                  <span className="text-green-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0"></span>
                  <span>Fast delivery across Cambodia</span>
                </li>
                <li className="flex items-start gap-3 transition-all duration-200 hover:translate-x-1">
                  <span className="text-green-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0"></span>
                  <span>Dedicated customer support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Team Section */}
          <div className="space-y-10">
            <div className="text-center space-y-3 fade-in">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Meet Our Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-base">
                Passionate developers working together to bring you the best shopping experience.
              </p>
            </div>

            {/* Team Members */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-6 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <div key={index} className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-green-500 transition-all duration-300 shadow-sm hover:shadow-lg scale-in fade-in w-full sm:w-80 team-card flex flex-col">
                  <div className="team-card-image-container">
                    <img 
                      src={member.image}
                      alt={member.name}
                      className="team-card-image group-hover:scale-105 transition-transform duration-700 "
                    />
                  </div>
                  <div className="p-4 flex flex-col items-center text-center flex-grow justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors duration-300">
                        {member.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-full text-xs font-semibold shadow-sm mb-1">
                        {member.role}
                      </span>
                      <p className="text-gray-500 text-xs mb-2">{member.description}</p>
                    </div>
                    <SocialLinks links={member.links} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Closing Section */}
          <div className="text-center pt-12 border-t border-gray-200 max-w-3xl mx-auto fade-in">
            <p className="text-gray-600 text-base sm:text-lg italic font-light">
              <span className="inline-block hover:scale-105 transition-transform duration-300">
                "At ASTO, we build trust one order at a time."
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutUs