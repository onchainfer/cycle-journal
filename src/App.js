import { useState } from 'react';
import Onboarding from './components/Onboarding';
import JournalForm from './components/JournalForm';

export default function App() {
  const [profile, setProfile] = useState(null);

  if (!profile) {
    return <Onboarding onComplete={(p) => setProfile(p)} />;
  }

  return <JournalForm />;
}