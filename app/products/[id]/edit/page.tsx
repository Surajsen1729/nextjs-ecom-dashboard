import prisma from "@/lib/prisma";
import EditProductForm from "@/components/EditProductForm";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: EditPageProps) {
  // Await params for Next.js 15 strict mode compatibility
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* FIX: We spread the product properties (...product) 
         but OVERRIDE 'imageUrl' to ensure it's never null. 
      */}
      <EditProductForm 
        product={{
          ...product,
          imageUrl: product.imageUrl || "" 
        }} 
      />
    </div>
  );
}