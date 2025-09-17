import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Global state to track unsaved data across components
let globalUnsavedData = false;
let globalNavigationBlocker = null;

export const setGlobalUnsavedData = (hasUnsavedData) => {
  console.log('Global unsaved data changed to:', hasUnsavedData);
  globalUnsavedData = hasUnsavedData;
};

export const getGlobalUnsavedData = () => {
  return globalUnsavedData;
};

// Hook to use in components that need navigation blocking
export const useNavigationBlocker = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Create a protected navigate function
  const protectedNavigate = useCallback((to, options = {}) => {
    console.log('Protected navigate called, unsaved data:', globalUnsavedData);
    
    if (globalUnsavedData) {
      const confirmed = window.confirm(
        "You have an uploaded file that hasn't been imported. If you leave this page, the upload will be lost. Do you want to continue?"
      );
      
      if (!confirmed) {
        console.log('Navigation blocked by user');
        return;
      }
      
      console.log('Navigation confirmed by user');
      // Clear unsaved data flag after user confirms
      setGlobalUnsavedData(false);
    }
    
    // Proceed with navigation
    navigate(to, options);
  }, [navigate]);

  return {
    protectedNavigate,
    setUnsavedData: setGlobalUnsavedData,
    hasUnsavedData: globalUnsavedData
  };
};

// Hook for components to register unsaved data
export const useUnsavedDataTracker = () => {
  return {
    setUnsavedData: setGlobalUnsavedData,
    hasUnsavedData: globalUnsavedData
  };
};
