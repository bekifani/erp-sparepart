import React, { useEffect, useRef } from "react";
import TomSelect from "tom-select";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const TomSelectSearch = ({ apiUrl, setValue , variable, defaultValue}) => {
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
          const response = await axios.get(`${apiUrl}/${query}`, {
              headers: {
                  'X-Tenant': `${tenant}`,
                  'Authorization': `Bearer ${token}`
              }
          });
          console.log('TomSelectSearch: Response status:', response.status);
          console.log('TomSelectSearch: Response headers:', response.headers);
          console.log('TomSelectSearch: API response:', response.data);
          console.log('TomSelectSearch: Full response structure:', JSON.stringify(response.data, null, 2));
          
          // Handle the response structure from search APIs
          const dataArray = response.data.data?.data || response.data.data || response.data || [];
          console.log('TomSelectSearch: Data array:', dataArray);
          console.log('TomSelectSearch: First item structure:', dataArray[0]);
          console.log('TomSelectSearch: Available fields in first item:', dataArray[0] ? Object.keys(dataArray[0]) : 'No items');
          
          const options = dataArray.map(item => ({
            value: item.value || item.id,  
            text: item.text || item.name_surname || item.shipping_mark || item.email || item.brand_name || item.product_name || item.name || item.box_name || item.label_name || item.unit_name || item.brand_code || item.product_name_code,
          }));
          console.log('TomSelectSearch: Mapped options:', options);
          console.log('TomSelectSearch: Individual option mapping:');
          options.forEach((option, index) => {
            console.log(`  Option ${index}:`, { value: option.value, text: option.text, originalItem: dataArray[index] });
          });
          callback(options);  // Return options for the dropdown
        } catch (error) {
          console.error("Error fetching data:", error);
          console.error("Error details:", error.response?.data);
          callback(); // Return empty results on error
        }
      },
      create: false, // Disable create option (optional)
      onChange: (value) => {
        console.log('TomSelectSearch onChange:', { variable, value });
        setValue(variable, value);  // Update selected value on change using the variable parameter
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
