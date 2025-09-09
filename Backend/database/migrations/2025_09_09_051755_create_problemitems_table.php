<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('problemitems', function (Blueprint $table) {
            $table->id();
                $table->foreignId('problem_id')->nullable();
                $table->foreign('problem_id')->references('id')->on('problems')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('product_id')->nullable();
                $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict')->onUpdate('cascade');
                $table->string('supplier_code')->nullable();
                $table->string('brand')->nullable();
                $table->string('brand_code')->nullable();
                $table->string('oe_code')->nullable();
                $table->text('description')->nullable();
                $table->integer('qty');
                $table->string('box_name')->nullable();
                $table->decimal('purchase_price',10,2)->nullable();
                $table->decimal('customer_price',10,2)->nullable();
                $table->string('problem_type');
                $table->string('solution_type')->nullable();
                
            $table->timestamps();
        });
    }
};
