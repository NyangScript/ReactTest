import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Website } from '../types';

interface LayoutProps {
  onAddWebsite: () => void;
  outletContext: {
    websites: Website[];
    handleEditWebsite: (website: Website) => void;
    handleDeleteWebsite: (id: string) => void;
  };
}

const Layout: React.FC<LayoutProps> = ({ onAddWebsite, outletContext }) => {
  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col">
      <Header onAddWebsite={onAddWebsite} />
      <main className="container mx-auto px-4 py-8 flex-grow flex flex-col">
        <Outlet context={outletContext} />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;