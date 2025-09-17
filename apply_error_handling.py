#!/usr/bin/env python3
"""
Script to apply comprehensive error handling pattern to React components.
Based on the pattern implemented in Customer.jsx and applied to Accounttype.jsx.
"""

import os
import re
import sys
from pathlib import Path

# List of files to process
FILES_TO_PROCESS = [
    "Attachment.jsx", "Basket.jsx", "Basketfile.jsx", "Basketitem.jsx", 
    "Companyaccount.jsx", "Customeraccount.jsx", "Customerbrandvisibilit.jsx", 
    "Customerinvoice.jsx", "Customerinvoiceitem.jsx", "Customerproductvisibilit.jsx", 
    "Fileoperation.jsx", "Order.jsx", "Orderdetail.jsx", "Packagin.jsx", 
    "Packagingproblem.jsx", "Packinglist.jsx", "Packinglistbox.jsx", 
    "Packinglistboxitem.jsx", "Paymentnote.jsx", "Problem.jsx", "Problemitem.jsx", 
    "Producthistor.jsx", "Productrule.jsx", "Productstatus.jsx", "Searchresult.jsx", 
    "Supplieraccount.jsx", "Supplierinvoice.jsx", "Supplierinvoiceitem.jsx", 
    "Supplierorder.jsx", "Supplierorderdetail.jsx", "Supplierpricingrule.jsx", 
    "Supplierpricingrulecustomer.jsx", "Supplierproduct.jsx", "Warehouse.jsx", 
    "Warehouseaccount.jsx"
]

BASE_PATH = "/home/natnael/Desktop/Fanaye Tech/dev/erp-sparepart/Frontend/src/views/ERP"

def extract_entity_name(filename):
    """Extract entity name from filename (e.g., 'Accounttype.jsx' -> 'Accounttype')"""
    return filename.replace('.jsx', '')

def get_enhanced_oncreate_function(entity_name):
    """Generate enhanced onCreate function with comprehensive error handling"""
    return f'''  const onCreate = async (data) => {{
    console.log('🟡 onCreate called with data:', data);
    console.log('🟡 Form errors:', errors);
    console.log('🟡 Current form values:', getValues());
    console.log('🟡 Form is valid:', Object.keys(errors).length === 0);
    
    // Check if form has validation errors
    if (Object.keys(errors).length > 0) {{
      console.error('🔴 Form has validation errors:', errors);
      setToastMessage(t("Please fix the form errors before submitting"));
      basicStickyNotification.current?.showToast();
      return;
    }}
    
    try {{
      const response = await create{entity_name}(data);
      console.log('🟡 API response:', response);
      
      if (response && (response.success === true || response.data?.success === true)) {{
        setToastMessage(t("{entity_name} created successfully."));
        setRefetch(true);
        setShowCreateModal(false);
        basicStickyNotification.current?.showToast();
        // Auto-hide toast after 7 seconds
        setTimeout(() => {{
          basicStickyNotification.current?.hideToast();
        }}, 7000);
      }} else {{
        console.error('🔴 API returned error:', response);
        let errorMessage = t("Error creating {entity_name}");
        
        // Check multiple possible error structures
        const errorSources = [
          response?.error?.data?.data?.errors,  // RTK Query error structure
          response?.data?.data?.errors,         // Direct API response
          response?.error?.data?.errors,        // Alternative error structure
          response?.data?.errors                // Simple error structure
        ];
        
        let validationErrors = null;
        for (const errorSource of errorSources) {{
          if (errorSource && typeof errorSource === 'object') {{
            validationErrors = errorSource;
            break;
          }}
        }}
        
        if (validationErrors) {{
          const errorFields = Object.keys(validationErrors);
          if (errorFields.length > 0) {{
            // Get the first validation error message
            const firstFieldErrors = validationErrors[errorFields[0]];
            if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {{
              errorMessage = firstFieldErrors[0];
            }} else if (typeof firstFieldErrors === 'string') {{
              errorMessage = firstFieldErrors;
            }}
          }}
        }} else {{
          // Handle parsing errors (when server returns HTML instead of JSON)
          if (response?.error?.status === "PARSING_ERROR") {{
            errorMessage = t("Server error occurred. Please try again later or contact support.");
          }} else {{
            // Fallback to general error messages
            const generalErrorSources = [
              response?.error?.data?.message,
              response?.data?.message,
              response?.message,
              response?.error?.error
            ];
            
            for (const errorSource of generalErrorSources) {{
              if (errorSource && typeof errorSource === 'string') {{
                errorMessage = errorSource;
                break;
              }}
            }}
          }}
        }}
        
        setToastMessage(errorMessage);
        basicStickyNotification.current?.showToast();
        // Auto-hide toast after 7 seconds
        setTimeout(() => {{
          basicStickyNotification.current?.hideToast();
        }}, 7000);
      }}
    }} catch (error) {{
      console.error('🔴 Exception in onCreate:', error);
      let errorMessage = t("Error creating {entity_name}");
      
      // Check multiple possible error structures in catch block
      const errorSources = [
        error?.error?.data?.data?.errors,
        error?.error?.data?.errors,
        error?.response?.data?.data?.errors,
        error?.response?.data?.errors,
        error?.data?.data?.errors,
        error?.data?.errors
      ];
      
      let validationErrors = null;
      for (const errorSource of errorSources) {{
        if (errorSource && typeof errorSource === 'object') {{
          validationErrors = errorSource;
          break;
        }}
      }}
      
      if (validationErrors) {{
        const errorFields = Object.keys(validationErrors);
        if (errorFields.length > 0) {{
          const firstFieldErrors = validationErrors[errorFields[0]];
          if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {{
            errorMessage = firstFieldErrors[0];
          }} else if (typeof firstFieldErrors === 'string') {{
            errorMessage = firstFieldErrors;
          }}
        }}
      }} else {{
        // Handle parsing errors in catch block
        if (error?.error?.status === "PARSING_ERROR") {{
          errorMessage = t("Server error occurred. Please try again later or contact support.");
        }} else {{
          // Fallback to general error messages
          const generalErrorSources = [
            error?.error?.data?.message,
            error?.response?.data?.message,
            error?.data?.message,
            error?.message
          ];
          
          for (const errorSource of generalErrorSources) {{
            if (errorSource && typeof errorSource === 'string') {{
              errorMessage = errorSource;
              break;
            }}
          }}
        }}
      }}
      
      setToastMessage(errorMessage);
      basicStickyNotification.current?.showToast();
      // Auto-hide toast after 7 seconds
      setTimeout(() => {{
        basicStickyNotification.current?.hideToast();
      }}, 7000);
    }}
  }};'''

def get_enhanced_onupdate_function(entity_name):
    """Generate enhanced onUpdate function with comprehensive error handling"""
    return f'''  const onUpdate = async (data) => {{
    try {{
      console.log('🟡 Updating {entity_name.lower()} with data:', data);
      const response = await update{entity_name}(data);
      console.log('🟡 Update {entity_name.lower()} response:', response);
        
      if (response && (response.success === true || response.data?.success === true)) {{
        setToastMessage(t('{entity_name} updated successfully'));
        setRefetch(true);
        setShowUpdateModal(false);
      }} else {{
        // Handle validation errors with comprehensive error extraction
        let errorMessage = t("Error updating {entity_name}");
        
        // Check multiple possible error structures
        const errorSources = [
          response?.error?.data?.data?.errors,  // RTK Query error structure
          response?.data?.data?.errors,         // Direct API response
          response?.error?.data?.errors,        // Alternative error structure
          response?.data?.errors                // Simple error structure
        ];
        
        let validationErrors = null;
        for (const errorSource of errorSources) {{
          if (errorSource && typeof errorSource === 'object') {{
            validationErrors = errorSource;
            break;
          }}
        }}
        
        if (validationErrors) {{
          const errorFields = Object.keys(validationErrors);
          if (errorFields.length > 0) {{
            // Get the first validation error message
            const firstFieldErrors = validationErrors[errorFields[0]];
            if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {{
              errorMessage = firstFieldErrors[0];
            }} else if (typeof firstFieldErrors === 'string') {{
              errorMessage = firstFieldErrors;
            }}
          }}
        }} else {{
          // Handle parsing errors (when server returns HTML instead of JSON)
          if (response?.error?.status === "PARSING_ERROR") {{
            errorMessage = t("Server error occurred. Please try again later or contact support.");
          }} else {{
            // Fallback to general error messages
            const generalErrorSources = [
              response?.error?.data?.message,
              response?.data?.message,
              response?.message,
              response?.error?.error
            ];
            
            for (const errorSource of generalErrorSources) {{
              if (errorSource && typeof errorSource === 'string') {{
                errorMessage = errorSource;
                break;
              }}
            }}
          }}
        }}
        
        setToastMessage(errorMessage);
        console.error('🔴 Update failed with response:', response);
        setShowUpdateModal(true);
      }}
    }} catch (error) {{
      console.error('🔴 Update {entity_name.lower()} error:', error);
      let errorMessage = t("Error updating {entity_name}");
      
      // Check multiple possible error structures in catch block
      const errorSources = [
        error?.error?.data?.data?.errors,
        error?.error?.data?.errors,
        error?.response?.data?.data?.errors,
        error?.response?.data?.errors,
        error?.data?.data?.errors,
        error?.data?.errors
      ];
      
      let validationErrors = null;
      for (const errorSource of errorSources) {{
        if (errorSource && typeof errorSource === 'object') {{
          validationErrors = errorSource;
          break;
        }}
      }}
      
      if (validationErrors) {{
        const errorFields = Object.keys(validationErrors);
        if (errorFields.length > 0) {{
          const firstFieldErrors = validationErrors[errorFields[0]];
          if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {{
            errorMessage = firstFieldErrors[0];
          }} else if (typeof firstFieldErrors === 'string') {{
            errorMessage = firstFieldErrors;
          }}
        }}
      }} else {{
        // Handle parsing errors in catch block
        if (error?.error?.status === "PARSING_ERROR") {{
          errorMessage = t("Server error occurred. Please try again later or contact support.");
        }} else {{
          // Fallback to general error messages
          const generalErrorSources = [
            error?.error?.data?.message,
            error?.response?.data?.message,
            error?.data?.message,
            error?.message
          ];
          
          for (const errorSource of generalErrorSources) {{
            if (errorSource && typeof errorSource === 'string') {{
              errorMessage = errorSource;
              break;
            }}
          }}
        }}
      }}
      
      setToastMessage(errorMessage);
      setShowUpdateModal(true);
    }}
      
    basicStickyNotification.current?.showToast();
    // Auto-hide toast after 7 seconds
    setTimeout(() => {{
      basicStickyNotification.current?.hideToast();
    }}, 7000);
  }};'''

def get_enhanced_ondelete_function(entity_name):
    """Generate enhanced onDelete function with comprehensive error handling"""
    return f'''  const onDelete = async () => {{
    let id = getValues("id");
    setShowDeleteModal(false);
    
    try {{
      console.log('🔴 Deleting {entity_name.lower()} with id:', id);
      const response = await delete{entity_name}(id);
      console.log('🔴 Delete {entity_name.lower()} response:', response);
      
      if (response && (response.success === true || response.data?.success === true)) {{
        setToastMessage(t("{entity_name} deleted successfully."));
        setRefetch(true);
      }} else {{
        // Handle validation errors specifically
        if (response?.error?.data?.data?.errors) {{
          const validationErrors = response.error.data.data.errors;
          const errorFields = Object.keys(validationErrors);
          if (errorFields.length > 0) {{
            const firstError = validationErrors[errorFields[0]][0];
            setToastMessage(firstError);
          }}
        }} else {{
          const errorMsg = response?.error?.data?.message || response?.message || response?.error || 'Unknown error occurred';
          setToastMessage(`${{t("Error deleting {entity_name}")}}: ${{errorMsg}}`);
        }}
        console.error('🔴 Delete failed with response:', response);
      }}
    }} catch (error) {{
      console.error('🔴 Delete {entity_name.lower()} error:', error);
      let errorMessage = t("Error deleting {entity_name}");
      
      if (error?.error?.data?.data?.errors) {{
        // Handle validation errors from error.error.data.data.errors structure
        const validationErrors = error.error.data.data.errors;
        const errorFields = Object.keys(validationErrors);
        if (errorFields.length > 0) {{
          const firstError = validationErrors[errorFields[0]][0];
          errorMessage = firstError;
        }}
      }} else if (error?.error?.data?.message) {{
        errorMessage = error.error.data.message;
      }} else if (error.response?.data?.message) {{
        errorMessage = error.response.data.message;
      }} else if (error.message) {{
        errorMessage = `${{t("Error")}}: ${{error.message}}`;
      }}
      
      setToastMessage(errorMessage);
    }}
    
    basicStickyNotification.current?.showToast();
    // Auto-hide toast after 7 seconds
    setTimeout(() => {{
      basicStickyNotification.current?.hideToast();
    }}, 7000);
  }};'''

def find_function_boundaries(content, function_name):
    """Find the start and end positions of a function in the content"""
    # Look for function definition
    pattern = rf'const\s+{function_name}\s*=\s*async\s*\([^)]*\)\s*=>\s*\{{'
    match = re.search(pattern, content)
    
    if not match:
        # Try alternative pattern
        pattern = rf'const\s+{function_name}\s*=\s*\([^)]*\)\s*=>\s*\{{'
        match = re.search(pattern, content)
    
    if not match:
        return None, None
    
    start_pos = match.start()
    
    # Find the matching closing brace
    brace_count = 0
    pos = match.end() - 1  # Start from the opening brace
    
    while pos < len(content):
        if content[pos] == '{':
            brace_count += 1
        elif content[pos] == '}':
            brace_count -= 1
            if brace_count == 0:
                return start_pos, pos + 1
        pos += 1
    
    return None, None

def process_file(file_path):
    """Process a single React component file to enhance error handling"""
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return False
    
    filename = os.path.basename(file_path)
    entity_name = extract_entity_name(filename)
    
    print(f"🔄 Processing {filename}...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = False
        
        # Replace onCreate function
        start, end = find_function_boundaries(content, 'onCreate')
        if start is not None and end is not None:
            new_function = get_enhanced_oncreate_function(entity_name)
            content = content[:start] + new_function + content[end:]
            changes_made = True
            print(f"  ✅ Enhanced onCreate function")
        else:
            print(f"  ⚠️  onCreate function not found")
        
        # Replace onUpdate function
        start, end = find_function_boundaries(content, 'onUpdate')
        if start is not None and end is not None:
            new_function = get_enhanced_onupdate_function(entity_name)
            content = content[:start] + new_function + content[end:]
            changes_made = True
            print(f"  ✅ Enhanced onUpdate function")
        else:
            print(f"  ⚠️  onUpdate function not found")
        
        # Replace onDelete function
        start, end = find_function_boundaries(content, 'onDelete')
        if start is not None and end is not None:
            new_function = get_enhanced_ondelete_function(entity_name)
            content = content[:start] + new_function + content[end:]
            changes_made = True
            print(f"  ✅ Enhanced onDelete function")
        else:
            print(f"  ⚠️  onDelete function not found")
        
        # Write back to file if changes were made
        if changes_made:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  💾 File updated successfully")
            return True
        else:
            print(f"  ℹ️  No changes needed")
            return False
            
    except Exception as e:
        print(f"  ❌ Error processing file: {str(e)}")
        return False

def main():
    """Main function to process all files"""
    print("🚀 Starting comprehensive error handling enhancement...")
    print(f"📁 Base path: {BASE_PATH}")
    print(f"📝 Files to process: {len(FILES_TO_PROCESS)}")
    print("-" * 60)
    
    processed_count = 0
    success_count = 0
    
    for filename in FILES_TO_PROCESS:
        file_path = os.path.join(BASE_PATH, filename)
        processed_count += 1
        
        print(f"[{processed_count}/{len(FILES_TO_PROCESS)}] {filename}")
        
        if process_file(file_path):
            success_count += 1
        
        print()  # Empty line for readability
    
    print("-" * 60)
    print(f"✅ Processing complete!")
    print(f"📊 Files processed: {processed_count}")
    print(f"🎯 Files successfully updated: {success_count}")
    print(f"⚠️  Files skipped/failed: {processed_count - success_count}")
    
    if success_count > 0:
        print(f"""
🎉 Enhanced error handling has been applied to {success_count} files!

Key improvements:
✅ Comprehensive validation error parsing
✅ Server parsing error detection (HTML vs JSON)  
✅ User-friendly error messages
✅ Detailed console logging for debugging
✅ Auto-hide toast notifications
✅ Form validation before submission
✅ Proper async/await usage

All files now have the same robust error handling pattern as Customer.jsx and Accounttype.jsx.
""")

if __name__ == "__main__":
    main()
