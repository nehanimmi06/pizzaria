 import { useMemo, useState } from "react";

type Pizza = {
  id: number;
  name: string;
  category: string;
  basePrice: number;
  image: string;
};

type Topping = {
  id: number;
  name: string;
  price: number;
};

type Size = {
  name: string;
  multiplier: number;
};

type CartItem = {
  id: number;
  pizza: Pizza;
  size: Size;
  toppings: Topping[];
  quantity: number;
  totalPrice: number;
};

const pizzas: Pizza[] = [
  {
    id: 1,
    name: "Margherita",
    category: "Veg Pizza",
    basePrice: 10,
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Pepperoni Feast",
    category: "Non-Veg Pizza",
    basePrice: 14,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Veggie Supreme",
    category: "Specialty Pizza",
    basePrice: 13,
    image:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "BBQ Chicken",
    category: "Non-Veg Pizza",
    basePrice: 16,
    image:
      "https://images.unsplash.com/photo-1548365328-9f547fb0953b?q=80&w=1200&auto=format&fit=crop",
  },
];

const toppings: Topping[] = [
  { id: 1, name: "Extra Cheese", price: 2 },
  { id: 2, name: "Mushrooms", price: 1.5 },
  { id: 3, name: "Olives", price: 1.5 },
  { id: 4, name: "Jalapenos", price: 1 },
  { id: 5, name: "Chicken", price: 3 },
  { id: 6, name: "Pepperoni", price: 3 },
  { id: 7, name: "Onions", price: 1 },
  { id: 8, name: "Paneer", price: 2.5 },
];

const sizes: Size[] = [
  { name: "Small", multiplier: 1 },
  { name: "Medium", multiplier: 1.2 },
  { name: "Large", multiplier: 1.5 },
  { name: "XL", multiplier: 1.8 },
];

export default function App(): React.JSX.Element {
  const [selectedPizza, setSelectedPizza] = useState<Pizza>(pizzas[0]);
  const [selectedSize, setSelectedSize] = useState<Size>(sizes[0]);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<"Dine In" | "Takeout">(
    "Dine In"
  );

  const toggleTopping = (topping: Topping): void => {
    const exists = selectedToppings.some((t) => t.id === topping.id);

    if (exists) {
      setSelectedToppings((prev) =>
        prev.filter((t) => t.id !== topping.id)
      );
    } else {
      setSelectedToppings((prev) => [...prev, topping]);
    }
  };

  const currentPizzaPrice = useMemo(() => {
    const toppingsTotal = selectedToppings.reduce(
      (sum, topping) => sum + topping.price,
      0
    );

    return Number(
      (
        (selectedPizza.basePrice + toppingsTotal) *
        selectedSize.multiplier
      ).toFixed(2)
    );
  }, [selectedPizza, selectedSize, selectedToppings]);

  const addToCart = (): void => {
    const item: CartItem = {
      id: Date.now(),
      pizza: selectedPizza,
      size: selectedSize,
      toppings: selectedToppings,
      quantity: 1,
      totalPrice: currentPizzaPrice,
    };

    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (id: number): void => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.totalPrice * item.quantity,
      0
    );
  }, [cart]);

  const tax = subtotal * 0.08;
  const finalTotal = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight">
              🍕 PIZZARIA
            </h1>
            <p className="text-gray-600 mt-2">
              Customize your perfect pizza experience.
            </p>
          </div>

          <div className="bg-white rounded-2xl px-6 py-4 shadow-md">
            <p className="text-sm text-gray-500">Order Type</p>

            <div className="flex gap-3 mt-2">
              {["Dine In", "Takeout"].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setOrderType(type as "Dine In" | "Takeout")
                  }
                  className={`px-4 py-2 rounded-xl border transition-all ${
                    orderType === type
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-5">Pizza Menu</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pizzas.map((pizza) => (
                  <div
                    key={pizza.id}
                    className={`bg-white rounded-3xl overflow-hidden shadow-lg border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                      selectedPizza.id === pizza.id
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedPizza(pizza)}
                  >
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="h-56 w-full object-cover"
                    />

                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold">
                            {pizza.name}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">
                            {pizza.category}
                          </p>
                        </div>

                        <div className="text-xl font-bold">
                          ${pizza.basePrice}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-3xl font-bold mb-6">
                Customize Your Pizza
              </h2>

              <div className="mb-6">
                <label className="block font-semibold mb-3 text-lg">
                  Select Size
                </label>

                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-3 rounded-2xl border transition-all ${
                        selectedSize.name === size.name
                          ? "bg-black text-white"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-3 text-lg">
                  Choose Toppings
                </label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {toppings.map((topping) => {
                    const selected = selectedToppings.some(
                      (t) => t.id === topping.id
                    );

                    return (
                      <button
                        key={topping.id}
                        onClick={() => toggleTopping(topping)}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          selected
                            ? "bg-black text-white"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        <div className="font-semibold">{topping.name}</div>
                        <div className="text-sm opacity-80">
                          +${topping.price}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Live Total</p>
                  <h3 className="text-4xl font-extrabold">
                    ${currentPizzaPrice.toFixed(2)}
                  </h3>
                </div>

                <button
                  onClick={addToCart}
                  className="bg-black text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:opacity-90 transition-all"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 h-fit sticky top-6">
            <h2 className="text-3xl font-bold mb-6">🛒 Order Summary</h2>

            {cart.length === 0 ? (
              <div className="bg-gray-100 rounded-2xl p-6 text-center text-gray-500">
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-auto pr-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-2xl p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h3 className="font-bold text-lg">
                          {item.pizza.name}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1">
                          Size: {item.size.name}
                        </p>

                        <p className="text-sm text-gray-600 mt-1">
                          Toppings:{" "}
                          {item.toppings.length > 0
                            ? item.toppings
                                .map((topping) => topping.name)
                                .join(", ")
                            : "None"}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm px-3 py-1 rounded-lg border hover:bg-gray-200"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-3 text-right font-bold text-lg">
                      ${item.totalPrice.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 border-t pt-6 space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-2xl font-bold pt-2 border-t">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 bg-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Fulfillment</span>
                <span className="font-bold">{orderType}</span>
              </div>
            </div>

            <button className="w-full mt-6 bg-green-600 text-white py-4 rounded-2xl text-lg font-semibold hover:opacity-90 transition-all">
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
