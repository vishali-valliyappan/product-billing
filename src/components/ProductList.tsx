import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../features/cart/cartSlice";
import type { Product } from "../types";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";

const products: Product[] = [
  { id: 1, name: "Bread", price: 1.1 },
  { id: 2, name: "Milk", price: 0.5 },
  { id: 3, name: "Cheese", price: 0.9 },
  { id: 4, name: "Soup", price: 0.6 },
  { id: 5, name: "Butter", price: 1.2 },
];

const ProductList = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);

  //getQuantity
  const getQuantity = (productId: number) => {
    const item = cartItems.find((i: any) => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="flex justify-center">
      <div className="w-80 bg-white rounded-md shadow border border-gray-200 p-4 h-[50vh]">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <ul>
          {products.map((p) => {
            const quantity = getQuantity(p.id);
            return (
              <li
                key={p.id}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <span className="text-gray-900">{p.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium">
                    £{p.price.toFixed(2)}
                  </span>

                  {quantity === 0 ? (
                    <button
                      onClick={() => dispatch(addToCart(p))}
                      className="px-3 py-1 rounded text-sm font-semibold transition bg-gray-300 text-gray-600 hover:bg-blue-700 hover:text-white"
                    >
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 border border-gray rounded-[6px]">
                      <button
                        onClick={() => dispatch(removeFromCart(p.id))}
                        className="px-2 py-1  text-gray-700   font-bold"
                      >
                        <Minus className="size-[15px] hover:text-blue-500" />
                      </button>
                      <span className="font-semibold">{quantity}</span>
                      <button
                        onClick={() => dispatch(addToCart(p))}
                        className="px-2 py-1  text-gray-700   font-bold"
                      >
                        <Plus className="size-[15px] hover:text-blue-500" />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ProductList;
