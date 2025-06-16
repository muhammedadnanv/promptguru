
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UPIPaymentGateway from '@/components/UPIPaymentGateway';
import Header from '@/components/Header';

const Payment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Header />
          <Link to="/">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Payment Section */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Complete Your Payment
            </h1>
            <p className="text-lg text-gray-300">
              Unlock premium features with our secure UPI payment gateway
            </p>
          </div>

          {/* UPI Payment Gateway */}
          <UPIPaymentGateway 
            amount={999}
            payeeName="Prompt Guru"
            upiId="adnanmuhammad4393@okicici"
            description="Prompt Guru Premium Access"
          />

          {/* Features After Payment */}
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">
              What you'll get after payment:
            </h3>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <ul className="text-gray-300 space-y-2 text-left">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Unlimited prompt transformations
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Access to all AI models via OpenRouter
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Advanced prompt frameworks
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Voice to prompt conversion
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Custom system instructions
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Priority customer support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
