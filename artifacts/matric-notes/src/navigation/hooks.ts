/**
 * Study Mindset — Typed navigation hooks
 * Wraps expo-router's `router` with explicit param shapes so every
 * push() call is type-checked against RootStackParamList.
 */

import { router } from 'expo-router';
import type { RootStackParamList } from './types';

type SubjectsParams   = RootStackParamList['subjects'];
type ChaptersParams   = RootStackParamList['chapters'];
type ChapterHubParams = RootStackParamList['chapterHub'];
type ViewerParams     = RootStackParamList['viewer'];
type NotesParams      = RootStackParamList['notes'];
type PyqParams        = RootStackParamList['pyq'];
type QuizParams       = RootStackParamList['quiz'];

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

    goToChapterHub(params: ChapterHubParams) {
      router.push({ pathname: '/chapter-hub', params });
    },

    goToViewer(params: ViewerParams) {
      router.push({ pathname: '/viewer', params });
    },

    goToNotes(params: NotesParams) {
      router.push({ pathname: '/notes', params });
    },

    goToPyq(params: PyqParams) {
      router.push({ pathname: '/pyq', params });
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
