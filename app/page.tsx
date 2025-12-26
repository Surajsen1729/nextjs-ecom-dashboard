import { prisma } from "@/lib/db";
import Link from "next/link";
import DeleteButton from "@/components/ui/DeleteButton";
import ProductChart from "@/components/charts/ProductChart"; // <-- 1. Import this
import StockAdjuster from "@/components/ui/StockAdjuster";
import { Trash2, Pencil } from "lucide-react"; // Add Pencil




export default async function Dashboard() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link
          href="/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-6 bg-white border rounded shadow-sm">
          <h3 className="text-gray-500 text-sm">Total Inventory Items</h3>
          <p className="text-3xl font-bold">{totalStock}</p>
        </div>
        <div className="p-6 bg-white border rounded shadow-sm">
          <h3 className="text-gray-500 text-sm">Total Inventory Value</h3>
          <p className="text-3xl font-bold">${totalValue.toFixed(2)}</p>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="mb-8">
        <ProductChart data={products} />
      </div>

      {/* PRODUCT TABLE */}
      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium">Image</th>
              <th className="p-4 font-medium">Product Name</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      // FORCE SIZE with inline styles
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                      className="border border-gray-200"
                    />
                  ) : (
                    <div 
                      style={{ width: '50px', height: '50px' }} 
                      className="bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400"
                    >
                      No Img
                    </div>
                  )}
                </td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">${product.price.toFixed(2)}</td>
                <td className="p-4">
                  <StockAdjuster id={product.id} stock={product.stock} />
                </td>
               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* WRAPPER DIV: This guarantees the layout works */}
                  <div className="flex items-center justify-end gap-6">
                    
                    {/* EDIT BUTTON */}
                    <Link 
                      href={`/products/${product.id}/edit`}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
                      title="Edit Product">
                      <Pencil size={20} />
                    </Link>

                    {/* DELETE BUTTON */}
                    <DeleteButton id={product.id} />
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}