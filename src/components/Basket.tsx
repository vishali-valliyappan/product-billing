import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectSubtotal,
  selectOffers,
  selectTotal,
  addToCart,
  removeFromCart,
  clearCart,
  //   decrementFromCart,
} from "../features/cart/cartSlice";
import { firestore } from "../firebase";
import { addDoc, collection } from "@firebase/firestore";
import { ShoppingCart } from "lucide-react";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";
import toast from "react-hot-toast";
interface SavedOrder {
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    offer: string | null;
    saving: number;
  }[];
  subtotal: number;
  totalSavings: number;
  total: number;
  createdAt: Date;
}

const BasketPage: React.FC = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const offers = useSelector(selectOffers);
  const total = useSelector(selectTotal);
  const [savedOrder, setSavedOrder] = useState<SavedOrder | null>(null);

  // Helper to check if product is in cart and get quantity
  const getQuantity = (id: number) => {
    const found = items.find((item) => item.id === id);
    return found ? found.quantity : 0;
  };

  const saveBasket = async () => {
    try {
      const orderData = {
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          offer:
            offers.find((o) => o.productId === item.id)?.description || null,
          saving: offers.find((o) => o.productId === item.id)?.saving || 0,
        })),
        subtotal,
        totalSavings: offers.reduce((sum, o) => sum + o.saving, 0),
        total,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(firestore, "orders"), orderData);
      toast.success(`Order saved with ID: ${docRef.id}`);
      dispatch(clearCart());

      // Save locally to show the bill
      setSavedOrder(orderData);
    } catch (error) {
      console.error("Error saving basket:", error);
      toast.error("Error saving basket:");

      alert("Failed to save order.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-screen bg-gray-50">
      {/* Basket */}
      <div className="bg-white p-4 rounded shadow flex flex-col">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Basket</h2>

        {items.length === 0 ? (
          <div className="flex justify-center gap-[1rem] h-[100%] items-center">
            <p>Your cart is empty.</p> <ShoppingCart />
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 flex-1 overflow-auto">
              {items.map((item) => {
                // Find saving if any for this item
                const offer = offers.find((o) => o.productId === item.id);
                const itemSubtotal = item.price * item.quantity;
                const savingAmount = offer ? offer.saving : 0;
                const itemCostAfterSaving = itemSubtotal - savingAmount;

                return (
                  <li key={item.id} className="py-4 border-b last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <span>{item.name}</span>
                      <span className="text-gray-700">
                        £{item.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-3 mb-1">
                      <button
                        onClick={() => dispatch(addToCart(item))}
                        className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600 transition"
                      >
                        +
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="border border-blue-500 text-blue-500 rounded px-3 py-1 hover:bg-blue-500 hover:text-white transition"
                      >
                        −
                      </button>
                    </div>

                    {/* Item price breakdown */}
                    <div className="text-xs text-gray-500 mb-1 text-end">
                      Item price £{item.price.toFixed(2)} * {item.quantity} = £
                      {(item.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Savings if any */}
                    {savingAmount > 0 && (
                      <div className="text-sm text-[#0cb107f7] mb-1 text-end">
                        Savings £{savingAmount.toFixed(2)}
                      </div>
                    )}

                    {/* Item cost after savings */}
                    <div className="font-semibold text-end">
                      Item cost £{itemCostAfterSaving.toFixed(2)}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Summary */}
            <div className="mt-6 space-y-2 border-t pt-4 text-gray-900 font-semibold">
              <div className="flex justify-between">
                <span>Sub Total:</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Savings:</span>
                <span>
                  £{offers.reduce((acc, o) => acc + o.saving, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span>£{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-center bg-[#06fa0659] rounded-[6px] text-[#008000]">
                You will save £
                {offers.reduce((acc, o) => acc + o.saving, 0).toFixed(2)} on
                this order
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => dispatch(clearCart())}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 font-[600] rounded-md transition"
              >
                Clear Basket
              </button>
              <button
                onClick={saveBasket}
                className="bg-[#d8d808] hover:bg-[#b7b70a] text-black px-5 py-2 font-[600] rounded-md transition"
              >
                Checkout & Save
              </button>
            </div>
          </>
        )}
      </div>

      {savedOrder && (
        <div className="mt-8 p-6 bg-white rounded shadow relative">
          {/* Close button */}
          <button
            onClick={() => setSavedOrder(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
          >
            ×
          </button>

          <h2 className="text-xl font-semibold mb-4">Your Bill</h2>
          <ul className="divide-y divide-gray-200 mb-4">
            {savedOrder.items.map((item) => (
              <li key={item.id} className="py-2">
                <div className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
                {item.saving > 0 && (
                  <div className="text-sm text-red-600 flex justify-between">
                    <div> {item.offer}:</div>
                    <div> -£{item.saving.toFixed(2)}</div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="text-gray-900 font-semibold space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>£{savedOrder.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#0cb107f7]">
              <span>Total Savings:</span>
              <span>- £{savedOrder.totalSavings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>£{savedOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasketPage;
