import React from 'react';
import { 
  X, 
  Bell, 
  MessageSquare, 
  ArrowRight, 
  Sparkles, 
  Leaf,
  Scale
} from 'lucide-react';
import { LanguageCode, AppNotification } from '../types';
import { translations } from '../translations';

interface NotificationDrawerProps {
  currentLang: LanguageCode;
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onSelectNotification: (notification: AppNotification) => void;
  onMarkAllRead: () => void;
  isDarkMode?: boolean;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  currentLang,
  isOpen,
  onClose,
  notifications,
  onSelectNotification,
  onMarkAllRead,
  isDarkMode = false,
}) => {
  const t = translations[currentLang] || translations.en;

  if (!isOpen) return null;

  return (
    <div 
      id="notification-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div 
        id="notification-drawer-container"
        className={`w-full max-w-md h-full flex flex-col border-l-2 shadow-2xl animate-in slide-in-from-right duration-200 transition-colors ${
          isDarkMode 
            ? 'bg-[#101e14] border-[#223b28] text-white shadow-emerald-950/40' 
            : 'bg-[#faf7f0] border-[#ded5c2] text-[#1b271b]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-[#14261a] border-[#223b28]' : 'bg-[#f3ecde] border-[#ded5c2]'
        }`}>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-500" />
            <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-[#1b271b]'}`}>
              {t.notifications}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className={`text-xs font-semibold underline cursor-pointer ${
                isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-800 hover:text-emerald-950'
              }`}
            >
              {t.markAllRead || 'Mark all read'}
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                isDarkMode ? 'hover:bg-[#1d3825] text-white' : 'hover:bg-[#e4dccb] text-[#5c5443]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of Notifications */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className={`text-center py-16 text-xs ${isDarkMode ? 'text-[#8ea493]' : 'text-[#7d7563]'}`}>
              {t.noNotifications || 'No new notifications right now.'}
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                id={`notif-card-${notif.id}`}
                onClick={() => onSelectNotification(notif)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  notif.isRead
                    ? isDarkMode
                      ? 'bg-[#142419] border-[#203926] text-[#8ea493] opacity-80'
                      : 'bg-white border-[#ded5c2] text-[#4f4838] opacity-80'
                    : isDarkMode
                      ? 'bg-[#183120] border-emerald-600/70 text-white shadow-xs'
                      : 'bg-emerald-50/80 border-emerald-300 text-[#1b281b] shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {notif.type === 'chat' && <MessageSquare className="w-4 h-4 text-emerald-500" />}
                    {notif.type === 'barter' && <Scale className="w-4 h-4 text-amber-500" />}
                    {notif.type === 'stubble_saved' && <Leaf className="w-4 h-4 text-emerald-500" />}
                    {notif.type === 'interest' && <Sparkles className="w-4 h-4 text-amber-400" />}
                    
                    <span className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-[#1b281b]'}`}>
                      {notif.title}
                    </span>
                  </div>

                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
                  )}
                </div>

                <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? 'text-[#b2c8b7]' : 'text-[#5a5241]'}`}>
                  {notif.message}
                </p>

                <div className={`flex items-center justify-between pt-2.5 mt-2 border-t text-[11px] ${
                  isDarkMode ? 'border-[#223d29] text-[#7d9382]' : 'border-black/5 text-[#7a7260]'
                }`}>
                  <span>{notif.timestamp}</span>
                  <span className={`font-bold flex items-center gap-1 ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-800'
                  }`}>
                    <span>{t.chatNow || 'Chat Now'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
