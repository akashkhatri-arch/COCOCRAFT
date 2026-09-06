"use client";

import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Radio } from "@/components/ui/Radio";
import { Toggle } from "@/components/ui/Toggle";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Skeleton, ProductCardSkeleton, Spinner } from "@/components/ui/LoadingStates";
import { ErrorMessage, EmptyState, NotFoundState, NetworkError } from "@/components/ui/ErrorStates";
import { Modal, Drawer, ConfirmDialog } from "@/components/ui/Dialogs";
import { ProductCard } from "@/components/products/ProductCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

// Sample product data for showcase
const sampleProducts = [
  {
    id: "1",
    slug: "dark-temptation",
    name: "Dark Temptation",
    short_description: "70% dark chocolate with a rich bittersweet finish",
    base_price: 349,
    compare_at_price: 449,
    main_image: null,
    featured: true,
    customizable: false,
    rating: 4.5,
    review_count: 32,
  },
  {
    id: "2",
    slug: "build-your-own",
    name: "Build-Your-Own Bar",
    short_description: "Start with a base and top it with your favourite ingredients",
    base_price: 399,
    compare_at_price: null,
    main_image: null,
    featured: false,
    customizable: true,
    rating: 5,
    review_count: 18,
  },
  {
    id: "3",
    slug: "almond-crunch",
    name: "Almond Crunch Bar",
    short_description: "Creamy milk chocolate studded with roasted almonds",
    base_price: 379,
    compare_at_price: null,
    main_image: null,
    featured: false,
    customizable: false,
    rating: 4,
    review_count: 12,
  },
];

const Section: React.FC<{ title: string; children: React.ReactNode; id?: string }> = ({
  title,
  children,
  id,
}) => (
  <section id={id} className="py-10 border-b border-cream-200 last:border-0">
    <h2 className="font-serif text-2xl text-choco-900 mb-6 pb-3 border-b border-cream-200">
      {title}
    </h2>
    {children}
  </section>
);

const ColorSwatch: React.FC<{ name: string; className: string; hex?: string }> = ({
  name,
  className,
  hex,
}) => (
  <div className="flex flex-col gap-2">
    <div className={`w-full h-14 rounded-lg shadow-sm ${className}`} />
    <div>
      <p className="text-xs font-montserrat font-bold text-choco-800">{name}</p>
      {hex && <p className="text-xs text-choco-400 font-sans">{hex}</p>}
    </div>
  </div>
);

export default function DesignSystemPage() {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(3);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [check1, setCheck1] = useState(false);
  const [toggle1, setToggle1] = useState(false);
  const [radio1, setRadio1] = useState("milk");

  return (
    <>
      <Toaster position="bottom-right" />
      <Header cartCount={3} />

      <main className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-10">
          <Breadcrumb items={[{ label: "Design System" }]} className="mb-4" />
          <Badge variant="gold" className="mb-3">Internal — Dev Only</Badge>
          <h1 className="font-serif text-4xl md:text-5xl text-choco-950 mb-3">
            COCOCRAFT Design System
          </h1>
          <p className="font-sans text-choco-600 text-lg">
            The complete visual language and component library.
          </p>
        </div>

        {/* ── Colors ─────────────────────────────────────────────────────── */}
        <Section title="Color System" id="colors">
          <div className="mb-6">
            <h3 className="font-montserrat font-bold text-xs uppercase tracking-widest text-choco-500 mb-4">
              Chocolate Brown
            </h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
              {[
                { name: "950", className: "bg-choco-950", hex: "#140706" },
                { name: "900", className: "bg-choco-900", hex: "#250e0d" },
                { name: "800", className: "bg-choco-800", hex: "#3d1614" },
                { name: "700", className: "bg-choco-700", hex: "#5c2320" },
                { name: "600", className: "bg-choco-600", hex: "#7b3330" },
                { name: "500", className: "bg-choco-500", hex: "#9b4440" },
                { name: "400", className: "bg-choco-400", hex: "#c06b67" },
                { name: "300", className: "bg-choco-300", hex: "#d4918e" },
                { name: "200", className: "bg-choco-200", hex: "#e8b8b6" },
                { name: "100", className: "bg-choco-100", hex: "#f6e8e7" },
              ].map((s) => (
                <ColorSwatch key={s.name} name={s.name} className={s.className} hex={s.hex} />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-montserrat font-bold text-xs uppercase tracking-widest text-choco-500 mb-4">
              Cream
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { name: "50", className: "bg-cream-50 border border-cream-200", hex: "#fdf8f4" },
                { name: "100", className: "bg-cream-100", hex: "#f9ede3" },
                { name: "200", className: "bg-cream-200", hex: "#f3dcc8" },
              ].map((s) => (
                <ColorSwatch key={s.name} name={s.name} className={s.className} hex={s.hex} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-montserrat font-bold text-xs uppercase tracking-widest text-choco-500 mb-4">
              Gold (Accent)
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { name: "600", className: "bg-gold-600", hex: "#a67c2a" },
                { name: "500", className: "bg-gold-500", hex: "#c8973a" },
                { name: "400", className: "bg-gold-400", hex: "#d9b06a" },
                { name: "300", className: "bg-gold-300", hex: "#ead49a" },
              ].map((s) => (
                <ColorSwatch key={s.name} name={s.name} className={s.className} hex={s.hex} />
              ))}
            </div>
          </div>
        </Section>

        {/* ── Typography ─────────────────────────────────────────────────── */}
        <Section title="Typography" id="typography">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-montserrat font-bold text-choco-400 uppercase tracking-widest mb-2">
                Playfair Display — Hero / Display
              </p>
              <p className="font-serif text-5xl md:text-7xl text-choco-950 leading-tight">
                Made For Your Moment.
              </p>
            </div>
            <div>
              <p className="text-xs font-montserrat font-bold text-choco-400 uppercase tracking-widest mb-2">
                Playfair Display — Section Heading
              </p>
              <p className="font-serif text-3xl md:text-4xl text-choco-900">Our Signature Bars</p>
            </div>
            <div>
              <p className="text-xs font-montserrat font-bold text-choco-400 uppercase tracking-widest mb-2">
                Playfair Display — Product Title
              </p>
              <p className="font-serif text-2xl text-choco-900">Dark Temptation Bar</p>
            </div>
            <div>
              <p className="text-xs font-montserrat font-bold text-choco-400 uppercase tracking-widest mb-2">
                Montserrat — UI Label / Nav / Button
              </p>
              <p className="font-montserrat font-bold tracking-wide text-sm text-choco-800 uppercase">
                Shop Chocolates · Customize · About
              </p>
            </div>
            <div>
              <p className="text-xs font-montserrat font-bold text-choco-400 uppercase tracking-widest mb-2">
                Inter — Body Text
              </p>
              <p className="font-sans text-base text-choco-700 leading-relaxed max-w-2xl">
                Every COCOCRAFT bar is crafted to order using premium Belgian couverture and the freshest
                natural ingredients. Choose your base, pick your toppings, and add a personal message —
                we handle the rest.
              </p>
            </div>
            <div>
              <p className="text-xs font-montserrat font-bold text-choco-400 uppercase tracking-widest mb-2">
                Price Display
              </p>
              <div className="flex items-baseline gap-3">
                <span className="font-montserrat font-bold text-2xl text-choco-950">₹349</span>
                <span className="font-sans text-sm text-choco-400 line-through">₹449</span>
                <Badge variant="error">22% off</Badge>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Buttons ────────────────────────────────────────────────────── */}
        <Section title="Buttons" id="buttons">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-montserrat font-bold text-choco-400 uppercase tracking-widest mb-3">
                Variants
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link style</Button>
              </div>
            </div>
            <div>
              <p className="text-xs font-montserrat font-bold text-choco-400 uppercase tracking-widest mb-3">
                Sizes
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            <div>
              <p className="text-xs font-montserrat font-bold text-choco-400 uppercase tracking-widest mb-3">
                States
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button isLoading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Badges ────────────────────────────────────────────────────── */}
        <Section title="Badges" id="badges">
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="gold">Featured</Badge>
            <Badge variant="success">In Stock</Badge>
            <Badge variant="warning">Low Stock</Badge>
            <Badge variant="error">Sold Out</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </Section>

        {/* ── Inputs ────────────────────────────────────────────────────── */}
        <Section title="Form Inputs" id="inputs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
            <Input label="Full Name" placeholder="Akash Khatri" />
            <Input label="Email" type="email" placeholder="hello@cococraft.in" />
            <Input label="Error State" placeholder="Enter pincode" error="Pincode must be 6 digits" />
            <Input label="Disabled" placeholder="Cannot edit" disabled />
            <Textarea label="Message" placeholder="Write your message here..." className="md:col-span-2" />
            <Select
              label="Chocolate Type"
              options={[
                { value: "milk", label: "Milk Chocolate" },
                { value: "dark", label: "Dark Chocolate" },
                { value: "white", label: "White Chocolate" },
              ]}
            />
            <div className="space-y-3">
              <Checkbox
                label="Gift wrap this order"
                checked={check1}
                onChange={(e) => setCheck1(e.target.checked)}
              />
              <Toggle
                label="Add greeting card"
                checked={toggle1}
                onChange={(e) => setToggle1(e.target.checked)}
              />
            </div>
            <div className="space-y-3">
              <p className="text-xs font-montserrat font-bold text-choco-400 uppercase tracking-widest">
                Radio Group
              </p>
              {["milk", "dark", "white"].map((v) => (
                <Radio
                  key={v}
                  name="chocolate"
                  value={v}
                  label={`${v.charAt(0).toUpperCase() + v.slice(1)} Chocolate`}
                  checked={radio1 === v}
                  onChange={() => setRadio1(v)}
                />
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-montserrat font-bold text-choco-400 uppercase tracking-widest">
                Quantity Selector
              </p>
              <QuantitySelector value={qty} onChange={setQty} min={1} max={10} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-montserrat font-bold text-choco-400 uppercase tracking-widest">
                Rating
              </p>
              <Rating value={rating} onChange={setRating} readOnly={false} size="lg" />
              <p className="text-sm font-sans text-choco-500">Selected: {rating} / 5</p>
            </div>
          </div>
        </Section>

        {/* ── Cards ─────────────────────────────────────────────────────── */}
        <Section title="Cards" id="cards">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <Card>
              <CardHeader>
                <h3 className="font-serif text-xl text-choco-900">Default Card</h3>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-choco-600 font-sans">Standard white card with subtle border and shadow.</p>
              </CardBody>
              <CardFooter>
                <Button size="sm" className="w-full">Action</Button>
              </CardFooter>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <h3 className="font-serif text-xl text-choco-900">Elevated Card</h3>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-choco-600 font-sans">Stronger shadow for important surfaces.</p>
              </CardBody>
              <CardFooter>
                <Badge variant="gold">Featured</Badge>
              </CardFooter>
            </Card>

            <Card variant="flat" hover>
              <CardHeader>
                <h3 className="font-serif text-xl text-choco-900">Flat + Hover</h3>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-choco-600 font-sans">Lifts subtly on hover. Good for product listings.</p>
              </CardBody>
            </Card>
          </div>
        </Section>

        {/* ── Product Cards ─────────────────────────────────────────────── */}
        <Section title="Product Cards" id="product-cards">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {sampleProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={() => toast.success(`${p.name} added to cart!`)}
              />
            ))}
          </div>
        </Section>

        {/* ── Loading States ─────────────────────────────────────────────── */}
        <Section title="Loading States" id="loading">
          <div className="space-y-8">
            <div>
              <p className="text-xs font-montserrat font-bold text-choco-400 uppercase tracking-widest mb-4">
                Spinners
              </p>
              <div className="flex items-center gap-6">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <Button isLoading>Loading button</Button>
              </div>
            </div>
            <div>
              <p className="text-xs font-montserrat font-bold text-choco-400 uppercase tracking-widest mb-4">
                Skeleton Loaders
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <div className="space-y-3 pt-4">
                  <Skeleton variant="text" className="w-1/2 h-3" />
                  <Skeleton variant="text" className="w-full h-7" />
                  <Skeleton variant="text" className="w-3/4 h-4" />
                  <Skeleton variant="text" className="w-full h-4" />
                  <Skeleton className="w-full h-24 mt-4" />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Error States ─────────────────────────────────────────────── */}
        <Section title="Error & Empty States" id="errors">
          <div className="space-y-5">
            <ErrorMessage message="Something went wrong. Please try again." />
            <ErrorMessage message="Your session expired. Please log in again." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-cream-200 rounded-2xl">
                <EmptyState
                  title="Your cart is empty"
                  message="Add some chocolates to get started."
                  action={<Button size="sm">Browse Chocolates</Button>}
                />
              </div>
              <div className="border border-cream-200 rounded-2xl">
                <NotFoundState
                  title="Page Not Found"
                  message="There&apos;s nothing to show right now."
                />
              </div>
              <div className="border border-cream-200 rounded-2xl">
                <NetworkError onRetry={() => toast("Retrying...")} />
              </div>
            </div>
          </div>
        </Section>

        {/* ── Toasts ───────────────────────────────────────────────────── */}
        <Section title="Toasts" id="toasts">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => toast.success("Added to cart!")}>
              Success Toast
            </Button>
            <Button variant="outline" onClick={() => toast.error("Payment failed. Try again.")}>
              Error Toast
            </Button>
            <Button variant="ghost" onClick={() => toast("Order status updated.")}>
              Info Toast
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                toast.loading("Processing payment...", { duration: 2000 })
              }
            >
              Loading Toast
            </Button>
          </div>
        </Section>

        {/* ── Modals & Drawers ─────────────────────────────────────────── */}
        <Section title="Modals & Drawers" id="modals">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Button variant="outline" onClick={() => setDrawerOpen(true)}>
              Open Drawer
            </Button>
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              Confirm Dialog
            </Button>
          </div>

          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Sample Modal" size="md">
            <p className="text-sm text-choco-600 font-sans leading-relaxed mb-4">
              This is a modal dialog. It&apos;s accessible (Escape to close, backdrop click, focus trap)
              and animated with Framer Motion.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => setModalOpen(false)}>
                Confirm
              </Button>
            </div>
          </Modal>

          <Drawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Shopping Cart"
            side="right"
          >
            <p className="text-sm text-choco-600 font-sans">
              Cart items will appear here. This is the side drawer used for the cart in later phases.
            </p>
          </Drawer>

          <ConfirmDialog
            isOpen={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={() => toast.success("Action confirmed!")}
            title="Remove item?"
            message="Are you sure you want to remove this item from your cart? This action cannot be undone."
            confirmLabel="Remove"
            cancelLabel="Keep it"
            variant="destructive"
          />
        </Section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
