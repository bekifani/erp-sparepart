<?php

namespace App\Http\Controllers;

use App\Models\Productstatus;
use App\Models\ProductSubStatus;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class ProductStatusController extends Controller
{
    /**
     * Display a listing of product statuses
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $sortBy = 'sort_order';
            $sortDir = 'asc';
            
            // Handle sorting from request
            if ($request->has('sort') && is_array($request->sort) && count($request->sort) > 0) {
                $sortBy = $request->sort[0]['field'] ?? 'sort_order';
                $sortDir = $request->sort[0]['dir'] ?? 'asc';
            }
            
            $perPage = $request->query('size', 10);
            $filters = $request->get('filter', []);
            
            $query = Productstatus::with('subStatuses');
            
            // Apply sorting
            $query->orderBy($sortBy, $sortDir);
            
            // Filter by type if specified
            if ($request->has('type')) {
                if ($request->type === 'core') {
                    $query->coreStatuses();
                } elseif ($request->type === 'custom') {
                    $query->customStatuses();
                }
            } else {
                $query->where('is_active', true);
            }
            
            // Apply filters from table
            if ($filters && is_array($filters)) {
                foreach ($filters as $filter) {
                    $field = $filter['field'] ?? '';
                    $operator = $filter['type'] ?? 'like';
                    $searchTerm = $filter['value'] ?? '';
                    
                    if ($field && $searchTerm) {
                        if ($operator == 'like') {
                            $searchTerm = '%' . $searchTerm . '%';
                        }
                        $query->where($field, $operator, $searchTerm);
                    }
                }
            }
            
            // Search functionality
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('status_name_en', 'LIKE', "%{$search}%")
                      ->orWhere('status_name_ch', 'LIKE', "%{$search}%")
                      ->orWhere('status_name_az', 'LIKE', "%{$search}%")
                      ->orWhere('status_key', 'LIKE', "%{$search}%");
                });
            }
            
            // Get paginated results
            $statuses = $query->paginate($perPage);
            
            // Add localized names to response
            $statuses->getCollection()->each(function ($status) {
                $status->localized_name = $status->getLocalizedNameAttribute();
                $status->localized_description = $status->getLocalizedDescriptionAttribute();
            });
            
            // Return in the format expected by the existing table component
            $data = [
                "data" => $statuses->toArray(),
                'current_page' => $statuses->currentPage(),
                'total_pages' => $statuses->lastPage(),
                'per_page' => $perPage
            ];
            
            return response()->json($data);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving product statuses: ' . $e->getMessage(),
                'data' => ['data' => []] // Ensure we always return an array structure
            ], 500);
        }
    }

    /**
     * Store a newly created product status (only for sub-statuses)
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'parent_status_id' => 'required|exists:productstatuses,id',
                'sub_status_key' => 'required|string|unique:product_sub_statuses,sub_status_key',
                'status_name_en' => 'required|string|max:255',
                'status_name_ch' => 'nullable|string|max:255',
                'status_name_az' => 'nullable|string|max:255',
                'description_en' => 'nullable|string',
                'description_ch' => 'nullable|string',
                'description_az' => 'nullable|string',
                'color_code' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
                'sort_order' => 'nullable|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Get the parent status to validate it's a core status
            $parentStatus = Productstatus::find($request->parent_status_id);
            if (!$parentStatus->is_core_status) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sub-statuses can only be created under core statuses'
                ], 400);
            }

            // Auto-generate sort order if not provided
            if (!$request->has('sort_order')) {
                $maxOrder = ProductSubStatus::where('parent_status_id', $request->parent_status_id)
                    ->max('sort_order') ?? 0;
                $request->merge(['sort_order' => $maxOrder + 1]);
            }

            $subStatus = ProductSubStatus::create($request->all());

            return response()->json([
                'success' => true,
                'data' => $subStatus->load('parentStatus'),
                'message' => 'Sub-status created successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating sub-status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified product status
     */
    public function show($id): JsonResponse
    {
        try {
            $status = Productstatus::with('subStatuses')->find($id);
            
            if (!$status) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product status not found'
                ], 404);
            }

            $status->localized_name = $status->getLocalizedNameAttribute();
            $status->localized_description = $status->getLocalizedDescriptionAttribute();

            return response()->json([
                'success' => true,
                'data' => $status,
                'message' => 'Product status retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving product status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified product status
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $status = Productstatus::find($id);
            
            if (!$status) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product status not found'
                ], 404);
            }

            // Validation rules depend on whether it's a core status or not
            $rules = [
                'status_name_en' => 'required|string|max:255',
                'status_name_ch' => 'nullable|string|max:255',
                'status_name_az' => 'nullable|string|max:255',
                'description_en' => 'nullable|string',
                'description_ch' => 'nullable|string',
                'description_az' => 'nullable|string',
                'color_code' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/'
            ];

            // Core statuses have restricted fields that can be updated
            if (!$status->is_core_status) {
                $rules['status_key'] = [
                    'required',
                    'string',
                    Rule::unique('productstatuses')->ignore($id)
                ];
                $rules['sort_order'] = 'nullable|integer|min:0';
                $rules['is_active'] = 'boolean';
            }

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update only allowed fields for core statuses
            $updateData = $request->only([
                'status_name_en', 'status_name_ch', 'status_name_az',
                'description_en', 'description_ch', 'description_az',
                'color_code'
            ]);

            if (!$status->is_core_status) {
                $updateData = array_merge($updateData, $request->only([
                    'status_key', 'sort_order', 'is_active'
                ]));
            }

            $status->update($updateData);

            return response()->json([
                'success' => true,
                'data' => $status->fresh()->load('subStatuses'),
                'message' => 'Product status updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating product status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified product status (only non-core statuses)
     */
    public function destroy($id): JsonResponse
    {
        try {
            $status = Productstatus::find($id);
            
            if (!$status) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product status not found'
                ], 404);
            }

            if ($status->is_core_status) {
                return response()->json([
                    'success' => false,
                    'message' => 'Core statuses cannot be deleted'
                ], 400);
            }

            $status->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product status deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting product status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sub-statuses for a specific parent status
     */
    public function getSubStatuses($parentId): JsonResponse
    {
        try {
            $parentStatus = Productstatus::find($parentId);
            
            if (!$parentStatus) {
                return response()->json([
                    'success' => false,
                    'message' => 'Parent status not found'
                ], 404);
            }

            $subStatuses = $parentStatus->subStatuses()->get();
            
            $subStatuses->each(function ($subStatus) {
                $subStatus->localized_name = $subStatus->getLocalizedNameAttribute();
                $subStatus->localized_description = $subStatus->getLocalizedDescriptionAttribute();
                $subStatus->full_name = $subStatus->getFullNameAttribute();
            });

            return response()->json([
                'success' => true,
                'data' => $subStatuses,
                'message' => 'Sub-statuses retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving sub-statuses: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a sub-status
     */
    public function updateSubStatus(Request $request, $subStatusId): JsonResponse
    {
        try {
            $subStatus = ProductSubStatus::find($subStatusId);
            
            if (!$subStatus) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sub-status not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'sub_status_key' => [
                    'required',
                    'string',
                    Rule::unique('product_sub_statuses')->ignore($subStatusId)
                ],
                'status_name_en' => 'required|string|max:255',
                'status_name_ch' => 'nullable|string|max:255',
                'status_name_az' => 'nullable|string|max:255',
                'description_en' => 'nullable|string',
                'description_ch' => 'nullable|string',
                'description_az' => 'nullable|string',
                'color_code' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
                'sort_order' => 'nullable|integer|min:0',
                'is_active' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $subStatus->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $subStatus->fresh()->load('parentStatus'),
                'message' => 'Sub-status updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating sub-status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a sub-status
     */
    public function destroySubStatus($subStatusId): JsonResponse
    {
        try {
            $subStatus = ProductSubStatus::find($subStatusId);
            
            if (!$subStatus) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sub-status not found'
                ], 404);
            }

            $subStatus->delete();

            return response()->json([
                'success' => true,
                'message' => 'Sub-status deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting sub-status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get workflow information (next/previous statuses)
     */
    public function getWorkflow($statusId): JsonResponse
    {
        try {
            $status = Productstatus::find($statusId);
            
            if (!$status) {
                return response()->json([
                    'success' => false,
                    'message' => 'Status not found'
                ], 404);
            }

            $workflow = [
                'current' => $status,
                'next' => $status->getNextStatus(),
                'previous' => $status->getPreviousStatus(),
                'locks_editing' => $status->locksEditing()
            ];

            return response()->json([
                'success' => true,
                'data' => $workflow,
                'message' => 'Workflow information retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving workflow: ' . $e->getMessage()
            ], 500);
        }
    }
}
