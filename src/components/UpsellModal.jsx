// src/components/UpsellModal.jsx

// Mapeo simple de emojis por categoría (podés ir sumando más)
const categoryEmojis = {
  Pizzas: "🍕",
  Hamburguesas: "🍔",
  Sandwiches: "🥪",
  Milanésas: "🥪",
  Empanadas: "🥟",
  Helados: "🍨",
  Postres: "🍰",
  Bebidas: "🥤",
  Combos: "🍗",
  default: "🔥",
};

export default function UpsellModal({
  show,
  onClose,
  upsellItems,
  onAdd,
  lastProduct, // 🆕 último producto agregado
}) {
  if (!show) return null; // si no hay que mostrarlo, no renderiza nada

  // Elegimos emoji según categoría (si no, usamos uno genérico)
  const emoji =
    (lastProduct && categoryEmojis[lastProduct.category]) ||
    categoryEmojis.default;

  // Título dinámico
  const title = lastProduct
    ? `¿Le sumamos algo a tu ${(
        lastProduct.category || "pedido"
      ).toLowerCase()}? ${emoji}`
    : "¿Le sumamos algo a tu pedido?";

  // Texto de ayuda dinámico
  const subtitle = lastProduct
    ? `Ya agregaste ${lastProduct.name} ${emoji}. Te dejamos algunas sugerencias para acompañar:`
    : "Te dejamos algunas sugerencias para acompañar:";

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="modal-body">
            <p className="small text-muted">{subtitle}</p>

            {upsellItems.length === 0 ? (
              <p>No hay productos sugeridos.</p>
            ) : (
              <ul className="list-group">
                {upsellItems.slice(0, 4).map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div className="fw-semibold">{item.name}</div>
                      <small className="text-muted">${item.price}</small>
                    </div>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => onAdd(item)}
                    >
                      Agregar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Seguir sin agregar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
