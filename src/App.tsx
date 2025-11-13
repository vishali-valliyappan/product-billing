import { useState } from "react";
import "./App.css";
import BasketPage from "./components/Basket";
import ProductList from "./components/ProductList";

function App() {
  const [page, setPage] = useState<"products" | "basket">("products");
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-[#2563EB] text-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Supermarket</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setPage("products")}
            className={`px-4 py-2 rounded font-[600] ${
              page === "products"
                ? "bg-white text-blue-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setPage("basket")}
            className={`px-4 py-2 rounded font-[600] ${
              page === "basket"
                ? "bg-white text-blue-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Go to Cart
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main className="p-6">
        {page === "products" && <ProductList />}
        {page === "basket" && <BasketPage />}
      </main>
    </div>
  );
}

export default App;
