'use client'

import { useState } from "react";

export default function page() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        filename: null,
    });
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = async (e) => {

        const file = e.target.files[0];
        if (!file) return;

        setImage(file);

        const mime = file.type.split("/")[1];

        //get presigned url
        const response = await fetch(`${baseUrl}/get-presigned-url`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mime }),
        });



        if (!response.ok) return;

        const data = await response.json();
        console.log("data--", data);

        //upload file to S3
        const uploadResponse = await fetch(data.url, {
            method: "PUT",
            headers: {
                "Content-Type": file.type || "image/jpeg",
            },
            body: file,
        });

        if (!uploadResponse.ok) return;

        console.log("uploadResponse--", uploadResponse);

        setProduct((prev) => ({
            ...prev,
            filename: data.filename,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission (API call, etc.)
        console.log("product>>", product);

        const res = await fetch(`${baseUrl}/add-product`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });

        if (!res.ok) return;

        setProduct({
            name: "",
            description: "",
            price: "",
            filename: null,
        });

        setImage(null);

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 space-y-5"
            >
                <h2 className="text-2xl font-bold text-gray-800 text-center">
                    Create Product
                </h2>

                {/* Product Name */}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Product Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className="mt-1 p-2 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        placeholder="Enter product description"
                        rows="3"
                        className="mt-1 p-2 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
                        required   ></textarea>
                </div>

                {/* Price */}
                <div>
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Price ($)
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        className="mt-1 p-2 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
                        required
                    />
                </div>

                {/* Image */}
                <div>
                    <label
                        htmlFor="image"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Product Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 block w-full text-gray-700"
                        required />
                    {image && (
                        <p className="text-xs text-gray-500 mt-1">
                            Selected: {image.name}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition"
                >
                    Save Product
                </button>
            </form>
        </div>
    );
}
