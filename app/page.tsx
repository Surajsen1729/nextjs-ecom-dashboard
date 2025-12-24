import { prisma } from "@/lib/db";
import Link from "next/link";
import DeleteButton from "@/components/ui/DeleteButton";
import ProductChart from "@/components/charts/ProductChart"; // <-- 1. Import this
import StockAdjuster from "@/components/ui/StockAdjuster";

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
                <td className="p-4">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded border" />
                    ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded border"></div>
                    )}
                </td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">${product.price.toFixed(2)}</td>
                <td className="p-4">
                  <StockAdjuster id={product.id} stock={product.stock} />
                </td>
                <td className="p-4 text-right">
                  <DeleteButton id={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}