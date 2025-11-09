import React from 'react'

const AboutUs = () => {
  return (
    <div className="bg-black text-white min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Title Section */}
        <h1 className="text-4xl font-bold text-green-400 text-center mb-4">
          About <span className="text-white">ASTO</span>
        </h1>
        <p className="text-gray-300 text-center max-w-3xl mx-auto text-lg leading-relaxed">
          Welcome to <span className="text-green-400 font-semibold">ASTO</span> — 
          your trusted online store for quality tech products and accessories. 
          We’re passionate about bringing you the latest and most reliable items 
          at prices you’ll love.
        </p>

        {/* Mission Section */}
        <div className="bg-green-400/10 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-green-400 mb-3">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed">
            Our goal is simple — to make online shopping easy, fast, and enjoyable. 
            We aim to deliver high-quality products, friendly service, and secure 
            transactions so you can shop with confidence every time.
          </p>
        </div>

        {/* What We Offer */}
        <div>
          <h2 className="text-2xl font-semibold text-green-400 mb-3">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Premium tech accessories like keyboards, headphones, and earbuds</li>
            <li>Comfortable and stylish chairs and bags</li>
            <li>Fast and safe delivery across Cambodia</li>
            <li>Dedicated customer support that truly cares</li>
          </ul>
        </div>

        {/* Team Section */}
        <div className="bg-green-400/10 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-green-400 mb-3">Meet Our Team</h2>
          <p className="text-gray-300 mb-4">
            Behind ASTO is a small but passionate team working together to bring 
            the best shopping experience to our customers.
          </p>
          <ul className="space-y-2 text-gray-300">
            <li><span className="text-green-400 font-semibold">Khen chandarapisey</span> – Developer & Designer</li>
            <li><span className="text-green-400 font-semibold">Ong Endy</span> - Cyber security</li>
            <li><span className="text-green-400 font-semibold">Hak Tit Panha</span> – Marketing & Customer Support</li>
          </ul>
        </div>

        {/* Closing Section */}
        <div className="text-center pt-6">
          <p className="text-gray-400 italic">
            “At ASTO, we don’t just sell products — we build trust, one order at a time.”
          </p>
        </div>

      </div>
    </div>
  )
}

export default AboutUs
