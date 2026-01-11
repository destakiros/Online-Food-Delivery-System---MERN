
import React from 'react';
import BackButton from '../components/common/BackButton';

interface Props {
  onBack: () => void;
}

const AboutPage: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 relative">
      <BackButton onClick={onBack} />
      
      <div className="pl-16 md:pl-0">
        <h1 className="text-4xl font-black text-admas-blue mb-8">About Our Mission</h1>
        <div className="prose prose-lg max-w-none text-gray-600">
          <p>
            In-N-Out Delivery is built on a single promise: <strong>Quality dining without the wait.</strong>
            We partner with the best kitchens in the city to bring gourmet experiences directly to your doorstep.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Core Values</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>Speed:</strong> Our logistics network is optimized for the fastest possible delivery times.</li>
            <li><strong>Quality:</strong> We only partner with merchants who maintain the highest food standards.</li>
            <li><strong>Innovation:</strong> Utilizing advanced analytics to optimize routes and ensure peak performance.</li>
            <li><strong>Security:</strong> Secure payment processing and verified delivery tracking for every order.</li>
          </ul>
          <div className="bg-gray-100 p-8 rounded-2xl mt-12 border-l-4 border-ino-red">
            <p className="font-bold text-admas-blue italic">
              "Redefining urban logistics through technology and a commitment to service excellence."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
