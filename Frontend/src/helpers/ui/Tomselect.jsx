import React, { useEffect, useRef } from "react";
import TomSelect from "tom-select";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const TomSelectSearch = ({ apiUrl, setValue , variable, defaultValue, customDataMapping}) => {
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
         
          const response = await axios.get(`${apiUrl}/${query}`, {
              headers: {
                  'X-Tenant': `${tenant}`,
                  'Authorization': `Bearer ${token}`
              }
          });
          
          // Handle different response structures
          let data = response.data;
          if (data.data) {
            data = data.data;
            if (data.data) {
              data = data.data;
            }
          }
          
          // Ensure data is an array
          const items = Array.isArray(data) ? data : [];
          
          const options = items.map(item => {
            if (customDataMapping) {
              return customDataMapping(item);
            }
            return {
              value: item.id,  
              text: item.name,
            };
          });
          callback(options);  // Return options for the dropdown
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      },
      create: false, // Disable create option (optional)
      onChange: (value) => {
        setValue(variable, value);  // Update selected value on change
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
