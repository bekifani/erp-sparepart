#!/usr/bin/env python3

import re

def update_productinformation_frontend():
    file_path = '/home/natnael/Desktop/Fanaye Tech/dev/erp-sparepart/Frontend/src/views/ERP/Productinformation.jsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add Qty field to CREATE modal (after OE Code field)
    create_qty_pattern = r'(                    <div className="col-span-12 sm:col-span-6 input-form">\s*<FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">\{t\("Oe Code"\)\}</FormLabel>\s*<FormInput\s*\{\.\.\.register\("oe_code"\)\}\s*type="text"\s*name="oe_code"\s*className=\{clsx\(\{ "border-danger": errors\.oe_code \}\)\}\s*placeholder=\{t\("Enter oe_code"\)\}\s*/>\s*</div>\s*)(                    <div className="col-span-12 sm:col-span-6 input-form">\s*<FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">\{t\("Net Weight"\)\}</FormLabel>)'
    
    create_qty_replacement = r'''\1
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Quantity")}</FormLabel>
                      <FormInput
                        {...register("qty")}
                        type="number"
                        step="0.01"
                        min="0"
                        name="qty"
                        className={clsx({ "border-danger": errors.qty })}
                        placeholder={t("Enter quantity")}
                      />
                      {errors.qty && <div className="mt-2 text-danger">{errors.qty.message}</div>}
                    </div>

                    {/* Row 3 */}
\2'''
    
    # Apply the CREATE modal qty field update
    content = re.sub(create_qty_pattern, create_qty_replacement, content, flags=re.DOTALL)
    
    # 2. Remove QR Code upload from CREATE modal and replace with Pictures
    qr_code_create_pattern = r'                    <div className="col-span-12 sm:col-span-12 input-form">\s*<FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">\{t\("QR Code \(Image\)"\)\}</FormLabel>\s*<FileUpload\s*endpoint=\{upload_url\}\s*type="image/\*"\s*className="w-full"\s*setUploadedURL=\{setUploadQrCode\}\s*/>\s*\{getValues\(\'qr_code\'\) \? \(\s*<img src=\{`\$\{media_url\}\$\{getValues\(\'qr_code\'\)\}`\} alt="QR Code" className="mt-2 w-24 h-24 object-contain border rounded p-1" />\s*\) : null\}\s*\{errors\.qr_code && <div className="mt-2 text-danger">\{errors\.qr_code\.message\}</div>\}\s*</div>'
    
    qr_code_create_replacement = '''                    <div className="col-span-12 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Pictures (Multiple Images)")}</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t("Camera Capture")}</label>
                          <CameraCapture onImageCapture={handleImageCapture} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t("File Upload")}</label>
                          <FileUpload
                            endpoint={upload_url}
                            type="image/*"
                            className="w-full"
                            setUploadedURL={handleImageUpload}
                          />
                        </div>
                      </div>
                      
                      {/* Image Previews */}
                      {(capturedImages.length > 0 || uploadedImages.length > 0) && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t("Selected Images")}</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {capturedImages.map((img, index) => (
                              <div key={`captured-${index}`} className="relative">
                                <img src={img} alt={`Captured ${index + 1}`} className="w-full h-20 object-cover rounded border" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index, 'captured')}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            {uploadedImages.map((img, index) => (
                              <div key={`uploaded-${index}`} className="relative">
                                <img src={`${media_url}${img}`} alt={`Uploaded ${index + 1}`} className="w-full h-20 object-cover rounded border" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index, 'uploaded')}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {errors.pictures && <div className="mt-2 text-danger">{errors.pictures.message}</div>}
                    </div>'''
    
    # Apply QR code removal and pictures addition for CREATE modal
    content = re.sub(qr_code_create_pattern, qr_code_create_replacement, content, flags=re.DOTALL)
    
    # 3. Add Qty field to UPDATE modal (similar pattern but in update section)
    # Find the update modal section and apply similar changes
    update_sections = content.split('/* Update Modal */')
    if len(update_sections) > 1:
        update_content = update_sections[1]
        
        # Add qty field to update modal
        update_qty_pattern = r'(                    <div className="col-span-12 sm:col-span-6 input-form">\s*<FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">\{t\("Oe Code"\)\}</FormLabel>\s*<FormInput\s*\{\.\.\.register\("oe_code"\)\}\s*type="text"\s*name="oe_code"\s*className=\{clsx\(\{ "border-danger": errors\.oe_code \}\)\}\s*placeholder=\{t\("Enter oe_code"\)\}\s*/>\s*</div>\s*)(                    <div className="col-span-12 sm:col-span-6 input-form">\s*<FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">\{t\("Net Weight"\)\}</FormLabel>)'
        
        update_qty_replacement = r'''\1
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Quantity")}</FormLabel>
                      <FormInput
                        {...register("qty")}
                        type="number"
                        step="0.01"
                        min="0"
                        name="qty"
                        className={clsx({ "border-danger": errors.qty })}
                        placeholder={t("Enter quantity")}
                      />
                      {errors.qty && <div className="mt-2 text-danger">{errors.qty.message}</div>}
                    </div>

                    {/* Row 3 */}
\2'''
        
        update_content = re.sub(update_qty_pattern, update_qty_replacement, update_content, flags=re.DOTALL)
        
        # Remove QR code upload from UPDATE modal
        qr_code_update_pattern = r'                    <div className="col-span-12 sm:col-span-12 input-form">\s*<FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">\{t\("QR Code \(Image\)"\)\}</FormLabel>\s*<FileUpload\s*endpoint=\{upload_url\}\s*type="image/\*"\s*className="w-full"\s*setUploadedURL=\{setUploadQrCode\}\s*/>\s*\{getValues\(\'qr_code\'\) \? \(\s*<img src=\{`\$\{media_url\}\$\{getValues\(\'qr_code\'\)\}`\} alt="QR Code" className="mt-2 w-24 h-24 object-contain border rounded p-1" />\s*\) : null\}\s*\{errors\.qr_code && <div className="mt-2 text-danger">\{errors\.qr_code\.message\}</div>\}\s*</div>'
        
        update_content = re.sub(qr_code_update_pattern, qr_code_create_replacement, update_content, flags=re.DOTALL)
        
        # Reconstruct the content
        content = update_sections[0] + '/* Update Modal */' + update_content
    
    # 4. Add Pictures column to table (replace Image column)
    pictures_column_pattern = r'    \{\s*title: t\("Image"\),\s*minWidth: 200,\s*field: "image",\s*hozAlign: "center",\s*headerHozAlign: "center",\s*vertAlign: "middle",\s*print: true,\s*download: true,\s*formatter\(cell\) \{\s*return getMiniDisplay\(cell\.getData\(\)\.image\);\s*\}\s*\},'
    
    pictures_column_replacement = '''    {
      title: t("Pictures"),
      minWidth: 200,
      field: "pictures",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        const pictures = cell.getData().pictures;
        if (pictures && Array.isArray(pictures) && pictures.length > 0) {
          return `<span class="text-blue-600 font-medium">${pictures.length} image(s)</span>`;
        }
        return '<span class="text-gray-400">No images</span>';
      }
    },'''
    
    content = re.sub(pictures_column_pattern, pictures_column_replacement, content, flags=re.DOTALL)
    
    # 5. Update edit action to populate pictures
    edit_action_pattern = r'(        a\.addEventListener\("click", function \(\) \{\s*const data = cell\.getData\(\);\s*Object\.keys\(data\)\.forEach\(\(key\) => \{\s*setValue\(key, data\[key\]\);\s*\}\);)(.*?setShowUpdateModal\(true\);)'
    
    edit_action_replacement = r'''\1
          // Populate pictures arrays for editing
          if (data.pictures && Array.isArray(data.pictures)) {
            setUploadedImages(data.pictures);
            setCapturedImages([]);
            updatePicturesArray([], data.pictures);
          } else {
            setUploadedImages([]);
            setCapturedImages([]);
          }\2'''
    
    content = re.sub(edit_action_pattern, edit_action_replacement, content, flags=re.DOTALL)
    
    # Write the updated content back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("ProductInformation frontend updated successfully!")
    print("Changes made:")
    print("1. ✅ Added Qty field to both create and update forms")
    print("2. ✅ Removed QR code upload fields (auto-generated on backend)")
    print("3. ✅ Added multiple pictures upload with camera capture")
    print("4. ✅ Updated Pictures table column")
    print("5. ✅ Enhanced edit functionality for pictures")

if __name__ == "__main__":
    update_productinformation_frontend()
