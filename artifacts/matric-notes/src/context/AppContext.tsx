import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const DOWNLOADS_KEY = '@matric_notes_downloads_v1';

type AppContextValue = {
  downloadedChapters: Set<string>;
  isOnline: boolean;
  isLoadingDownloads: boolean;
  markDownloaded: (chapterId: string) => Promise<void>;
  isDownloaded: (chapterId: string) => boolean;
};

const AppContext = createContext<AppContextValue>({
  downloadedChapters: new Set(),
  isOnline: true,
  isLoadingDownloads: true,
  markDownloaded: async () => {},
  isDownloaded: () => false,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [downloadedChapters, setDownloadedChapters] = useState<Set<string>>(new Set());
  const [isOnline, setIsOnline] = useState(true);
  const [isLoadingDownloads, setIsLoadingDownloads] = useState(true);

  // Load saved downloads from AsyncStorage
  useEffect(() => {
    async function loadDownloads() {
      try {
        const raw = await AsyncStorage.getItem(DOWNLOADS_KEY);
        if (raw) {
          const arr: string[] = JSON.parse(raw);
          setDownloadedChapters(new Set(arr));
        }
      } catch {
        // ignore read errors
      } finally {
        setIsLoadingDownloads(false);
      }
    }
    loadDownloads();
  }, []);

  // Subscribe to network state changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected === true && state.isInternetReachable !== false);
    });
    // Fetch initial state
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected === true && state.isInternetReachable !== false);
    });
    return unsubscribe;
  }, []);

  const markDownloaded = useCallback(async (chapterId: string) => {
    setDownloadedChapters((prev) => {
      const next = new Set(prev);
      next.add(chapterId);
      // Persist asynchronously
      AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(Array.from(next))).catch(() => {});
      return next;
    });
  }, []);

  const isDownloaded = useCallback(
    (chapterId: string) => downloadedChapters.has(chapterId),
    [downloadedChapters],
  );

  return (
    <AppContext.Provider
      value={{ downloadedChapters, isOnline, isLoadingDownloads, markDownloaded, isDownloaded }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
