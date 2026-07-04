import { Redirect } from 'expo-router';

// This tab layout is not used in Matric Notes.
// The app uses a Stack navigator defined in app/_layout.tsx.
export default function TabLayout() {
  return <Redirect href="/home" />;
}
