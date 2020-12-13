import React from 'react';

type HookOptions = {
  timing?: number;
};

export function useBlopp({ timing }: HookOptions) {
  const [isBlopped, setIsBlopped] = React.useState(false);
  React.useEffect(() => {
    if (!isBlopped) {
      return;
    }
    const timeout = setTimeout(() => setIsBlopped(false), timing);
    return () => {
      clearTimeout(timeout);
    };
  }, [isBlopped, setIsBlopped]);

  return {
    isBlopped,
    setIsBlopped,
  };
}
