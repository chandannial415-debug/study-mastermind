import { Redirect } from 'expo-router';

// Not used — app navigates via Stack from app/_layout.tsx
export default function TabIndex() {
  return <Redirect href="/home" />;
}
