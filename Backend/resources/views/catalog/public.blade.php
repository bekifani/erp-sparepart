<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Catalog - {{ config('app.name', 'KOMIPARTS') }}</title>
    <meta name="description" content="Browse our complete product catalog for auto spare parts">
    <meta name="robots" content="index, follow">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    
    <style>
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    </style>
</head>
<body class="bg-gray-50">
    <div id="catalog-app"></div>
    
    <!-- React App Mount Point -->
    <script>
        // Configuration for the React app
        window.APP_CONFIG = {
            apiUrl: '{{ config('app.url') }}/api',
            mediaUrl: '{{ config('app.url') }}/storage',
            locale: '{{ app()->getLocale() }}'
        };
    </script>
    
    <!-- Load React App -->
    <script type="module">
        // This will be handled by your React build system
        // For now, we'll create a simple fallback
        document.getElementById('catalog-app').innerHTML = `
            <div class="min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-gray-900 mb-4">Product Catalog</h1>
                    <p class="text-gray-600 mb-8">Loading our complete product catalog...</p>
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            </div>
        `;
    </script>
</body>
</html>
