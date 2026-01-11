
import React from 'react';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/common/BackButton';
import Button from '../components/common/Button';

interface Props {
  onBack: () => void;
}

const NotificationsPage: React.FC<Props> = ({ onBack }) => {
  const { user, markAsRead, clearNotifications } = useAuth();

  const notifications = user?.notifications || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-24 min-h-screen bg-white dark:bg-ino-dark transition-colors duration-300 relative">
      <BackButton onClick={onBack} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-admas-blue dark:text-white uppercase tracking-tighter leading-none">
            Message Box
          </h1>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={clearNotifications}
            className="text-[10px] font-black text-gray-400 hover:text-ino-red uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <i className="ph ph-trash"></i> Delete message
          </button>
        )}
      </div>

      <div className="space-y-6">
        {notifications.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800/30 p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100 dark:border-gray-800">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ph ph-envelope-open text-4xl text-gray-300 dark:text-gray-600"></i>
            </div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">No message in this box</p>
          </div>
        ) : (
          notifications.map((msg) => (
            <div 
              key={msg.id}
              onClick={() => !msg.isRead && markAsRead(msg.id)}
              className={`group relative p-8 rounded-[2.5rem] border transition-all duration-300 cursor-pointer overflow-hidden ${
                msg.isRead 
                ? 'bg-gray-50/50 dark:bg-gray-800/20 border-gray-100 dark:border-gray-800' 
                : 'bg-white dark:bg-gray-800 border-ino-yellow shadow-xl dark:shadow-ino-yellow/5'
              }`}
            >
              {!msg.isRead && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-ino-yellow animate-pulse"></div>
              )}
              
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                    msg.isRead ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' : 'bg-ino-yellow/10 text-ino-yellow'
                  }`}>
                    <i className={`ph-fill ${msg.type === 'status' ? 'ph-info' : 'ph-megaphone'} text-xl`}></i>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${msg.isRead ? 'text-gray-400' : 'text-ino-yellow'}`}>
                    {msg.type === 'status' ? 'Update' : 'System Alert'}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full uppercase">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className={`text-sm leading-relaxed font-bold tracking-tight ${msg.isRead ? 'text-gray-500' : 'text-admas-blue dark:text-white'}`}>
                {msg.text}
              </p>

              <div className="mt-6 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">{new Date(msg.timestamp).toLocaleDateString()}</p>
                 {!msg.isRead && (
                   <span className="flex items-center gap-2 text-[8px] font-black text-ino-yellow uppercase tracking-widest">
                     <span className="w-1.5 h-1.5 bg-ino-yellow rounded-full animate-ping"></span> unread
                   </span>
                 )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
