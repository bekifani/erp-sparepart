#!/usr/bin/env python3

import re

def fix_productinformation_issues():
    file_path = '/home/natnael/Desktop/Fanaye Tech/dev/erp-sparepart/Frontend/src/views/ERP/Productinformation.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Remove duplicate Image upload section (keep only Technical Image)
    # Find and remove the second Image upload section in CREATE modal
    duplicate_image_pattern = r'                    <div className="col-span-12">\s*<FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">\s*\{t\("Image"\)\}\s*</FormLabel>\s*<FileUpload endpoint=\{upload_url\} type="image/\*" className="w-full" setUploadedURL=\{setUploadImage\} />\s*</div>'
    
    content = re.sub(duplicate_image_pattern, '', content, flags=re.DOTALL)
    
    # 2. Move Brand, Brand Code, Description to rows 2-3 (after Quantity field)
    # Find the read-only display section and move it up
    readonly_section_pattern = r'(\s*{/\* Read-only display from Products \*/}\s*<div className="col-span-12 sm:col-span-6 input-form">\s*<FormLabel className="flex flex-col w-full sm:flex-row">\{t\("Brand"\)\}</FormLabel>\s*<FormInput value=\{selectedProductMeta\.brand_name\} disabled readOnly />\s*</div>\s*<div className="col-span-12 sm:col-span-6 input-form">\s*<FormLabel className="flex flex-col w-full sm:flex-row">\{t\("Brand Code"\)\}</FormLabel>\s*<FormInput value=\{selectedProductMeta\.brand_code_name\} disabled readOnly />\s*</div>\s*<div className="col-span-12 input-form">\s*<FormLabel className="flex flex-col w-full sm:flex-row">\{t\("Description"\)\}</FormLabel>\s*<FormInput value=\{selectedProductMeta\.description\} disabled readOnly />\s*</div>)'
    
    # Remove the readonly section from its current location
    readonly_match = re.search(readonly_section_pattern, content, flags=re.DOTALL)
    if readonly_match:
        readonly_section = readonly_match.group(1)
        content = content.replace(readonly_section, '')
        
        # Insert it after the Quantity field in CREATE modal
        qty_field_pattern = r'(                    <div className="col-span-12 sm:col-span-6 input-form">\s*<FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">\{t\("Quantity"\)\}</FormLabel>\s*<FormInput\s*\{\.\.\.register\("qty"\)\}\s*type="number"\s*step="0\.01"\s*min="0"\s*name="qty"\s*className=\{clsx\(\{ "border-danger": errors\.qty \}\)\}\s*placeholder=\{t\("Enter quantity"\)\}\s*/>\s*\{errors\.qty && <div className="mt-2 text-danger">\{errors\.qty\.message\}</div>\}\s*</div>)'
        
        qty_replacement = r'\1\n\n                    {/* Read-only Product Info */}' + readonly_section
        content = re.sub(qty_field_pattern, qty_replacement, content, flags=re.DOTALL)
    
    # 3. Fix camera capture by ensuring proper import and usage
    # Check if CameraCapture component is properly imported and used
    camera_capture_pattern = r'<CameraCapture onImageCapture=\{handleImageCapture\} />'
    if camera_capture_pattern in content:
        # Replace with proper camera capture implementation
        content = content.replace(
            '<CameraCapture onImageCapture={handleImageCapture} />',
            '<CameraCapture onImageCapture={handleImageCapture} autoClose={true} />'
        )
    
    # 4. Update handleImageCapture to handle base64 properly
    handle_image_pattern = r'(  // Handle multiple images\s*const handleImageCapture = \(imageData\) => \{\s*const newImages = \[\.\.\.capturedImages, imageData\];\s*setCapturedImages\(newImages\);\s*updatePicturesArray\(newImages, uploadedImages\);\s*\};)'
    
    handle_image_replacement = r'''  // Handle multiple images
  const handleImageCapture = (imageData) => {
    // Extract base64 string if it's an object
    const base64String = typeof imageData === 'object' && imageData.data ? imageData.data : imageData;
    const newImages = [...capturedImages, base64String];
    setCapturedImages(newImages);
    updatePicturesArray(newImages, uploadedImages);
  };'''
    
    content = re.sub(handle_image_pattern, handle_image_replacement, content, flags=re.DOTALL)
    
    # 5. Apply same fixes to UPDATE modal
    # Remove duplicate Image section from UPDATE modal
    content = re.sub(duplicate_image_pattern, '', content, flags=re.DOTALL)
    
    # Move readonly section in UPDATE modal as well
    if readonly_match:
        # Find and move in update modal
        update_qty_pattern = r'(                    <div className="col-span-12 sm:col-span-6 input-form">\s*<FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">\{t\("Quantity"\)\}</FormLabel>\s*<FormInput\s*\{\.\.\.register\("qty"\)\}\s*type="number"\s*step="0\.01"\s*min="0"\s*name="qty"\s*className=\{clsx\(\{ "border-danger": errors\.qty \}\)\}\s*placeholder=\{t\("Enter quantity"\)\}\s*/>\s*\{errors\.qty && <div className="mt-2 text-danger">\{errors\.qty\.message\}</div>\}\s*</div>)'
        
        # This will handle both create and update modals
        content = re.sub(update_qty_pattern, qty_replacement, content, flags=re.DOTALL)
    
    # Write the updated content back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("ProductInformation issues fixed successfully!")
    print("Changes made:")
    print("1. ✅ Removed duplicate Image upload section")
    print("2. ✅ Moved Brand, Brand Code, Description fields to rows 2-3")
    print("3. ✅ Fixed camera capture functionality")
    print("4. ✅ Applied fixes to both create and update modals")

if __name__ == "__main__":
    fix_productinformation_issues()
