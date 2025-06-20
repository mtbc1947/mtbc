
import React, { useState } from 'react';
import { AiFillFilePdf } from 'react-icons/ai';

const PrivacyPage = () => {

  const pdfLinks = [
    {
      title: 'Privacy Policy',
      fileId: '1hRrSMJ3zPXNOz42Z0AxClApyZvZops5q',
    },
    {
      title: 'Safety & Wellbeing',
      fileId: '1ecextJwex0WOQkQ7cHPzNBu9Y6ck4G0z',
    },
    {
      title: 'Customs, By Laws, Info',
      fileId: '1Q9IyInRSfpRW4a2cyW5mioIl-lIk9npL',
    },
  ];

  const [activeTab, setActiveTab] = useState(0);

  const currentFileId = pdfLinks[activeTab].fileId;
  const previewUrl = `https://drive.google.com/file/d/${currentFileId}/preview?usp=sharing`;
  const viewUrl = `https://drive.google.com/file/d/${currentFileId}/view?usp=sharing`;

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">📄 Document Viewer</h1>
      <p className="mb-6 text-base md:text-lg text-center text-gray-700 dark:text-gray-300">
        Use the tabs below to view documents hosted on Google Drive. You can also open each in a new tab.
      </p>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row justify-center mb-4 gap-2">
        {pdfLinks.map((tab, index) => (
          <button
            key={index}
            className={`flex items-center gap-2 py-2 px-4 rounded-full font-medium text-sm sm:text-base transition-colors border ${
              activeTab === index
                ? 'bg-blue-600 text-white border-blue-700'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-700'
            }`}
            onClick={() => setActiveTab(index)}
          >
            <AiFillFilePdf className="text-lg" />
            {tab.title}
          </button>
        ))}
      </div>

      {/* Open in new tab */}
      <div className="mb-4 text-center">
        <a
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow text-sm font-medium transition"
        >
          🔗 Open PDF in a New Tab
        </a>
      </div>

      {/* PDF Viewer */}
      <div className="rounded-lg overflow-hidden shadow border border-gray-300 dark:border-gray-600">
        <div className="relative" style={{ paddingTop: '56.25%' }}>
          <iframe
            title={pdfLinks[activeTab].title}
            src={previewUrl}
            className="absolute top-0 left-0 w-full h-full"
            allow="autoplay"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPage