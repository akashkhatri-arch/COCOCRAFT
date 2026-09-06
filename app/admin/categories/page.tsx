"use client";

import React, { useEffect, useState } from "react";
import { FolderTree, Plus, Edit2 } from "lucide-react";
import { fetchAdminCategoriesAction } from "@/app/actions/admin";
import type { Category } from "@/types/database";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchAdminCategoriesAction();
      setCategories(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-choco-950">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-choco-500 font-sans mt-0.5">
            Organize chocolate collections, luxury gift boxes, and seasonal drops.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Category creation scaffolded.")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-choco-900 text-cream-50 hover:bg-choco-800 text-xs font-montserrat font-bold transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Category</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-cream-200 text-choco-500 font-montserrat uppercase tracking-wider text-[11px]">
                <th className="pb-3 font-bold">Category</th>
                <th className="pb-3 font-bold">Slug</th>
                <th className="pb-3 font-bold">Description</th>
                <th className="pb-3 font-bold">Sort Order</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 text-choco-800">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="py-3.5 font-montserrat font-bold text-choco-950">
                    {cat.name}
                  </td>
                  <td className="py-3.5 font-mono text-choco-500">
                    {cat.slug}
                  </td>
                  <td className="py-3.5 text-choco-600 max-w-xs truncate">
                    {cat.description || "—"}
                  </td>
                  <td className="py-3.5 font-semibold text-choco-900">
                    {cat.sort_order}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-montserrat font-bold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Edit category: ${cat.name}`)}
                      className="p-1 text-choco-500 hover:text-choco-950 transition-colors"
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
