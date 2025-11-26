// src/components/WhatsAppButton.jsx
import { clientConfig } from "../config/clientConfig";

export default function WhatsAppButton({ cart, total, customer, isClosed }) {

  const buildMessage = () => {
    const lines = [];

    lines.push("📦 Nuevo pedido desde la web:");
    lines.push("");
    lines.push("🍕 Detalle del pedido:");
    cart.forEach((item) => {
      lines.push(`- ${item.qty}x ${item.name} ($${item.price} c/u)`);
    });
    lines.push("");
    lines.push(`💰 Total: $${total}`);
    lines.push("");
    lines.push("👤 Datos del cliente:");
    lines.push(`Nombre: ${customer.name || "-"}`);
    lines.push(`Dirección: ${customer.address || "-"}`);
    lines.push(`Teléfono: ${customer.phone || "-"}`);
    lines.push(`Entrega: ${customer.deliveryMethod || "-"}`);
    lines.push(`Pago: ${customer.paymentMethod || "-"}`);
    lines.push("");
    lines.push("📝 Comentarios:");
    lines.push(customer.comments ? customer.comments : "-");

    return lines.join("\n");
  };

  const handleClick = () => {
    // ⛔ Si el local está cerrado, cancelamos
    if (isClosed && clientConfig.horario?.enabled) {
      alert(
        clientConfig.horario?.mensajeCerrado ||
          "El local está cerrado en este momento."
      );
      return;
    }

    if (!cart || cart.length === 0) {
      alert("Agregá al menos una pizza al pedido 🙂");
      return;
    }

    if (!customer?.name) {
      alert("Completá tu nombre antes de enviar el pedido.");
      return;
    }

    // Número desde clientConfig (ya lo usabas)
    const phoneRaw = clientConfig.whatsapp || "+5491162123307";
    const phone = phoneRaw.replace(/[^\d]/g, ""); // limpiamos todo menos números

    const text = encodeURIComponent(buildMessage());
    const url = `https://wa.me/${phone}?text=${text}`;
    window.open(url, "_blank");
  };

  return (
    <button
      className="btn btn-success w-100 btn-lg"
      onClick={handleClick}
      disabled={isClosed} // deshabilitado cuando está cerrado
    >
      {isClosed ? "Local cerrado" : "Enviar pedido por WhatsApp"}
    </button>
  );
}
