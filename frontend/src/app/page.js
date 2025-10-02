"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${baseUrl}/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [baseUrl]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Product Listing
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center">No products available</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col"
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl">
                {/* <Image
                  src={`${baseUrl}/uploads/${product.filename}`}
                  width={100}
                  height={200}
                  alt={product.filename}
                  className="w-full h-full object-cover hover:scale-105 transition"
                /> */}
              </div>
              <div className="mt-4 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {product.description}
                </p>
                <p className="text-blue-600 font-bold text-lg mt-3">
                  ${product.price}
                </p>
                <button className="mt-auto bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
