import React from 'react';
import ArticleGenerator from '@/components/ArticleGenerator';

const ArticleGeneratorPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Article Generator</h1>
      <ArticleGenerator />
    </div>
  );
};

export default ArticleGeneratorPage;
