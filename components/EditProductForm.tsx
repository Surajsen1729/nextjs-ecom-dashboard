"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { editProduct } from "@/actions/productActions";
import ImageUpload from "@/components/ui/ImageUpload";
import { useState, useTransition } from "react";

// 1. Define the Schema
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").regex(/^[a-zA-Z\s]+$/, "Letters only"),
  description: z.string().min(5, "Description too short"),
  price: z.coerce.number().min(0.1, "Invalid price"),
  stock: z.coerce.number().int().min(0, "Invalid stock"),
  imageUrl: z.string().min(1, "Image is required"),
});

// 2. Infer the Type from the Schema
type ProductFormValues = z.infer<typeof productSchema>;

// 3. Define props for the component
interface EditProductFormProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
  };
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // 4. Initialize Form (Removed the <ProductFormValues> generic to fix the TS error)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price, // These are numbers, but Zod coerce handles them fine
      stock: product.stock,
      imageUrl: product.imageUrl,
    },
  });

  const imageUrl = watch("imageUrl");

  const onSubmit = (data: ProductFormValues) => {
    setError(null);
    const formData = new FormData();
    
    // Convert data to standard FormData for the Server Action
    Object.entries(data).forEach(([key, val]) => {
      formData.append(key, String(val));
    });

    startTransition(async () => {
      try {
        await editProduct(product.id, formData);
      } catch (e) {
        setError("Failed to update product");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h2>

      {/* NAME */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input {...register("name")} className="w-full border p-2 rounded" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
      </div>

      {/* DESCRIPTION */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea {...register("description")} className="w-full border p-2 rounded" rows={3} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message as string}</p>}
      </div>

      {/* PRICE & STOCK */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price ($)</label>
          <input type="number" step="0.01" {...register("price")} className="w-full border p-2 rounded" />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message as string}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input type="number" {...register("stock")} className="w-full border p-2 rounded" />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message as string}</p>}
        </div>
      </div>

      {/* IMAGE UPLOAD */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Product Image</label>
        {/* Pass the current image URL and a function to update it */}
        <ImageUpload value={imageUrl} onChange={(url) => setValue("imageUrl", url)} />
        {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl.message as string}</p>}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {isPending ? "Updating..." : "Save Changes"}
      </button>
    </form>
  );
}