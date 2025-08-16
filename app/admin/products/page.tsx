"use client";

import { fetchProducts } from '@/app/api/services/products';
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from an API or database
    fetchProducts().then(data => setProducts(data));
  }, []);
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Products</h1>
      <ul>
        {products.map((p: Product) => (
          <li key={p.id}>{p.name} - ${p.price} category - {p.category.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default Page