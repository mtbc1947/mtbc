// PageWithBackground.tsx
import React, { FC } from 'react';
import MainLayout from '../layouts/MainLayout';

interface PageWithBackgroundProps {
  backgroundImage?: string;
  centerContent?: boolean;
  Component: React.ComponentType;
}

const PageWithBackground: FC<PageWithBackgroundProps> = ({ backgroundImage, centerContent = false, Component }) => {
  return (
    <MainLayout backgroundImage={backgroundImage} centerContent={centerContent}>
      <Component />
    </MainLayout>
  );
};

export default PageWithBackground;
