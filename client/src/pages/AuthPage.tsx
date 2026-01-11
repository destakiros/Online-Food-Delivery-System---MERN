
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/common/BackButton';
import Button from '../components/common/Button';
import { useToast } from '../context/ToastContext';

interface Props {
  onBack: () => void;
}

const AuthPage: React.FC<Props> = ({ onBack }) => {
  const { login, signup } = useAuth();
  const { showToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isStrongPassword = (p: string) => {
    return p.length >= 6; // Simple check for simple words requirement
  };

  const isValidPhone = (p: string) => {
    return /^09\d{8}$/.test(p);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    if (isLogin) {
      const response = await login(email, pass);
      if (response.success) {
        showToast("Welcome!", "success");
        onBack();
      } else {
        setErrorMsg(response.message || "Invalid login.");
        showToast("Login failed", "error");
      }
    } else {
      if (!isStrongPassword(pass)) {
        setErrorMsg("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }
      if (!isValidPhone(phone)) {
        setErrorMsg("Phone must be 10 digits and start with 09.");
        setLoading(false);
        return;
      }
      const success = await signup({ name, email, password: pass, phone });
      if (success) {
        showToast("Account created!", "success");
        onBack();
      } else {
        setErrorMsg("Email already used.");
        showToast("Signup failed", "error");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative bg-gray-50 dark:bg-ino-dark transition-colors duration-300">
      <BackButton onClick={onBack} />
      
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
            {isLogin ? 'Login' : 'Signup'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center border border-red-100">
              {errorMsg}
            </div>
          )}

          {!isLogin && (
            <>
              <input 
                type="text" placeholder="Name" 
                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 outline-none text-sm font-bold text-black"
                required value={name} onChange={e => setName(e.target.value)}
              />
              <input 
                type="text" placeholder="Phone (e.g. 0912345678)" 
                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 outline-none text-sm font-bold text-black"
                required value={phone} onChange={e => setPhone(e.target.value)}
              />
            </>
          )}

          <input 
            type="email" placeholder="Email" 
            className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 outline-none text-sm font-bold text-black"
            required value={email} onChange={e => setEmail(e.target.value)}
          />

          <input 
            type="password" placeholder="Password" 
            className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 outline-none text-sm font-bold text-black"
            required value={pass} onChange={e => setPass(e.target.value)}
          />
          
          <Button type="submit" loading={loading} className="w-full py-4 rounded-2xl text-xs uppercase font-black tracking-widest bg-ino-red text-white">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <button 
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(null); }}
            className="text-xs font-black text-ino-red uppercase tracking-widest hover:underline"
          >
            {isLogin ? "Need an account? Signup" : "Have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
