import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-1 sm:pt-2">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
