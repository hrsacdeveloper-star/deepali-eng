import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-primary mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">Page Not Found</h2>
      <p className="text-muted-foreground text-pretty max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button size="lg" asChild>
        <Link to="/">Return to Homepage</Link>
      </Button>
    </div>
  );
};

export default NotFound;
