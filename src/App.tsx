import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { SellResourceForm } from './components/SellResourceForm';
import { BuyMarketplace } from './components/BuyMarketplace';
import { ListingDetailModal } from './components/ListingDetailModal';
import { ChatModal } from './components/ChatModal';
import { BarterCalculator } from './components/BarterCalculator';
import { FarmerDashboard } from './components/FarmerDashboard';
import { LoginPage, DEFAULT_FARMER_PROFILES } from './components/LoginPage';
import { NotificationDrawer } from './components/NotificationDrawer';
import { LanguageCode, ResourceListing, AppNotification, FarmerUser } from './types';
import { INITIAL_LISTINGS, INITIAL_NOTIFICATIONS } from './mockData';
import { translations } from './translations';
import { ShieldCheck, Leaf } from 'lucide-react';

export function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [activeView, setActiveView] = useState<'home' | 'sell' | 'buy' | 'barter-calc' | 'dashboard' | 'chat' | 'login'>('home');
  
  // Logged-in Farmer User state (persisted locally)
  const [currentUser, setCurrentUser] = useState<FarmerUser | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('khetsaathi_farmer_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {
          // ignore parse error
        }
      }
    }
    return DEFAULT_FARMER_PROFILES[0]; // Default to Ramesh Kumar
  });

  const handleLogin = (user: FarmerUser) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('khetsaathi_farmer_user', JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('khetsaathi_farmer_user');
    }
  };
  
  // Dark / Light Theme State - default to true (Dark Theme matching the design)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('khetsaathi_theme');
      if (saved) return saved === 'dark';
    }
    return true; // Default dark aesthetic
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('khetsaathi_theme', next ? 'dark' : 'light');
      }
      return next;
    });
  };

  // Sync html tag class for potential dark variant styling
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Listings State
  const [listings, setListings] = useState<ResourceListing[]>(INITIAL_LISTINGS);
  
  // Modals & Selected Objects
  const [selectedListingForDetail, setSelectedListingForDetail] = useState<ResourceListing | null>(null);
  const [selectedListingForChat, setSelectedListingForChat] = useState<ResourceListing | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Barter Calc state
  const [barterOffered, setBarterOffered] = useState<string | undefined>();
  const [barterNeeded, setBarterNeeded] = useState<string | undefined>();

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Unread notification count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Load listings from backend API on mount
  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setListings(data.data);
        }
      })
      .catch(err => {
        console.warn('Using local seeded listings:', err);
      });
  }, []);

  // Handler to add a new listing
  const handleAddNewListing = (newListingData: Partial<ResourceListing>) => {
    const fullListing: ResourceListing = {
      id: `list-${Date.now()}`,
      title: newListingData.title || 'Agricultural Resource',
      title_hi: newListingData.title_hi,
      title_original: newListingData.title_original,
      originalLanguage: newListingData.originalLanguage || currentLang,
      category: newListingData.category || 'machinery',
      subCategory: newListingData.subCategory || 'General',
      description: newListingData.description || '',
      description_hi: newListingData.description_hi,
      description_original: newListingData.description_original,
      images: newListingData.images && newListingData.images.length > 0 ? newListingData.images : ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80'],
      sellerId: newListingData.sellerId || 'current-user',
      sellerName: newListingData.sellerName || 'You (Kisan Member)',
      sellerBadge: newListingData.sellerBadge || 'Verified Kisan',
      sellerTrustScore: newListingData.sellerTrustScore || 4.9,
      totalSwaps: newListingData.totalSwaps || 1,
      location: newListingData.location || {
        village: 'Kisanpur',
        district: 'Patiala',
        state: 'Punjab',
        pincode: '147001',
        lat: 30.3398,
        lng: 76.3869
      },
      listingType: newListingData.listingType || 'barter',
      price: newListingData.price || 1200,
      priceUnit: newListingData.priceUnit || 'per day',
      barterExchangeNeeded: newListingData.barterExchangeNeeded || 'Open to fair swap',
      barterFairScore: newListingData.barterFairScore || 92,
      condition: newListingData.condition || 'Excellent',
      specs: newListingData.specs || {},
      stubblePreventedTons: newListingData.stubblePreventedTons,
      co2PreventedTons: newListingData.co2PreventedTons,
      createdAt: 'Just now',
      isAvailable: true,
      source: newListingData.source || 'web',
    };

    setListings(prev => [fullListing, ...prev]);

    // Send to backend
    fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullListing)
    }).catch(() => {});

    // Create an automated smart notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      listingId: fullListing.id,
      title: 'Listing Published Successfully!',
      message: `Your resource "${fullListing.title}" is now live and broadcasted to nearby farmers in ${fullListing.location.village}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'interest'
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Navigate to Buy/Marketplace so user sees their new post
    setActiveView('buy');
  };

  // Delete a listing from user dashboard and marketplace
  const handleDeleteListing = (listingId: string) => {
    const target = listings.find(l => l.id === listingId);
    setListings(prev => prev.filter(l => l.id !== listingId));
    
    // Also remove from backend
    fetch(`/api/listings/${listingId}`, {
      method: 'DELETE'
    }).catch(() => {});

    // Notification
    const delNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Listing Removed',
      message: `"${target?.title || 'Resource'}" has been successfully deleted from your active broadcast.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'system'
    };
    setNotifications(prev => [delNotif, ...prev]);
  };

  // Clear all posts (if user wants to clean the slate)
  const handleClearAllPosts = () => {
    setListings([]);
    const delNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'All Listings Cleared',
      message: 'All active listings have been cleared. You can post new resources anytime!',
      timestamp: 'Just now',
      isRead: false,
      type: 'system'
    };
    setNotifications(prev => [delNotif, ...prev]);
  };

  // Open Chat for a listing
  const handleOpenChat = (listing: ResourceListing) => {
    setSelectedListingForChat(listing);
  };

  // Open Barter Calc with prefilled terms
  const handleOpenBarterCalc = (offered: string, needed: string) => {
    setBarterOffered(offered);
    setBarterNeeded(needed);
    setSelectedListingForDetail(null);
    setActiveView('barter-calc');
  };

  // Select a notification
  const handleSelectNotification = (notif: AppNotification) => {
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    setIsNotificationDrawerOpen(false);

    if (notif.listingId) {
      const targetListing = listings.find(l => l.id === notif.listingId);
      if (targetListing) {
        setSelectedListingForChat(targetListing);
      }
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // User's own listings
  const myListings = listings.filter(l => l.sellerId === 'current-user' || l.sellerName.includes('You'));

  const t = translations[currentLang] || translations.en;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 selection:bg-emerald-500 selection:text-black ${
      isDarkMode ? 'bg-[#09120b] text-[#f3f4f6]' : 'bg-[#fcfbf7] text-[#1c241c]'
    }`}>
      
      {/* Top Navbar */}
      <Navbar
        currentLang={currentLang}
        currentUser={currentUser}
        onLangChange={setCurrentLang}
        activeView={activeView}
        onNavigate={setActiveView}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main App Content View Switcher */}
      <main className="flex-1">
        {activeView === 'home' && (
          <LandingHero
            currentLang={currentLang}
            onNavigate={setActiveView}
            recentListings={listings}
            onSelectListing={(listing) => setSelectedListingForDetail(listing)}
            isDarkMode={isDarkMode}
          />
        )}

        {activeView === 'login' && (
          <LoginPage
            currentLang={currentLang}
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onBack={() => setActiveView('home')}
            isDarkMode={isDarkMode}
          />
        )}

        {activeView === 'sell' && (
          <SellResourceForm
            currentLang={currentLang}
            currentUser={currentUser}
            onBack={() => setActiveView('home')}
            onSubmitListing={handleAddNewListing}
            isDarkMode={isDarkMode}
          />
        )}

        {activeView === 'buy' && (
          <BuyMarketplace
            currentLang={currentLang}
            listings={listings}
            onSelectListing={(listing) => setSelectedListingForDetail(listing)}
            onBack={() => setActiveView('home')}
            onNavigateToSell={() => setActiveView('sell')}
            isDarkMode={isDarkMode}
          />
        )}

        {activeView === 'barter-calc' && (
          <BarterCalculator
            currentLang={currentLang}
            initialOffered={barterOffered}
            initialNeeded={barterNeeded}
            onBack={() => setActiveView('home')}
            onNavigateToBuy={() => setActiveView('buy')}
            isDarkMode={isDarkMode}
          />
        )}

        {activeView === 'dashboard' && (
          <FarmerDashboard
            currentLang={currentLang}
            currentUser={currentUser}
            myListings={myListings.length > 0 ? myListings : listings}
            onBack={() => setActiveView('home')}
            onNavigateToSell={() => setActiveView('sell')}
            onSelectListing={(listing) => setSelectedListingForDetail(listing)}
            onOpenChat={(listing) => setSelectedListingForChat(listing)}
            onDeleteListing={handleDeleteListing}
            onClearAllPosts={handleClearAllPosts}
            onOpenLogin={() => setActiveView('login')}
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-8 px-4 sm:px-6 lg:px-8 mt-auto transition-colors ${
        isDarkMode 
          ? 'bg-[#0b150f] border-[#1b2b1e] text-[#869b8c]' 
          : 'bg-[#f2ece0] border-[#e2d8c3] text-[#6e6756]'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#123824] to-[#081b10] border border-amber-500/40 text-white flex items-center justify-center font-bold text-xs">
              🌾
            </div>
            <span className="font-bold text-sm">
              <span className={isDarkMode ? 'text-amber-400 font-black' : 'text-amber-600 font-black'}>
                आ
              </span>
              <span className={isDarkMode ? 'text-emerald-400 font-extrabold' : 'text-[#1e4d36] font-extrabold'}>
                Daan
              </span>
            </span>
            <span>— {t.tagline || 'Rural Machinery & Residue Barter Network'}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-500 font-semibold">
              <Leaf className="w-3.5 h-3.5" />
              {t.stubbleReductionPledge || '100% Stubble Burning Reduction'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-500 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.panchayatVerified || 'Panchayat Verified'}
            </span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {selectedListingForDetail && (
        <ListingDetailModal
          listing={selectedListingForDetail}
          currentLang={currentLang}
          onClose={() => setSelectedListingForDetail(null)}
          onOpenChat={handleOpenChat}
          onOpenBarterCalc={handleOpenBarterCalc}
          isDarkMode={isDarkMode}
        />
      )}

      {selectedListingForChat && (
        <ChatModal
          listing={selectedListingForChat}
          currentLang={currentLang}
          onClose={() => setSelectedListingForChat(null)}
          onOpenBarterCalc={handleOpenBarterCalc}
          isDarkMode={isDarkMode}
        />
      )}

      <NotificationDrawer
        currentLang={currentLang}
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onSelectNotification={handleSelectNotification}
        onMarkAllRead={handleMarkAllRead}
        isDarkMode={isDarkMode}
      />

    </div>
  );
}

export default App;
