import { createContext, useContext, useState } from "react";

export const AudioTranslationContext = createContext(null);

export function AudioTranslationProvider({ children }) {
  const [navigation, setNavigation] = useState(null);

  return (
    <AudioTranslationContext.Provider value={{ navigation, setNavigation }}>
      {children}
    </AudioTranslationContext.Provider>
  );
}

export function useAudioTranslationContext() {
  return useContext(AudioTranslationContext);
}