
import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';

interface Props {
  onNavigate: (page: any) => void;
  onBack: () => void;
}

const PaymentPage: React.FC<Props> = ({ onNavigate, onBack }) => {
  const { cart, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [bankName, setBankName] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [receiptBase64, setReceiptBase64] = useState<string>('');
  const [extraMessage, setExtraMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryFee = 50; 
  const total = subtotal + deliveryFee;

  const bankAccounts: Record<string, string> = {
    'CBE': '1000-1234-5678-9',
    'Dashen Bank': '123-456-789-012',
    'Awash Bank': '987-654-321-098',
    'Abay Bank': '456-789-123-456',
    'Telebirr': '0911-22-33-44 (Merchant ID)'
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptBase64(reader.result as string);
        showToast('Receipt ready', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = async () => {
    if (!bankName || !destination || !receiptBase64) {
      showToast('Please fill all info and upload receipt', 'error');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        orderItems: cart.map(item => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          config: {
            selectedSize: item.selectedSize,
            selectedSauce: item.selectedSauce,
            notes: item.notes,
            modifiers: item.modifiers
          }
        })),
        totalPrice: total,
        deliveryFee: deliveryFee,
        destination: destination,
        paymentMethod: bankName,
        bankName: bankName,
        accountNumber: bankAccounts[bankName],
        paymentReceipt: receiptBase64,
        extraMessage: extraMessage,
        customerName: user?.name || 'Guest',
        customerEmail: user?.email || 'N/A',
        customerPhone: user?.phone || 'N/A'
      };

      await placeOrder(orderPayload);
      clearCart();
      showToast('Payment sent! We are checking it.', 'success');
      onNavigate('tracker');
    } catch (err) {
      showToast('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 min-h-screen">
      <BackButton onClick={onBack} />
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black uppercase text-gray-900 dark:text-white">Payment</h1>
        <p className="text-gray-500 text-xs font-bold uppercase mt-2">Pay and upload receipt to finish</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700">
            <p className="text-[10px] font-black uppercase text-ino-red mb-4">1. Choose Bank</p>
            <select 
              value={bankName} 
              onChange={(e) => setBankName(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-gray-900 border dark:border-gray-700 font-bold text-sm"
            >
              <option value="">Select a Bank</option>
              {Object.keys(bankAccounts).map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            {bankName && (
              <div className="mt-4 p-4 bg-ino-yellow/10 rounded-xl border border-ino-yellow/20">
                <p className="text-[9px] font-black text-ino-yellow uppercase mb-1">Pay to this account:</p>
                <p className="text-lg font-mono font-black dark:text-white">{bankAccounts[bankName]}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700">
            <p className="text-[10px] font-black uppercase text-ino-red mb-4">2. Where to deliver?</p>
            <textarea 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="House number, building, or street name..."
              className="w-full p-4 rounded-xl bg-white dark:bg-gray-900 border dark:border-gray-700 text-sm h-24"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700">
            <p className="text-[10px] font-black uppercase text-ino-red mb-4">3. Upload Receipt Photo</p>
            <input type="file" onChange={handleFileChange} className="text-xs file:bg-ino-red file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:mr-4 file:font-black" />
            {receiptBase64 && <p className="text-[10px] text-green-500 font-black mt-2 uppercase">File attached ✓</p>}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700">
            <p className="text-[10px] font-black uppercase text-ino-red mb-4">4. Any Message? (Optional)</p>
            <input 
              value={extraMessage}
              onChange={(e) => setExtraMessage(e.target.value)}
              placeholder="Order notes or instructions..."
              className="w-full p-4 rounded-xl bg-white dark:bg-gray-900 border dark:border-gray-700 text-sm"
            />
          </div>
        </div>

        <div className="bg-ino-dark text-white p-8 rounded-3xl h-fit sticky top-24 shadow-2xl">
          <h2 className="text-xl font-black mb-6 text-ino-yellow uppercase">Summary</h2>
          <div className="space-y-3 mb-8 pb-8 border-b border-white/10">
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Items Total</span>
              <span className="text-white">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Delivery Fee</span>
              <span className="text-white">{formatPrice(deliveryFee)}</span>
            </div>
          </div>
          <div className="flex justify-between items-end mb-10">
            <span className="text-xs font-black text-gray-500">GRAND TOTAL</span>
            <span className="text-4xl font-black text-ino-yellow">{formatPrice(total)}</span>
          </div>
          <button 
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-ino-red py-4 rounded-2xl font-black uppercase text-xs hover:bg-red-700 transition-all shadow-lg"
          >
            {loading ? 'Sending...' : 'Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
