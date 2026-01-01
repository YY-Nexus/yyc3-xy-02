import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BirthdayWish {
  id: string;
  recipientName: string;
  message: string;
  senderName: string;
  createdAt: string;
  isPublic: boolean;
}

interface BirthdayContextType {
  birthdayWishes: BirthdayWish[];
  loading: boolean;
  error: string | null;
  createBirthdayWish: (wish: Omit<BirthdayWish, 'id' | 'createdAt'>) => Promise<void>;
  fetchBirthdayWishes: () => Promise<void>;
  updateBirthdayWish: (id: string, updates: Partial<BirthdayWish>) => Promise<void>;
  deleteBirthdayWish: (id: string) => Promise<void>;
}

const BirthdayContext = createContext<BirthdayContextType | undefined>(undefined);

export const useBirthday = () => {
  const context = useContext(BirthdayContext);
  if (!context) {
    throw new Error('useBirthday must be used within a BirthdayProvider');
  }
  return context;
};

interface BirthdayProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'birthdayWishes';

const getStoredWishes = (): BirthdayWish[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveStoredWishes = (wishes: BirthdayWish[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
  } catch (err) {
    console.error('保存生日祝福失败:', err);
  }
};

export const BirthdayProvider: React.FC<BirthdayProviderProps> = ({ children }) => {
  const [birthdayWishes, setBirthdayWishes] = useState<BirthdayWish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBirthdayWishes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const wishes = getStoredWishes();
      wishes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setBirthdayWishes(wishes);
    } catch (err) {
      console.error('获取生日祝福失败:', err);
      setError('获取生日祝福失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const createBirthdayWish = async (wish: Omit<BirthdayWish, 'id' | 'createdAt'>) => {
    try {
      const newWish: BirthdayWish = {
        id: crypto.randomUUID(),
        ...wish,
        createdAt: new Date().toISOString()
      };
      
      const updatedWishes = [newWish, ...birthdayWishes];
      setBirthdayWishes(updatedWishes);
      saveStoredWishes(updatedWishes);
    } catch (err) {
      console.error('创建生日祝福失败:', err);
      setError('创建生日祝福失败，请稍后再试');
      throw err;
    }
  };

  const updateBirthdayWish = async (id: string, updates: Partial<BirthdayWish>) => {
    try {
      const updatedWishes = birthdayWishes.map(wish => 
        wish.id === id ? { ...wish, ...updates } : wish
      );
      
      setBirthdayWishes(updatedWishes);
      saveStoredWishes(updatedWishes);
    } catch (err) {
      console.error('更新生日祝福失败:', err);
      setError('更新生日祝福失败，请稍后再试');
      throw err;
    }
  };

  const deleteBirthdayWish = async (id: string) => {
    try {
      const updatedWishes = birthdayWishes.filter(wish => wish.id !== id);
      
      setBirthdayWishes(updatedWishes);
      saveStoredWishes(updatedWishes);
    } catch (err) {
      console.error('删除生日祝福失败:', err);
      setError('删除生日祝福失败，请稍后再试');
      throw err;
    }
  };

  useEffect(() => {
    fetchBirthdayWishes();
  }, []);

  const value: BirthdayContextType = {
    birthdayWishes,
    loading,
    error,
    createBirthdayWish,
    fetchBirthdayWishes,
    updateBirthdayWish,
    deleteBirthdayWish
  };

  return (
    <BirthdayContext.Provider value={value}>
      {children}
    </BirthdayContext.Provider>
  );
};

export default BirthdayContext;
