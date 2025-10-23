import React from 'react';
import { Search, BookOpen, Video, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Search size={28} className="text-[#043873]" />,
      title: 'Find Mentors',
      description: 'Search by skill, experience, and rating to find the perfect mentor for your needs.',
    },
    {
      icon: <BookOpen size={28} className="text-[#043873]" />,
      title: 'Book Sessions',
      description: 'Schedule 1:1 sessions instantly based on mentor availability and your convenience.',
    },
    {
      icon: <Video size={28} className="text-[#043873]" />,
      title: 'Chat & Video Call',
      description: 'Seamlessly communicate with mentors and peers directly within the platform.',
    },
    {
      icon: <Users size={28} className="text-[#043873]" />,
      title: 'Join Groups',
      description: 'Collaborate with peers on exciting projects and study various topics together.',
    },
  ];

  return (
    <div className="bg-white font-sans text-gray-800 min-h-screen flex flex-col">
      {/* --- Header --- */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="w-full max-w-screen-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-[#043873] text-white font-bold text-xl rounded-md px-3 py-1">
              DC
            </div>
            <h1 className="text-xl font-bold text-[#043873]">DevConnect</h1>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="/login"
              className="text-gray-600 hover:text-[#043873] font-medium text-sm transition-colors"
            >
              Login
            </a>
            <a
              href="/signup"
              className="bg-[#043873] text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#032f60] transition-all shadow-sm hover:shadow-md"
            >
              Register
            </a>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="bg-gray-50 min-h-[calc(100vh-72px)] flex items-center py-12">
          {/* 100vh minus header height ensures perfect fit */}
          <div className="w-full max-w-screen-2xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left md:w-1/2">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                Connect. Learn. Grow.
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-lg">
                The premier platform for developers to find expert mentors, book sessions, and join exclusive skill-building groups.
              </p>
              <a
                href="/signup"
                className="mt-8 inline-flex items-center justify-center bg-[#043873] text-white font-bold text-base px-8 py-3 rounded-full hover:bg-[#032f60] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started - It's Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>

            <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
              <img
                src="https://www.shutterstock.com/image-vector/vector-illustration-concept-young-technical-600nw-2005097732.jpg"
                alt="Developer community connecting and learning"
                className="max-w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="py-20 bg-white">
          <div className="w-full max-w-screen-2xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Your Path to Developer Excellence
              </h2>
              <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                Everything you need to accelerate your learning and career growth, all in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
                >
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-[#043873] text-white mt-auto">
        <div className="w-full max-w-screen-2xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-sm items-start">
            <div className="flex items-center space-x-2 mb-6 md:mb-0 md:col-span-2">
              <div className="bg-white text-[#043873] font-bold text-xl rounded-md px-3 py-1">
                DC
              </div>
              <h1 className="text-xl font-bold">DevConnect</h1>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Links</h4>
              <ul>
                <li className="mt-2"><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li className="mt-2"><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul>
                <li className="mt-2"><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
                <li className="mt-2"><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul>
                <li className="mt-2"><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                <li className="mt-2"><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-700 pt-4 text-center text-xs text-gray-400">
            <p>&copy; {new Date().getFullYear()} DevConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
