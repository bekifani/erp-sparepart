import React, { useEffect, useRef } from "react";
import TomSelect from "tom-select";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const TomSelectSearch = ({ apiUrl, setValue , variable, defaultValue, customDataMapping, onSelectionChange}) => {
  const {t,i18n} = useTranslation()
  const tomSelectRef = useRef(null);
  const token = useSelector((state)=> state.auth.token)
  const tenant = useSelector((state)=> state.auth.tenant)
  useEffect(() => {
    // Initialize Tom Select with configuration
    const tomSelectInstance = new TomSelect(tomSelectRef.current, {
      placeholder: t("Search") + "...",
      load: async (query, callback) => {
        try {
          if (!query.trim()) return callback();
         
          console.log('TomSelectSearch: Making API call to:', `${apiUrl}/${query}`);
          console.log('TomSelectSearch: Query term:', query);
          
          const response = await axios.get(`${apiUrl}/${query}`, {
              headers: {
                  'X-Tenant': `${tenant}`,
                  'Authorization': `Bearer ${token}`
              }
          });
          
          console.log('TomSelectSearch: Raw API response:', response.data);
          
          // Handle different response structures
          let data = response.data;
          if (data.data) {
            data = data.data;
            if (data.data) {
              data = data.data;
            }
          }
          
          console.log('TomSelectSearch: Processed data:', data);
          
          // Ensure data is an array
          const items = Array.isArray(data) ? data : [];
          console.log('TomSelectSearch: Items array:', items);
          console.log('TomSelectSearch: Items count:', items.length);
          
          const options = items.map(item => {
            if (customDataMapping) {
              const mapped = customDataMapping(item);
              console.log('TomSelectSearch: Custom mapped item:', mapped);
              return mapped;
            }
            return {
              value: item.id,  
              text: item.name,
            };
          });
          
          console.log('TomSelectSearch: Final options for dropdown:', options);
          
          // Store items for later use in onChange
          tomSelectInstance.itemsData = items;
          callback(options);  // Return options for the dropdown
        } catch (error) {
          console.error("TomSelectSearch: Error fetching data:", error);
          console.error("TomSelectSearch: Error details:", error.response?.data);
        }
      },
      create: false, // Disable create option (optional)
      onChange: (value) => {
        setValue(variable, value);  // Update selected value on change
        
        // Call onSelectionChange callback if provided
        if (onSelectionChange && tomSelectInstance.itemsData) {
          const selectedItem = tomSelectInstance.itemsData.find(item => item.id == value);
          if (selectedItem) {
            console.log('Selected item:', selectedItem);
            onSelectionChange(selectedItem);
          }
        }
      },
    });

    
    if (defaultValue) {
      tomSelectInstance.setValue(defaultValue);
    }
    // Cleanup function
    return () => {
      tomSelectInstance.destroy();
    };
  }, [apiUrl]);

  return (
    <div>
      <select ref={tomSelectRef}>
        <option value="">Select an option</option>
      </select>
    </div>
  );
};

export default TomSelectSearch;
