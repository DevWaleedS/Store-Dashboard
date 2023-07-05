import React, { useState } from "react";

export const DeleteContext = React.createContext({});

const DeleteProvider = (props) => {
  const [actionDelete, setActionDelete] = useState(null);
  const [url,setUrl] = useState(null);
  const [deleteMethod,setDeleteMethod] = useState(null);
  const [deleteReload,setDeleteReload] = useState(false);
  const DeleteModal = {
    setUrl,
    url,
    actionDelete,
    setActionDelete,
    setDeleteReload,
    deleteReload,
    setDeleteMethod,
    deleteMethod,
  };

  return <DeleteContext.Provider value={DeleteModal}>{props.children}</DeleteContext.Provider>;
};

export default DeleteProvider;
