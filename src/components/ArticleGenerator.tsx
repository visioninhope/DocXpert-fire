import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface Subheading {
  text: string;
  accepted: boolean;
  custom: string;
}

const ArticleGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [subheadings, setSubheadings] = useState<Subheading[]>([]);
  const [article, setArticle] = useState('');
  const [loadingSubheadings, setLoadingSubheadings] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(false);

  const generateSubheadingsMutation = api.article.generateSubheadings.useMutation();
  const generateArticleMutation = api.article.generateArticle.useMutation();

  const handleGenerateSubheadings = async () => {
    setLoadingSubheadings(true);
    try {
      const result = await generateSubheadingsMutation.mutateAsync({ topic });
      setSubheadings(result.map(text => ({ text, accepted: true, custom: '' })));
    } finally {
      setLoadingSubheadings(false);
    }
  };

  const handleGenerateArticle = async () => {
    setLoadingArticle(true);
    try {
      const finalSubheadings = subheadings
        .filter(sh => sh.accepted)
        .map(sh => sh.custom || sh.text);
      const result = await generateArticleMutation.mutateAsync({ topic, subheadings: finalSubheadings });
      setArticle(result);
    } finally {
      setLoadingArticle(false);
    }
  };

  const handleSubheadingToggle = (index: number) => {
    setSubheadings(prev => prev.map((sh, i) => 
      i === index ? {...sh, accepted: !sh.accepted} : sh
    ));
  };

  const handleSubheadingCustomize = (index: number, value: string) => {
    setSubheadings(prev => prev.map((sh, i) => 
      i === index ? {...sh, custom: value} : sh
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Article Generator</h1>
      <Input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter your topic"
        className="mb-4"
      />
      <Button onClick={handleGenerateSubheadings} className="mb-4" disabled={loadingSubheadings}>
        {loadingSubheadings ? 'Loading...' : 'Generate Subheadings'}
      </Button>
      {subheadings.length > 0 && (
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-2">Subheadings:</h2>
          <ul className="list-disc pl-5">
            {subheadings.map((subheading, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <input
                  type="checkbox"
                  checked={subheading.accepted}
                  onChange={() => handleSubheadingToggle(index)}
                />
                <input
                  type="text"
                  value={subheading.custom || subheading.text}
                  onChange={(e) => handleSubheadingCustomize(index, e.target.value)}
                  className="ml-2"
                />
              </motion.li>
            ))}
          </ul>
          <Button onClick={handleGenerateArticle} className="mt-4" disabled={loadingArticle}>
            {loadingArticle ? 'Loading...' : 'Generate Full Article'}
          </Button>
        </motion.div>
      )}
      {article && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-2">Generated Article:</h2>
          <div className="whitespace-pre-wrap">{article}</div>
        </motion.div>
      )}
    </div>
  );
};

export default ArticleGenerator;
