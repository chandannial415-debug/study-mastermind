/**
 * Study Mindset — Typed navigation hooks
 * Wraps expo-router's `router` with explicit param shapes so every
 * push() call is type-checked against RootStackParamList.
 */

import { router } from 'expo-router';
import type { RootStackParamList } from './types';

type SubjectsParams  = RootStackParamList['subjects'];
type ChaptersParams  = RootStackParamList['chapters'];
type ViewerParams    = RootStackParamList['viewer'];

export function useAppRouter() {
  return {
    goHome() {
      router.replace('/home');
    },

    goToSubjects(params: SubjectsParams) {
      router.push({ pathname: '/subjects', params });
    },

    goToChapters(params: ChaptersParams) {
      router.push({ pathname: '/chapters', params });
    },

    goToViewer(params: ViewerParams) {
      router.push({ pathname: '/viewer', params });
    },

    goToGaming() {
      router.push('/gaming');
    },

    goBack() {
      router.back();
    },

    canGoBack() {
      return router.canGoBack();
    },
  };
}
