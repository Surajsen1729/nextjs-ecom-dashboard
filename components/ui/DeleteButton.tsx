"use client";

import { deleteProduct } from "@/actions/productActions"; // We need to make sure this action exists
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => deleteProduct(id))}
      disabled={isPending}
      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition disabled:opacity-50"
    >
      <Trash2 size={20} />
    </button>
  );
}