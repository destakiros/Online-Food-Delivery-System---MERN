
import React from 'react';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';

interface Props {
  onBack: () => void;
}

const SupportPage: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 relative">
      <BackButton onClick={onBack} />
      
      <div className="text-center mb-12 pl-16 md:pl-0">
        <h1 className="text-4xl font-black text-admas-blue mb-4 uppercase tracking-tight">Help & Support</h1>
        <p className="text-gray-500">How can we assist you with your order today?</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Common Questions</h2>
        <ul className="space-y-4">
          <li className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
            <h4 className="font-bold">How long does delivery take?</h4>
            <p className="text-sm text-gray-500">Usually between 20 to 45 minutes depending on traffic.</p>
          </li>
          <li className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
            <h4 className="font-bold">Can I cancel my order?</h4>
            <p className="text-sm text-gray-500">You can cancel up to 5 minutes after placing it.</p>
          </li>
        </ul>
      </div>

      <div className="mt-12 bg-admas-blue text-white p-8 rounded-3xl text-center">
        <h3 className="text-xl font-bold mb-4">Need immediate assistance?</h3>
        <p className="mb-6 opacity-80 font-medium">Our logistics team is available 24/7 during operating hours.</p>
        <Button variant="primary" className="mx-auto uppercase tracking-widest text-[10px]">
          Contact Dispatch
        </Button>
      </div>
    </div>
  );
};

export default SupportPage;
