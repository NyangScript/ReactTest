import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} Links. All Rights Reserved.</p>
        <p className="text-sm mt-1">Powered by React, Tailwind CSS, and Gemini API.</p>
      </div>
    </footer>
  );
};

export default Footer;