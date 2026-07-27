import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Chatbot from '../Chatbot';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col pt-16 md:pt-[120px]">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default MainLayout;
