"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Check, X, Package, Search } from "lucide-react";
import { fetchAdminProductsAction } from "@/app/actions/admin";
import type { Product } from "@/types/database";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function load() {
      const data = await fetchAdminProductsAction();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleToggleActive = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-choco-950">
            Product Catalog & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-choco-500 font-sans mt-0.5">
            Manage chocolate bars, gift boxes, stock inventory, and customizable products.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            alert(
              "Product creation modal scaffolded. In production, writes directly to Supabase products table."
            )
          }
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-choco-900 text-cream-50 hover:bg-choco-800 text-xs font-montserrat font-bold transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-choco-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name or flavor..."
          className="w-full pl-10 pr-4 py-2 text-xs font-sans rounded-xl border border-cream-200 bg-white text-choco-950 focus:outline-none focus:border-gold-500 shadow-2xs"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-cream-200 text-choco-500 font-montserrat uppercase tracking-wider text-[11px]">
                <th className="pb-3 font-bold">Product</th>
                <th className="pb-3 font-bold">Base Price</th>
                <th className="pb-3 font-bold">Stock</th>
                <th className="pb-3 font-bold">Customizable</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 text-choco-800">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-cream-100 shrink-0 border border-cream-200">
                        {prod.main_image ? (
                          <Image
                            src={prod.main_image}
                            alt={prod.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-base select-none">
                            🍫
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-montserrat font-bold text-choco-950 block text-xs">
                          {prod.name}
                        </span>
                        <span className="text-[11px] text-choco-400 font-mono">
                          {prod.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 font-montserrat font-bold text-choco-950">
                    {fmt(prod.base_price)}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`font-semibold ${
                        prod.stock_quantity < 10 ? "text-red-600 font-bold" : "text-choco-800"
                      }`}
                    >
                      {prod.stock_quantity} units
                    </span>
                  </td>
                  <td className="py-3.5">
                    {prod.is_customizable ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-montserrat font-bold bg-gold-100 text-gold-900 border border-gold-300">
                        BYO Customizer
                      </span>
                    ) : (
                      <span className="text-choco-400">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(prod.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-montserrat font-bold transition-colors cursor-pointer ${
                        prod.active
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {prod.active ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        alert(`Editing ${prod.name}. Pricing and stock modifications mapped.`)
                      }
                      className="p-1 text-choco-500 hover:text-choco-950 transition-colors"
                      aria-label={`Edit ${prod.name}`}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
