<?php

namespace App\Imports;

use App\Models\Stock;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\ToCollection;
class PackedItemsImport implements ToCollection
{
    private $items = [];
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            if ($row[0] !== 'Roll Number') { // Skip the header row
                $range = explode('-', $row[0]);
                $numberOfRolls = count($range) > 1 ? $range[1] - $range[0] + 1 : 1;

                $this->items[] = [
                    'roll_number' => $row[0],
                    'item_code' => $row[1],
                    'color' => $row[2],
                    'item_name' => $row[3],
                    'meters' => $row[5],
                    'unit' => $row[6],
                    'number_of_rolls' => $numberOfRolls,
                    'total_meters' => $row[7],
                ];
            }
        }
    }
    public function getItems()
    {
        return $this->items;
    }
}
