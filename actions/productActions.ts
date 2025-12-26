'use server'

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";



// 1. Define the rules for a Product (Validation)
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.coerce.number().min(0.1, "Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  description: z.string().min(5, "Description is too short"),
  imageUrl: z.string().optional(), // We will handle images later
});

// 2. The "Create Product" Function
export async function createProduct(formData: FormData) {
  // Extract data from the form
  const rawData = {
    name: formData.get("name"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl") as string || "",
  };

  // Validate the data
  const validatedData = productSchema.safeParse(rawData);

  if (!validatedData.success) {
    console.error(validatedData.error.flatten());
    // In a real app, you would return errors to the form here
    return;
  }

  // Save to Database
  await prisma.product.create({
    data: validatedData.data,
  });

  // Refresh the product list and go back to home
  revalidatePath("/");
  redirect("/");
}

// 3. The "Delete Product" Function
export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
}

export async function updateStock(id: string, newStock: number) {
  // 1. Prevent negative stock
  if (newStock < 0) return;

  // 2. Update the database
  await prisma.product.update({
    where: { id },
    data: { stock: newStock },
  });

  // 3. Refresh the UI
  revalidatePath("/");
}

// ... inside actions/productActions.ts

export async function editProduct(id: string, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    stock: parseInt(formData.get("stock") as string),
    imageUrl: formData.get("imageUrl") as string,
  };

  // 1. Validate using the same schema (letters only, etc.)
  const validated = productSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  // 2. Update Database
  await prisma.product.update({
    where: { id },
    data: validated.data,
  });

  // 3. Refresh Cache & Redirect
  revalidatePath("/");
  redirect("/");
}

