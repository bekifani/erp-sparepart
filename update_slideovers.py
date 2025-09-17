#!/usr/bin/env python3
import os
import re

# List of files to update
files = [
    "Frontend/src/views/ERP/Attachment.jsx",
    "Frontend/src/views/ERP/Basket.jsx",
    "Frontend/src/views/ERP/Basketfile.jsx",
    "Frontend/src/views/ERP/Basketitem.jsx",
    "Frontend/src/views/ERP/Companyaccount.jsx",
    "Frontend/src/views/ERP/Customeraccount.jsx",
    "Frontend/src/views/ERP/Customerbrandvisibilit.jsx",
    "Frontend/src/views/ERP/Customerinvoice.jsx",
    "Frontend/src/views/ERP/Customerinvoiceitem.jsx",
    "Frontend/src/views/ERP/Customerproductvisibilit.jsx",
    "Frontend/src/views/ERP/Fileoperation.jsx",
    "Frontend/src/views/ERP/Order.jsx",
    "Frontend/src/views/ERP/Orderdetail.jsx",
    "Frontend/src/views/ERP/Packagin.jsx",
    "Frontend/src/views/ERP/Packagingproblem.jsx",
    "Frontend/src/views/ERP/Packinglist.jsx",
    "Frontend/src/views/ERP/Packinglistbox.jsx",
    "Frontend/src/views/ERP/Packinglistboxitem.jsx",
    "Frontend/src/views/ERP/Paymentnote.jsx",
    "Frontend/src/views/ERP/Problem.jsx",
    "Frontend/src/views/ERP/Problemitem.jsx",
    "Frontend/src/views/ERP/Producthistor.jsx",
    "Frontend/src/views/ERP/Productrule.jsx",
    "Frontend/src/views/ERP/Productstatus.jsx",
    "Frontend/src/views/ERP/Searchresult.jsx",
    "Frontend/src/views/ERP/Supplieraccount.jsx",
    "Frontend/src/views/ERP/Supplierinvoice.jsx",
    "Frontend/src/views/ERP/Supplierinvoiceitem.jsx",
    "Frontend/src/views/ERP/Supplierorder.jsx",
    "Frontend/src/views/ERP/Supplierorderdetail.jsx",
    "Frontend/src/views/ERP/Supplierpricingrule.jsx",
    "Frontend/src/views/ERP/Supplierpricingrulecustomer.jsx",
    "Frontend/src/views/ERP/Supplierproduct.jsx",
    "Frontend/src/views/ERP/Warehouse.jsx",
    "Frontend/src/views/ERP/Warehouseaccount.jsx"
]

def update_slideover_file(filepath):
    """Update a single file with slideover improvements"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pattern 1: Add size="xl" to Slideover opening tags that don't have it
        content = re.sub(
            r'<Slideover\s*\n?\s*open=',
            r'<Slideover\n        size="xl"\n        open=',
            content
        )
        
        # Pattern 2: Make Slideover.Description scrollable
        content = re.sub(
            r'<Slideover\.Description className="relative">',
            r'<Slideover.Description className="relative overflow-y-auto max-h-[calc(100vh-200px)]">',
            content
        )
        
        # Pattern 3: Change grid from 1 column to 2 columns
        content = re.sub(
            r'grid grid-cols-1 gap-4',
            r'grid grid-cols-2 gap-4',
            content
        )
        
        # Write back the updated content
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Updated: {filepath}")
        return True
        
    except Exception as e:
        print(f"Error updating {filepath}: {e}")
        return False

def main():
    """Main function to update all files"""
    updated_count = 0
    
    for file_path in files:
        if os.path.exists(file_path):
            if update_slideover_file(file_path):
                updated_count += 1
        else:
            print(f"File not found: {file_path}")
    
    print(f"\nCompleted: {updated_count}/{len(files)} files updated")

if __name__ == "__main__":
    main()
