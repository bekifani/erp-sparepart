import React, { useEffect, useRef } from "react";
import TomSelect from "tom-select";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const TomSelectSearch = ({ apiUrl, setValue , variable, defaultValue, customDataMapping, onSelectionChange, minQueryLength = 1, defaultLabel, multiple = false, options = {} }) => {
  const {t,i18n} = useTranslation()
  const tomSelectRef = useRef(null);
  const token = useSelector((state)=> state.auth.token)
  const csrfToken = useSelector((state)=> state.auth.csrf_token)
  const tenant = useSelector((state)=> state.auth.tenant)

  useEffect(() => {
    // Initialize Tom Select with configuration
    const tomSelectInstance = new TomSelect(tomSelectRef.current, {
      placeholder: options.placeholder || t("Search") + "...",
      plugins: multiple ? ['remove_button'] : [],
      ...options,
      load: async (query, callback) => {
        try {
          if (!query.trim() || query.length < minQueryLength) return callback();
         
          // Attempt path param first: /api/search_xxx/{query}
          const pathUrl = `${apiUrl}/${encodeURIComponent(query)}`;
          const queryUrl = `${apiUrl}?term=${encodeURIComponent(query)}`;
          console.log('TomSelectSearch: Trying path URL:', pathUrl);

          let response;
          try {
            response = await axios.get(pathUrl, {
              headers: {
                'X-Tenant': `${tenant}`,
                'Authorization': `Bearer ${token}`,
                'X-CSRF-TOKEN': csrfToken
              } 
            });
          } catch (err) {
            // Fallback to query param if path failed (404/405/400 etc.)
            console.warn('TomSelectSearch: Path URL failed, trying query URL:', queryUrl, err?.response?.status);
            response = await axios.get(queryUrl, {
              headers: {
                'X-Tenant': `${tenant}`,
                'Authorization': `Bearer ${token}`
              }
            });
          }
          
          // Normalize data
          let data = response.data;
          // Handle BaseController response format: {success: true, data: {data: [items], ...}, message: "..."}
          if (data?.success && data?.data?.data && Array.isArray(data.data.data)) {
            data = data.data.data;
          } else if (data?.data?.data && Array.isArray(data.data.data)) {
            data = data.data.data;
          } else if (data?.data && Array.isArray(data.data)) {
            data = data.data;
          } else if (Array.isArray(data)) {
            // data is already the array
          } else {
            console.warn('TomSelectSearch: Unexpected data format:', data);
            data = [];
          }

          const items = Array.isArray(data) ? data : [];

          // Build options (mapped objects)
          const options = items.map(item => {
            if (customDataMapping) {
              return customDataMapping(item) || {};
            }
            return {
              value: item.value || item.id,  
              text: item.text || item.name,
            };
          });

          // Store mapped options for later retrieval in onChange
          tomSelectInstance.itemsData = options;
          callback(options);
        } catch (error) {
          console.error("TomSelectSearch: Error fetching data:", error);
          console.error("TomSelectSearch: Error details:", error.response?.data);
          callback();
        }
      },
      onChange: (value) => {
        // Handle both single and multiple selections
        const finalValue = multiple ? (Array.isArray(value) ? value : [value].filter(Boolean)) : value;
        // Mark as dirty/validated so RHF sees it as filled
        setValue(variable, finalValue, { shouldDirty: true, shouldValidate: true });
        if (onSelectionChange && tomSelectInstance.itemsData) {
          if (multiple) {
            const selectedItems = finalValue.map(v => tomSelectInstance.itemsData.find(item => (item.value) == v)).filter(Boolean);
            onSelectionChange(selectedItems);
          } else {
            const selectedItem = tomSelectInstance.itemsData.find(item => (item.value) == value);
            if (selectedItem) onSelectionChange(selectedItem);
          }
        }
      },
      create: false,
    });

    // Seed initial option/selection
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
      <select ref={tomSelectRef} multiple={multiple}>
        <option value="">Select an option</option>
      </select>
    </div>
  );
};

export default TomSelectSearch;
