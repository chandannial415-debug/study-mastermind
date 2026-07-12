---
name: homepage-dark-redesign
description: Dark theme homepage with Board Exam Prediction card, 4 class folders, and bottom nav tabs.
---

## Architecture

home.tsx is a single-screen component with `activeTab` state ('study' | 'ranks' | 'profile').
- Header is fixed outside the ScrollView.
- ScrollView changes content based on active tab.
- Custom bottom tab bar (TAB_BAR_H = 62) sits at the bottom as a sibling to ScrollView.
- No Expo Router tab group — all three tabs are embedded in one screen.

## Board Prediction Formula (AppContext.tsx)
Study Progress * 40% + Revision Factor * 35% + Quiz Accuracy * 25%
- Study Progress = uniqueQsAnswered.size / QUIZ_BANK_SIZE (80)
- Revision Factor = questions answered ≥ 2 times / QUIZ_BANK_SIZE
- Quiz Accuracy = correct / attempted

## Class Folders
- 10th Class (key: '10th') → active, navigates to goToSubjects({ categoryId: 'regular', ... })
- 9th / +2 1st / +2 2nd → Coming Soon, shows Alert

## recordQuizAnswer signature change
Old: `recordQuizAnswer(correct: boolean)`
New: `recordQuizAnswer(questionId: string, correct: boolean)`
quiz.tsx lines 399 and 406 updated to pass `currentQ.id`.

**Why:** Needed per-question tracking for revision count (how many times each question answered).

**How to apply:** Any new quiz screen calling recordQuizAnswer must pass the question ID as the first arg.
