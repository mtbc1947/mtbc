// In a new file, e.g., src/components/LayoutWrapper.tsx
import React from 'react';
import MainLayout from '../layouts/MainLayout';

interface LayoutWrapperProps {
  backgroundImage?: string;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ backgroundImage }) => {
  return <MainLayout backgroundImage={backgroundImage} />;
};

export default LayoutWrapper;