<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Carmodel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
class CarmodelController extends BaseController
{
    protected $searchableColumns = ['car_model', 'additional_note'];

    public function index(Request $request)
    {
        $sortBy = 'id';
        $sortDir = 'desc';
        if($request['sort']){
            $sortBy = $request['sort'][0]['field'];
            $sortDir = $request['sort'][0]['dir'];
        }
        $perPage = $request->query('size', 10); 
        $filters = $request['filter'];
        
        $query = Carmodel::select(
            'carmodels.*',
            DB::raw('COALESCE(crosscar_counts.product_qty, 0) as product_qty')
        )
        ->leftJoin(
            DB::raw('(SELECT car_model_id, COUNT(*) as product_qty FROM crosscars GROUP BY car_model_id) as crosscar_counts'),
            'carmodels.id', '=', 'crosscar_counts.car_model_id'
        )
        ->orderBy($sortBy, $sortDir);
        
        if($filters){
            foreach ($filters as $filter) {
                $field = $filter['field'];
                $operator = $filter['type'];
                $searchTerm = $filter['value'];
                if ($operator == 'like') {
                    $searchTerm = '%' . $searchTerm . '%';
                }
                $query->where($field, $operator, $searchTerm);
            }
        }
        $carmodel = $query->paginate($perPage); 
        $data = [
            "data" => $carmodel->toArray(), 
            'current_page' => $carmodel->currentPage(),
            'total_pages' => $carmodel->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_carmodels(){
        $data = Carmodel::select(
            'carmodels.*',
            DB::raw('COALESCE(crosscar_counts.product_qty, 0) as product_qty')
        )
        ->leftJoin(
            DB::raw('(SELECT car_model_id, COUNT(*) as product_qty FROM crosscars GROUP BY car_model_id) as crosscar_counts'),
            'carmodels.id', '=', 'crosscar_counts.car_model_id'
        )
        ->get();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        
        // Smart search with fuzzy matching and relevance scoring
        $results = Carmodel::select(
                'carmodels.id as value',
                'carmodels.car_model',
                'carmodels.brand',
                'carmodels.model',
                'carmodels.year',
                'carmodels.additional_note',
                DB::raw('COALESCE(crosscar_counts.product_qty, 0) as product_qty'),
                // Add relevance scoring
                DB::raw("
                    CASE 
                        WHEN carmodels.car_model LIKE ? THEN 100
                        WHEN carmodels.car_model LIKE ? THEN 80
                        WHEN carmodels.brand LIKE ? THEN 70
                        WHEN carmodels.model LIKE ? THEN 60
                        WHEN carmodels.year LIKE ? THEN 50
                        WHEN carmodels.additional_note LIKE ? THEN 30
                        ELSE 10
                    END as relevance
                ")
            )
            ->leftJoin(
                DB::raw('(SELECT car_model_id, COUNT(*) as product_qty FROM crosscars GROUP BY car_model_id) as crosscar_counts'),
                'carmodels.id', '=', 'crosscar_counts.car_model_id'
            )
            ->where(function ($query) use ($searchTerm) {
                $query->where('carmodels.car_model', 'like', "%$searchTerm%")
                      ->orWhere('carmodels.brand', 'like', "%$searchTerm%")
                      ->orWhere('carmodels.model', 'like', "%$searchTerm%")
                      ->orWhere('carmodels.year', 'like', "%$searchTerm%")
                      ->orWhere('carmodels.additional_note', 'like', "%$searchTerm%");
            })
            ->orderBy('relevance', 'desc')
            ->orderBy('product_qty', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($item) use ($searchTerm) {
                // Highlight matching text
                $highlightedModel = $this->highlightText($item->car_model, $searchTerm);
                $highlightedBrand = $this->highlightText($item->brand ?? '', $searchTerm);
                
                return [
                    'value' => $item->value,
                    'text' => $item->car_model,
                    'car_model' => $item->car_model,
                    'brand' => $item->brand,
                    'model' => $item->model,
                    'year' => $item->year,
                    'additional_note' => $item->additional_note,
                    'product_qty' => $item->product_qty,
                    'relevance' => $item->relevance,
                    'highlighted_model' => $highlightedModel,
                    'highlighted_brand' => $highlightedBrand,
                    'display_text' => $this->formatDisplayText($item, $searchTerm)
                ];
            });

        return response()->json($results);
    }
    
    private function highlightText($text, $searchTerm) {
        if (empty($text) || empty($searchTerm)) {
            return $text;
        }
        
        $pattern = '/(' . preg_quote($searchTerm, '/') . ')/i';
        return preg_replace($pattern, '<mark>$1</mark>', $text);
    }
    
    private function formatDisplayText($item, $searchTerm) {
        $parts = [];
        
        if ($item->brand) {
            $parts[] = $this->highlightText($item->brand, $searchTerm);
        }
        if ($item->model) {
            $parts[] = $this->highlightText($item->model, $searchTerm);
        }
        if ($item->year) {
            $parts[] = $this->highlightText($item->year, $searchTerm);
        }
        
        $mainText = implode(' ', $parts);
        if ($item->product_qty > 0) {
            $mainText .= " ({$item->product_qty} products)";
        }
        
        return $mainText;
    }
    
    public function smartSearch(Request $request)
    {
        $searchTerm = $request->get('q', '');
        $limit = $request->get('limit', 10);
        
        if (empty($searchTerm)) {
            return response()->json([]);
        }
        
        // Enhanced smart search with multiple matching strategies
        $results = Carmodel::select(
                'carmodels.id as value',
                'carmodels.car_model',
                'carmodels.brand',
                'carmodels.model',
                'carmodels.year',
                'carmodels.additional_note',
                DB::raw('COALESCE(crosscar_counts.product_qty, 0) as product_qty'),
                // Advanced relevance scoring
                DB::raw("
                    CASE 
                        WHEN carmodels.car_model = ? THEN 1000
                        WHEN carmodels.car_model LIKE ? THEN 900
                        WHEN carmodels.brand = ? THEN 800
                        WHEN carmodels.brand LIKE ? THEN 700
                        WHEN carmodels.model = ? THEN 600
                        WHEN carmodels.model LIKE ? THEN 500
                        WHEN carmodels.year = ? THEN 400
                        WHEN carmodels.year LIKE ? THEN 300
                        WHEN carmodels.additional_note LIKE ? THEN 200
                        ELSE 100
                    END as relevance
                ")
            )
            ->leftJoin(
                DB::raw('(SELECT car_model_id, COUNT(*) as product_qty FROM crosscars GROUP BY car_model_id) as crosscar_counts'),
                'carmodels.id', '=', 'crosscar_counts.car_model_id'
            )
            ->where(function ($query) use ($searchTerm) {
                $query->where('carmodels.car_model', 'like', "%$searchTerm%")
                      ->orWhere('carmodels.brand', 'like', "%$searchTerm%")
                      ->orWhere('carmodels.model', 'like', "%$searchTerm%")
                      ->orWhere('carmodels.year', 'like', "%$searchTerm%")
                      ->orWhere('carmodels.additional_note', 'like', "%$searchTerm%");
            })
            ->orderBy('relevance', 'desc')
            ->orderBy('product_qty', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($item) use ($searchTerm) {
                return [
                    'value' => $item->value,
                    'text' => $item->car_model,
                    'car_model' => $item->car_model,
                    'brand' => $item->brand,
                    'model' => $item->model,
                    'year' => $item->year,
                    'additional_note' => $item->additional_note,
                    'product_qty' => $item->product_qty,
                    'relevance' => $item->relevance,
                    'display_text' => $this->formatSmartDisplayText($item, $searchTerm)
                ];
            });

        return response()->json($results);
    }
    
    private function formatSmartDisplayText($item, $searchTerm) {
        $parts = [];
        
        if ($item->brand) {
            $parts[] = $item->brand;
        }
        if ($item->model) {
            $parts[] = $item->model;
        }
        if ($item->year) {
            $parts[] = "({$item->year})";
        }
        
        $mainText = implode(' ', $parts);
        if ($item->product_qty > 0) {
            $mainText .= " - {$item->product_qty} products";
        }
        
        return $mainText;
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "car_model"=>"required|string|max:255",
          "additional_note"=>"nullable|string",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $carmodel = Carmodel::create($validated);
        return $this->sendResponse($carmodel, "carmodel created succesfully");
    }

    public function show($id)
    {
        $carmodel = Carmodel::select(
            'carmodels.*',
            DB::raw('COALESCE(crosscar_counts.product_qty, 0) as product_qty')
        )
        ->leftJoin(
            DB::raw('(SELECT car_model_id, COUNT(*) as product_qty FROM crosscars GROUP BY car_model_id) as crosscar_counts'),
            'carmodels.id', '=', 'crosscar_counts.car_model_id'
        )
        ->where('carmodels.id', $id)
        ->firstOrFail();
        return $this->sendResponse($carmodel, "");
    }


    public function update(Request $request, $id)
    {
        $carmodel = Carmodel::findOrFail($id);
         $validationRules = [
            //for update

          
          "car_model"=>"required|string|max:255",
          "additional_note"=>"nullable|string",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $carmodel->update($validated);
        return $this->sendResponse($carmodel, "carmodel updated successfully");
    }

    public function destroy($id)
    {
        $carmodel = Carmodel::findOrFail($id);
        $carmodel->delete();





        //delete files uploaded
        return $this->sendResponse(1, "carmodel deleted succesfully");
    }

    public function deleteFile($filePath) {
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
            return true;
        } else {
            return false;
        }
    }
}
