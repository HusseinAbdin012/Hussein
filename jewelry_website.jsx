import { useState } from "react";

export default function JewelryWebsite() {
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const products = {
    women: [
      { name: "Diamond Necklace", price: 250, img: "https://via.placeholder.com/300x200" },
      { name: "Gold Earrings", price: 120, img: "https://via.placeholder.com/300x200" },
      { name: "Silver Bracelet", price: 90, img: "https://via.placeholder.com/300x200" },
    ],
    men: [
      { name: "Platinum Ring", price: 300, img: "https://via.placeholder.com/300x200" },
      { name: "Luxury Watch", price: 450, img: "https://via.placeholder.com/300x200" },
      { name: "Silver Cufflinks", price: 70, img: "https://via.placeholder.com/300x200" },
    ],
  };

  // ----- STRIPE CHECKOUT INTEGRATION -----
  // This uses Stripe Checkout. You must implement a server endpoint that creates
  // a Checkout Session using your Stripe SECRET_KEY and returns { id: sessionId }.
  // Example server route: POST /api/create-checkout-session
  // The server should convert cart items into line_items for Stripe and set
  // success_url / cancel_url.
  // On the client we redirect using Stripe.js.
  // To use this code, install: npm i @stripe/stripe-js
  
  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Your cart is empty.");
    setLoading(true);
    try {
      // Prepare items for the server. We send name and price in cents.
      const payload = {
        email,
        items: cart.map((it) => ({ name: it.name, unit_amount: Math.round(it.price * 100), quantity: 1 })),
      };

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data || !data.id) throw new Error('No session id returned from server');

      // Dynamically load Stripe.js and redirect
      const { loadStripe } = await import('@stripe/stripe-js');
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
      if (error) alert(error.message);
    } catch (err) {
      console.error(err);
      alert('Checkout failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-md p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">✨ LuxeJewels</h1>
        <nav className="space-x-6">
          <a href="#women" className="hover:text-pink-600">Women</a>
          <a href="#men" className="hover:text-blue-600">Men</a>
          <a href="#about" className="hover:text-gray-600">About</a>
          <a href="#contact" className="hover:text-gray-600">Contact</a>
          <a href="#cart" className="hover:text-green-600 font-semibold">Cart ({cart.length})</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-100 to-blue-100 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Elegant Jewelry for Women & Men</h2>
        <p className="text-lg mb-6">Discover timeless designs that shine with style and sophistication.</p>
        <button className="px-6 py-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition">
          Shop Now
        </button>
      </section>

      {/* Women Collection */}
      <section id="women" className="py-16 px-8">
        <h3 className="text-3xl font-semibold mb-8 text-center">Women's Collection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.women.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-md">
              <img src={item.img} alt={item.name} className="rounded-lg mb-4" />
              <h4 className="text-xl font-medium">{item.name}</h4>
              <p className="text-gray-600">${item.price}</p>
              <button
                onClick={() => addToCart(item)}
                className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Men Collection */}
      <section id="men" className="py-16 px-8 bg-gray-100">
        <h3 className="text-3xl font-semibold mb-8 text-center">Men's Collection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.men.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-md">
              <img src={item.img} alt={item.name} className="rounded-lg mb-4" />
              <h4 className="text-xl font-medium">{item.name}</h4>
              <p className="text-gray-600">${item.price}</p>
              <button
                onClick={() => addToCart(item)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-8 text-center">
        <h3 className="text-3xl font-semibold mb-6">About Us</h3>
        <p className="max-w-2xl mx-auto text-gray-700">
          At LuxeJewels, we craft timeless jewelry pieces for both women and men. Our designs blend modern elegance with lasting quality, ensuring you always shine with confidence.
        </p>
      </section>

      {/* Cart Section */}
      <section id="cart" className="py-16 px-8 bg-gray-100 text-center">
        <h3 className="text-3xl font-semibold mb-6">Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-700">Your cart is empty.</p>
        ) : (
          <ul className="max-w-md mx-auto text-left">
            {cart.map((item, idx) => (
              <li key={idx} className="flex justify-between border-b py-2">
                <span>{item.name}</span>
                <span>${item