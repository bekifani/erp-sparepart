import React from 'react'
import { useSelector } from 'react-redux'

const Can = ({permission, children }) => {
  const user = useSelector((state)=> state.auth.user)
  const hasPermission = user.permissions.includes(permission);
  return hasPermission ? children : null;
};

export default Can;