import React from 'react';
import { RouteObject } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Industries from './pages/Industries';
import Infrastructure from './pages/Infrastructure';
import Quality from './pages/Quality';
import Certifications from './pages/Certifications';
import TestingProcedures from './pages/TestingProcedures';
import ToolRoom from './pages/ToolRoom';
import GalleryClients from './pages/GalleryClients';
import Downloads from './pages/Downloads';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import FAQs from './pages/FAQs';
import Careers from './pages/Careers';
import ApplyJob from './pages/ApplyJob';
import Contact from './pages/Contact';
import DataPush from './pages/DataPush';
import RFQ from './pages/RFQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Sitemap from './pages/Sitemap';
import NotFound from './pages/NotFound';
import MySubmissions from './pages/MySubmissions';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import CertificatesAdmin from './pages/admin/CertificatesAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';
import PartnersAdmin from './pages/admin/PartnersAdmin';
import ChatbotKnowledgeAdmin from './pages/admin/ChatbotKnowledgeAdmin';
import ChatbotDocumentsAdmin from './pages/admin/ChatbotDocumentsAdmin';

import OrganizationStructureAdmin from './pages/admin/OrganizationStructureAdmin';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:slug', element: <ProductDetails /> },
      { path: 'industries', element: <Industries /> },
      { path: 'infrastructure', element: <Infrastructure /> },
      { path: 'quality', element: <Quality /> },
      { path: 'certifications', element: <Certifications /> },
      { path: 'testing-procedures', element: <TestingProcedures /> },
      { path: 'tool-room', element: <ToolRoom /> },
      { path: 'gallery', element: <GalleryClients /> },
      { path: 'clients', element: <GalleryClients /> },
      { path: 'downloads', element: <Downloads /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogDetails /> },
      { path: 'faqs', element: <FAQs /> },
      { path: 'contact', element: <Contact /> },
      { path: 'request-quote', element: <RFQ /> },
      { path: 'data-push', element: <DataPush /> },
      { path: 'my-submissions', element: <MySubmissions /> },
      { path: 'admin/products', element: <ProductsAdmin /> },
      { path: 'admin/certificates', element: <CertificatesAdmin /> },
      { path: 'admin/settings', element: <SettingsAdmin /> },
      { path: 'admin/partners', element: <PartnersAdmin /> },
      { path: 'admin/org-structure', element: <OrganizationStructureAdmin /> },
      { path: 'admin/chatbot-knowledge', element: <ChatbotKnowledgeAdmin /> },
      { path: 'admin/chatbot-documents', element: <ChatbotDocumentsAdmin /> },
      { path: 'careers', element: <Careers /> },
      { path: 'apply-job', element: <ApplyJob /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'terms', element: <Terms /> },
      { path: 'sitemap', element: <Sitemap /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
