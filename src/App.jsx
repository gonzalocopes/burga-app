// src/App.jsx
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroCarousel from "./components/HeroCarousel";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import CheckoutForm from "./components/CheckoutForm";
import WhatsAppButton from "./components/WhatsAppButton";
import UpsellModal from "./components/UpsellModal";
import { bebidas, postres } from "./data/pizzeriaProducts";
import { clientConfig } from "./config/clientConfig";

function App() {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
    deliveryMethod: "Delivery",
    paymentMethod: "Efectivo",
    comments: "",
  });

  const [showUpsell, setShowUpsell] = useState(false);

  // 🔔 estado: local cerrado o abierto
  const [isClosed, setIsClosed] = useState(false);

  // 🆕 último producto principal que disparó el upsell
  const [lastProduct, setLastProduct] = useState(null);

  // productos que vamos a sugerir (bebidas y postres)
  const upsellItems = [...bebidas, ...postres];

  // 🔔 lógica de horario: revisamos cada 1 minuto
  useEffect(() => {
    if (!clientConfig.horario?.enabled) return;

    const checkClosed = () => {
      const now = new Date();
      const [openH, openM] = clientConfig.horario.apertura
        .split(":")
        .map(Number);
      const [closeH, closeM] = clientConfig.horario.cierre
        .split(":")
        .map(Number);

      const minutesNow = now.getHours() * 60 + now.getMinutes();
      const minutesOpen = openH * 60 + openM;
      const minutesClose = closeH * 60 + closeM;

      let closedNow;

      if (minutesClose > minutesOpen) {
        // horario normal, mismo día (ej: 19:00–23:30)
        closedNow =
          minutesNow < minutesOpen || minutesNow >= minutesClose;
      } else {
        // horario que cruza medianoche (ej: 20:00–02:00)
        closedNow =
          minutesNow < minutesOpen && minutesNow >= minutesClose;
      }

      setIsClosed(closedNow);
    };

    checkClosed();
    const id = setInterval(checkClosed, 60000); // cada 1 minuto

    return () => clearInterval(id);
  }, []);

  // cantidad total de items en el carrito (suma de qty)
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (product, { fromUpsell = false } = {}) => {
    // ⛔ si está cerrado, no dejamos agregar
    if (isClosed && clientConfig.horario?.enabled) {
      alert(
        clientConfig.horario.mensajeCerrado ||
          "En este momento el local está cerrado."
      );
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });

    // 🔥 categorías principales que disparan el modal de sugerencias
    const mainCategories = [
      "Pizzas",
      "Hamburguesas",
      "Sándwiches",
      "Sandwiches",
      "Milanesas",
      "Combos",
    ];

    const shouldOpenUpsell =
      mainCategories.includes(product.category) && !fromUpsell;

    if (shouldOpenUpsell) {
      setLastProduct(product); // guardamos qué producto eligió
      setShowUpsell(true); // abrimos el modal
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const changeQty = (id, newQty) => {
    if (newQty <= 0) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: newQty } : item
      )
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // agregar desde el modal de upsell
  const handleAddFromUpsell = (product) => {
    addToCart(product, { fromUpsell: true });
  };

  return (
    <div className="bg-body-tertiary min-vh-100">
      <Navbar cartCount={cartCount} />

      {/* 🔔 Aviso de local cerrado */}
      {clientConfig.horario?.enabled && isClosed && (
        <div className="bg-dark text-light text-center py-2">
          <small>{clientConfig.horario.mensajeCerrado}</small>
        </div>
      )}

      <HeroCarousel />

      {/* margen top para que no lo tape el navbar fijo */}
      <main className="py-5" id="pedido" style={{ marginTop: "80px" }}>
        <div className="container-fluid px-4 px-lg-5">
          <div className="row">
            {/* Menú */}
            <div className="col-12 col-lg-7 mb-4 mb-lg-0">
              <Menu onAddToCart={addToCart} isClosed={isClosed} />
            </div>

            {/* Carrito + datos + botón WhatsApp */}
            <section id="cart" className="col-12 col-lg-5">
              <Cart
                cart={cart}
                total={total}
                onRemove={removeFromCart}
                onChangeQty={changeQty}
              />
              <CheckoutForm customer={customer} onChange={setCustomer} />
              <WhatsAppButton
                cart={cart}
                total={total}
                customer={customer}
                isClosed={isClosed}
              />
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-dark text-light text-center py-3 mt-auto">
        <small>
          © {new Date().getFullYear()}{" "}
          Desarrollado por{" "}
          <a
            href="https://magozitsolutions.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none text-info"
          >
            MagoZ IT Solutions
          </a>
        </small>
      </footer>

      {/* Modal de sugerencias */}
      <UpsellModal
        show={showUpsell}
        onClose={() => setShowUpsell(false)}
        upsellItems={upsellItems}
        onAdd={handleAddFromUpsell}
        lastProduct={lastProduct} // 🆕 le pasamos el último producto
      />
    </div>
  );
}

export default App;
