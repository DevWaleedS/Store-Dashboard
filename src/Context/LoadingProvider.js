import React, { useState } from "react";

export const LoadingContext = React.createContext({});

const LoadingProvider = (props) => {
  const [loadingTitle, setLoadingTitle] = useState('');
  const loading = {
    loadingTitle,
    setLoadingTitle,
  };

  return <LoadingContext.Provider value={loading}>{props.children}</LoadingContext.Provider>;
};

export default LoadingProvider;
