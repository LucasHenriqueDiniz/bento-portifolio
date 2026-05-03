import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface GlowState {
  x: number;
  y: number;
  active: boolean;
}

const CardGlowContext = createContext<GlowState>({ x: -9999, y: -9999, active: false });

export const CardGlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GlowState>({ x: -9999, y: -9999, active: false });

  const handleMove = useCallback((e: MouseEvent) => {
    setState({ x: e.clientX, y: e.clientY, active: true });
  }, []);

  const handleLeave = useCallback(() => {
    setState({ x: -9999, y: -9999, active: false });
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [handleMove, handleLeave]);

  return <CardGlowContext.Provider value={state}>{children}</CardGlowContext.Provider>;
};

export const useCardGlowContext = () => useContext(CardGlowContext);
