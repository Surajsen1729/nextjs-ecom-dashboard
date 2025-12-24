"use client";

import { updateStock } from "@/actions/productActions";
import { useTransition } from "react";

interface StockAdjusterProps {
  id: string;
  stock: number;
}

export default function StockAdjuster({ id, stock }: StockAdjusterProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (adjustment: number) => {
    startTransition(() => {
      updateStock(id, stock + adjustment);
    });
  };

  return (
    // 1. Force the container to be at least 140px wide so it doesn't get squashed
    <div className="flex items-center" style={{ minWidth: '140px' }}>
      
      {/* MINUS BUTTON */}
      <button
        onClick={() => handleUpdate(-1)}
        disabled={isPending || stock <= 0}
        className="w-10 h-10 flex items-center justify-center rounded border border-gray-400 bg-white hover:bg-gray-100 text-xl font-bold text-gray-700 disabled:opacity-50"
      >
        -
      </button>

      {/* NUMBER DISPLAY */}
      {/* 2. Force 20px margin on left and right using inline styles */}
      <span 
        className={`font-mono font-bold text-lg text-center ${isPending ? "text-gray-400" : "text-gray-900"}`}
        style={{ width: '50px', margin: '0 20px' }}
      >
        {stock}
      </span>

      {/* PLUS BUTTON */}
      <button
        onClick={() => handleUpdate(1)}
        disabled={isPending}
        className="w-10 h-10 flex items-center justify-center rounded border border-gray-400 bg-white hover:bg-gray-100 text-xl font-bold text-gray-700 disabled:opacity-50"
      >
        +
      </button>
    </div>
  );
}