import React from 'react';

interface MaintainPageLayoutProps {
  backgroundImage: string;
  filter: React.ReactNode;
  list: React.ReactNode;
  commands: React.ReactNode;
}

const MaintainPageLayout: React.FC<MaintainPageLayoutProps> = ({
  backgroundImage,
  filter,
  list,
  commands,
}) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white/85 rounded-lg shadow-lg flex flex-col md:flex-row">
        <div className="flex-grow p-6">
          <div className="mb-6">{filter}</div>
          <div>{list}</div>
        </div>
        <div className="flex flex-row md:flex-col gap-4 p-4 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 sticky bottom-0 md:top-[60px] md:h-screen">
          {commands}
        </div>
      </div>
    </div>
  );
};

export default MaintainPageLayout;