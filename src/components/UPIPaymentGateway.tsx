
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UPIPaymentGatewayProps {
  amount?: number;
  payeeName?: string;
  upiId?: string;
  description?: string;
}

const UPIPaymentGateway: React.FC<UPIPaymentGatewayProps> = ({
  amount = 999,
  payeeName = "Prompt Guru",
  upiId = "adnanmuhammad4393@okicici",
  description = "Prompt Guru Premium Access"
}) => {
  const handleUPIPayment = () => {
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}`;
    window.location.href = upiUrl;
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-5 bg-white border border-gray-200 shadow-lg rounded-xl">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Pay with UPI</h3>
          
          {/* QR Code Section */}
          <div className="mb-5">
            <div className="w-48 h-48 mx-auto mb-3 border-2 border-gray-100 rounded-lg bg-white flex items-center justify-center">
              <img 
                src="data:image/png;base64,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"
                alt="UPI Payment QR Code" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-gray-600 font-medium">Scan with any UPI app</p>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-left">
            <div className="space-y-1">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">UPI ID:</span> {upiId}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Payee:</span> {payeeName}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Amount:</span> ₹{amount}
              </p>
            </div>
          </div>

          {/* Payment Button */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-600 mb-3">Or click to pay directly</p>
            <Button
              onClick={handleUPIPayment}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              💳 Pay ₹{amount} via UPI
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            Supports PhonePe, Google Pay, Paytm, BHIM & all UPI apps<br />
            Secure payment powered by UPI
          </p>
        </div>
      </Card>
    </div>
  );
};

export default UPIPaymentGateway;
