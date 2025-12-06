import React, { useState } from 'react';
import { Guide, AppView } from '../types';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';

interface Props {
  guide: Guide;
  onBack: () => void;
  onComplete: () => void;
}

export const PaymentView: React.FC<Props> = ({ guide, onBack, onComplete }) => {
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  const [date, setDate] = useState('');
  const [travelers, setTravelers] = useState(1);

  const total = guide.pricePerDay * travelers;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          You are all set to explore with {guide.name}. Check your email for details.
        </p>
        <button 
          onClick={onComplete}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700"
        >
          Return to Guides
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen md:min-h-0 md:rounded-2xl md:shadow-lg md:my-8 md:p-6 p-4">
      <button onClick={onBack} className="flex items-center text-gray-500 mb-6 hover:text-gray-900">
        <ArrowLeft size={20} className="mr-2" /> Back
      </button>

      <div className="flex items-center space-x-4 mb-6 border-b border-gray-100 pb-6">
        <img src={guide.imageUrl} alt={guide.name} className="w-16 h-16 rounded-full object-cover" />
        <div>
          <h2 className="font-bold text-xl">Book {guide.name}</h2>
          <p className="text-teal-600 font-medium">${guide.pricePerDay} / person</p>
        </div>
      </div>

      {step === 'details' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <input 
              type="date" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Travelers</label>
            <input 
              type="number" 
              min="1"
              max="10"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              value={travelers}
              onChange={(e) => setTravelers(parseInt(e.target.value))}
            />
          </div>
          <div className="pt-4 border-t border-gray-100 mt-4">
             <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>${total}</span>
             </div>
             <button 
                disabled={!date}
                onClick={() => setStep('payment')}
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-teal-700 transition"
             >
                Continue to Payment
             </button>
          </div>
        </div>
      )}

      {step === 'payment' && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
            <div className="flex justify-between text-sm text-gray-600">
               <span>{guide.name} x {travelers} people</span>
               <span>${total}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
               <span>Date</span>
               <span>{date}</span>
            </div>
          </div>

          <div className="space-y-3">
             <input type="text" placeholder="Card Number" className="w-full p-3 border border-gray-300 rounded-lg" />
             <div className="flex space-x-3">
                <input type="text" placeholder="MM/YY" className="w-1/2 p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="CVC" className="w-1/2 p-3 border border-gray-300 rounded-lg" />
             </div>
          </div>

          <div className="flex items-center text-xs text-gray-500 mt-4 mb-6">
            <ShieldCheck size={16} className="text-green-500 mr-2" />
            Payments are secure and encrypted.
          </div>

          <button 
            onClick={handlePay}
            disabled={processing}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition flex justify-center items-center"
          >
             {processing ? (
               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
             ) : (
               `Pay $${total}`
             )}
          </button>
        </div>
      )}
    </div>
  );
};