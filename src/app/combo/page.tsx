"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";

type ProductItem = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice: number;
  images: string[];
  comboDiscountPercent?: number;
};

export default function BuildYourOwnBoxPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const toggleProductSelection = (product: ProductItem) => {
    if (selectedProducts.find((p) => p._id === product._id)) {
      setSelectedProducts(selectedProducts.filter((p) => p._id !== product._id));
    } else {
      if (selectedProducts.length < 5) {
        setSelectedProducts([...selectedProducts, product]);
      } else {
        alert("You can only select up to 5 products for a combo box.");
      }
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== productId));
  };

  const totalRegularPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const totalOriginalPrice = selectedProducts.reduce((sum, p) => sum + p.originalPrice, 0);
  const totalDiscountPercent = selectedProducts.reduce((sum, p) => sum + (p.comboDiscountPercent || 0), 0);
  
  // Cap discount at some logical max, maybe 100%? Let's just use it as is
  const discountAmount = Math.round((totalRegularPrice * totalDiscountPercent) / 100);
  const finalPrice = Math.max(0, totalRegularPrice - discountAmount);

  const handleAddToCart = () => {
    if (selectedProducts.length === 0) return;

    addItem({
      id: `combo-${Date.now()}`,
      slug: "custom-combo-box",
      title: "Custom Combo Box",
      price: finalPrice,
      originalPrice: totalRegularPrice, // or totalOriginalPrice depending on preference
      imageSrc: selectedProducts[0]?.images[0] || "/images/placeholder.jpg",
      variant: "combo",
      comboItems: selectedProducts.map(p => ({
        id: p._id,
        title: p.title,
        imageSrc: p.images[0]
      })),
    }, 1);

    setSelectedProducts([]);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen font-primary">
      <Header />
      
      <main className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto">
        <h1 className="text-4xl md:text-5xl font-black uppercase text-center text-dark mb-4">Build Your Own Box</h1>
        <p className="text-center text-charcoal/70 mb-12 max-w-2xl mx-auto">
          Mix and match up to 5 of your favorite Sustento snacks. The more you add, the more you save! 
          Each product adds its own special combo discount to your box.
        </p>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Product Selection */}
          <div className="lg:w-2/3">
            <h2 className="text-xl font-bold uppercase mb-6">Select Snacks (Max 5)</h2>
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map((product) => {
                  const isSelected = selectedProducts.find((p) => p._id === product._id);
                  const isMaxReached = selectedProducts.length >= 5;
                  
                  return (
                    <div 
                      key={product._id} 
                      onClick={() => (!isSelected && isMaxReached ? null : toggleProductSelection(product))}
                      className={`relative bg-white rounded-2xl p-4 border-2 transition-all cursor-pointer ${
                        isSelected 
                          ? "border-[#9EAB75] shadow-md bg-[#9EAB75]/5" 
                          : "border-black/5 hover:border-black/20 hover:shadow-sm"
                      } ${!isSelected && isMaxReached ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-[#9EAB75] rounded-full flex items-center justify-center text-white z-10">
                          ✓
                        </div>
                      )}
                      
                      <div className="relative w-full h-32 mb-3">
                        <Image 
                          src={product.images?.[0] || "/images/placeholder.jpg"} 
                          alt={product.title} 
                          fill 
                          className="object-contain" 
                        />
                      </div>
                      
                      <h3 className="font-black text-sm uppercase leading-tight line-clamp-2 min-h-[2.5rem]">
                        {product.title}
                      </h3>
                      
                      <div className="flex justify-between items-end mt-2">
                        <span className="font-bold text-dark">₹{product.price}</span>
                        {product.comboDiscountPercent ? (
                          <span className="text-[10px] font-bold text-green-600 uppercase bg-green-50 px-2 py-1 rounded-md">
                            +{product.comboDiscountPercent}% OFF
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Box Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-32 bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
              <h2 className="text-xl font-bold uppercase mb-4 pb-4 border-b border-black/5">Your Box</h2>
              
              {/* Selected Slots */}
              <div className="flex flex-col gap-3 mb-6">
                {[0, 1, 2, 3, 4].map((index) => {
                  const product = selectedProducts[index];
                  
                  return (
                    <div 
                      key={index} 
                      className={`flex items-center gap-4 p-3 rounded-xl border ${
                        product ? "bg-stone-50 border-black/10" : "border-dashed border-charcoal/20 bg-transparent"
                      }`}
                    >
                      <div className="w-12 h-12 relative flex-shrink-0 bg-white rounded-md border border-black/5 overflow-hidden flex items-center justify-center">
                        {product ? (
                          <Image src={product.images[0]} alt={product.title} fill className="object-contain p-1" />
                        ) : (
                          <span className="text-charcoal/20 font-black text-xl">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        {product ? (
                          <>
                            <p className="font-black text-xs uppercase truncate pr-4">{product.title}</p>
                            <p className="font-semibold text-xs text-charcoal/60">₹{product.price}</p>
                          </>
                        ) : (
                          <p className="text-xs font-semibold text-charcoal/40 uppercase">Empty Slot</p>
                        )}
                      </div>
                      
                      {product && (
                        <button 
                          onClick={() => removeProduct(product._id)}
                          className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation */}
              <div className="border-t border-black/5 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/60 font-semibold">Regular Value:</span>
                  <span className="font-bold">₹{totalRegularPrice}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/60 font-semibold">Total Discount ({totalDiscountPercent}%):</span>
                  <span className="font-bold text-green-600">-₹{discountAmount}</span>
                </div>
                
                <div className="flex justify-between text-lg pt-2 border-t border-black/5">
                  <span className="font-black uppercase">Final Price:</span>
                  <span className="font-black">₹{finalPrice}</span>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                disabled={selectedProducts.length === 0}
                className="w-full bg-[#9EAB75] hover:bg-[#8CA05E] disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-wider py-4 rounded-full shadow-md transition-all duration-200"
              >
                {selectedProducts.length === 0 ? "Add items to your box" : "Add Box To Cart"}
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
