/**
 * Study Mindset — Typed navigation hooks
 * Wraps expo-router's `router` with explicit param shapes so every
 * push() call is type-checked against RootStackParamList.
 */

import { router } from 'expo-router';
import type { RootStackParamList } from './types';

type SubjectsParams = RootStackParamList['subjects'];
type ChaptersParams = RootStackParamList['chapters'];
type ViewerParams   = RootStackParamList['viewer'];
type QuizParams     = RootStackParamList['quiz'];

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

    goToQuiz(params: QuizParams) {
      router.push({ pathname: '/quiz', params });
    },

    goBack() {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/home');
      }
    },

    canGoBack() {
      return router.canGoBack();
    },
  };
}
