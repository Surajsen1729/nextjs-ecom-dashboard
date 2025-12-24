"use client";

import { createProduct } from "@/actions/productActions";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";
import { useState } from "react";
import { ChevronRight, ChevronLeft, Check, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 1. Define the Validation Schema (Same as Server)
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.coerce.number().min(0.1, "Price must be at least $0.10"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  imageUrl: z.string().min(1, "Product image is required"),
});

// Type inference
type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const [step, setStep] = useState(1);

  // 2. Setup React Hook Form with Zod
  const {
    register,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm({                               // <--- FIXED: Type removed
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {                          // <--- NEW: Defaults added
      name: "",
      description: "",
      price: 0,
      stock: 0,
      imageUrl: "",
    },
  });

  const imageUrl = watch("imageUrl");

  // 3. Smart "Next" Button
  const nextStep = async () => {
    let valid = false;

    // Validate only the fields visible in the current step
    if (step === 1) {
      valid = await trigger(["name", "description"]);
    } else if (step === 2) {
      valid = await trigger(["price", "stock"]);
    }

    if (valid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline mb-2 block">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      {/* PROGRESS BAR */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>
        <div
          className={`absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 transition-all duration-300`}
          style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
        ></div>

        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step >= num ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            {step > num ? <Check size={16} /> : num}
          </div>
        ))}
      </div>

      {/* FORM START */}
      <form action={createProduct} className="bg-white p-8 border rounded shadow-sm min-h-[450px] flex flex-col justify-between">
        
        {/* STEP 1: BASIC DETAILS */}
        <div className={step === 1 ? "block" : "hidden"}>
          <h2 className="text-xl font-semibold mb-4">Step 1: Basic Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                {...register("name")}
                placeholder="e.g. Wireless Mouse"
                className={`w-full border p-2 rounded outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-500'}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/> {errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                {...register("description")}
                placeholder="Product details..."
                className={`w-full border p-2 rounded h-32 outline-none focus:ring-2 ${errors.description ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-500'}`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/> {errors.description.message}</p>}
            </div>
          </div>
        </div>

        {/* STEP 2: INVENTORY */}
        <div className={step === 2 ? "block" : "hidden"}>
          <h2 className="text-xl font-semibold mb-4">Step 2: Inventory & Pricing</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                className={`w-full border p-2 rounded outline-none focus:ring-2 ${errors.price ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-500'}`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/> {errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Qty</label>
              <input
                type="number"
                {...register("stock")}
                className={`w-full border p-2 rounded outline-none focus:ring-2 ${errors.stock ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-500'}`}
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/> {errors.stock.message}</p>}
            </div>
          </div>
        </div>

        {/* STEP 3: MEDIA */}
        <div className={step === 3 ? "block" : "hidden"}>
          <h2 className="text-xl font-semibold mb-4">Step 3: Product Image</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Upload Image</label>
            {/* Connect ImageUpload to React Hook Form */}
            <ImageUpload 
                value={imageUrl || ""} 
                onChange={(url) => setValue("imageUrl", url, { shouldValidate: true })} 
            />
            {/* Hidden Input to actually submit the data to server action */}
            <input type="hidden" value={imageUrl || ""} name="imageUrl" />
            
            {errors.imageUrl && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/> {errors.imageUrl.message}</p>}
          </div>
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
            >
              <ChevronLeft size={20} className="mr-1" /> Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium transition"
            >
              Next <ChevronRight size={20} className="ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium transition"
            >
              Submit Product <Check size={20} className="ml-1" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}