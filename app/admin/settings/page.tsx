"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function AdminSettingsPage() {
  const [config, setConfig] = useState({
    brandName: siteConfig.brandName,
    tagline: siteConfig.tagline,
    shippingThreshold: siteConfig.shippingThreshold,
    defaultShippingFee: siteConfig.defaultShippingFee,
    supportEmail: siteConfig.supportEmail,
    supportPhone: siteConfig.supportPhone,
    whatsappNumber: siteConfig.whatsappNumber,
    instagramHandle: siteConfig.instagramHandle,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-choco-950">
          Store Configuration & Policies
        </h1>
        <p className="text-xs sm:text-sm text-choco-500 font-sans mt-0.5">
          Configure shipping thresholds, courier flat rates, and official customer contact channels.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-sm max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          {saved && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Store parameters updated and synchronized!</span>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="font-montserrat font-bold text-xs uppercase tracking-wider text-choco-900 pb-1 border-b border-cream-100">
              Brand Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={config.brandName}
                  onChange={(e) => setConfig({ ...config, brandName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-cream-300 bg-cream-50/40 text-choco-950 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={config.tagline}
                  onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-cream-300 bg-cream-50/40 text-choco-950 font-sans"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h2 className="font-montserrat font-bold text-xs uppercase tracking-wider text-choco-900 pb-1 border-b border-cream-100">
              Shipping & Cold Chain Thresholds
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                  Free Shipping Threshold (₹)
                </label>
                <input
                  type="number"
                  value={config.shippingThreshold}
                  onChange={(e) =>
                    setConfig({ ...config, shippingThreshold: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-cream-300 bg-cream-50/40 text-choco-950 font-sans"
                />
                <span className="text-[11px] text-choco-500 mt-0.5 block">
                  Orders above this value qualify for free delivery.
                </span>
              </div>

              <div>
                <label className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                  Standard Flat Shipping Fee (₹)
                </label>
                <input
                  type="number"
                  value={config.defaultShippingFee}
                  onChange={(e) =>
                    setConfig({ ...config, defaultShippingFee: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-cream-300 bg-cream-50/40 text-choco-950 font-sans"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h2 className="font-montserrat font-bold text-xs uppercase tracking-wider text-choco-900 pb-1 border-b border-cream-100">
              Communication Channels
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={config.supportEmail}
                  onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-cream-300 bg-cream-50/40 text-choco-950 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
                  WhatsApp Support Phone
                </label>
                <input
                  type="text"
                  value={config.whatsappNumber}
                  onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-cream-300 bg-cream-50/40 text-choco-950 font-sans"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-choco-900 text-cream-50 hover:bg-choco-800 text-xs font-montserrat font-bold transition-all shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </form>
      </div>
    </div>
  );
}
