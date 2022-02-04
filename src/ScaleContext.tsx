import React, {PropsWithChildren} from 'react';

const ScaleContext = React.createContext(1.0);

const useScale = () => React.useContext(ScaleContext);

type ScaleProviderProps = PropsWithChildren<{
  scale: number;
}>;

const ScaleProvider = ({ scale, children }: ScaleProviderProps) => {
  return (
    <ScaleContext.Provider value={scale}>
      {children}
    </ScaleContext.Provider>
  );
};

export { ScaleProvider, useScale };
