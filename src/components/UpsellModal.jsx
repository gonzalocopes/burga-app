// src/components/UpsellModal.jsx
import { useState, useEffect } from "react";
import { empanadas } from "../data/pizzeriaProducts";

export default function UpsellModal({
  show,
  onClose,
  upsellItems,
  onAdd,
  lastProduct,
}) {
  const [addedIds, setAddedIds] = useState([]);
  const [selectionCount, setSelectionCount] = useState(0);

  useEffect(() => {
    if (show) {
      setAddedIds([]);
      setSelectionCount(0);
    }
  }, [show]);

  if (!show) return null;

  const productName = lastProduct?.name || "tu pedido";
  const category = lastProduct?.category || "";
  const nameLower = productName.toLowerCase();

  const isEmpanadaMedia =
    category === "Empanadas" && nameLower.includes("media docena");

  const isEmpanadaDocena =
    category === "Empanadas" &&
    nameLower.includes("docena") &&
    !nameLower.includes("media docena");

  const isEmpanadaPack = isEmpanadaMedia || isEmpanadaDocena;
  const maxSelection = isEmpanadaMedia ? 6 : isEmpanadaDocena ? 12 : null;

  const isPizza = category === "Pizzas";
  const icon = isEmpanadaPack ? "🥟" : isPizza ? "🍕" : "🥟";

  const currentCount = isEmpanadaPack ? selectionCount : addedIds.length;
  const reachedLimit =
    maxSelection !== null && currentCount >= maxSelection;

  // Para packs de empanadas, mostramos las empanadas individuales (sin las de pack)
  const individualEmpanadas = empanadas.filter((e) => !e.upsell);
  const itemsToShow = isEmpanadaPack ? individualEmpanadas : upsellItems;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">
              {isEmpanadaPack
                ? "Elegí tus empanadas 🥟"
                : `¿Le sumamos algo a tu pedido? ${icon}`}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Cerrar"
            ></button>
          </div>

          {/* BODY */}
          <div className="modal-body upsell-scroll-area">
            {isEmpanadaPack ? (
              <>
                <p className="small text-muted mb-1">
                  Estás armando <strong>{productName}</strong>.
                </p>
                <p className="small text-muted mb-3">
                  Elegí hasta{" "}
                  <strong>{maxSelection} empanadas</strong>. No vas a poder
                  agregar más de ese número.
                  <br />
                  Seleccionaste{" "}
                  <strong>
                    {currentCount} de {maxSelection}
                  </strong>
                  .
                </p>
              </>
            ) : (
              <p className="small text-muted mb-3">
                Te dejamos algunas sugerencias para acompañar:
              </p>
            )}

            {itemsToShow.length === 0 ? (
              <p>No hay productos sugeridos.</p>
            ) : (
              <ul className="list-group">
                {itemsToShow.map((item) => {
                  if (isEmpanadaPack) {
                    // 🥟 LÓGICA PARA PACKS DE EMPANADAS (media/docena)
                    const disabled = reachedLimit;
                    // Sufijo distinto para que no choque con las empanadas individuales
                    const packIdSuffix = isEmpanadaMedia
                      ? "-pack-media"
                      : "-pack-docena";

                    return (
                      <li
                        key={item.id + packIdSuffix}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <div className="fw-semibold">{item.name}</div>
                          {/* En el pack las empanadas no suman precio */}
                          <small className="text-muted">$0</small>
                        </div>
                        <button
                          className="btn btn-sm btn-success"
                          disabled={disabled}
                          onClick={() => {
                            if (reachedLimit) return;

                            // Entrará al carrito como otro item distinto (id diferente y price 0)
                            onAdd({
                              ...item,
                              id: item.id + packIdSuffix,
                              price: 0,
                            });

                            setSelectionCount((prev) => prev + 1);
                          }}
                        >
                          {reachedLimit ? "Límite alcanzado" : "Agregar"}
                        </button>
                      </li>
                    );
                  }

                  // 🍕 LÓGICA PARA EXTRAS DE PIZZA (una sola vez por ítem)
                  const isAdded = addedIds.includes(item.id);
                  const disabled = isAdded;

                  return (
                    <li
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-semibold">{item.name}</div>
                        <small className="text-muted">${item.price}</small>
                      </div>
                      <button
                        className={
                          "btn btn-sm " +
                          (isAdded ? "btn-outline-success" : "btn-success")
                        }
                        disabled={disabled}
                        onClick={() => {
                          if (!isAdded) {
                            onAdd(item);
                            setAddedIds((prev) => [...prev, item.id]);
                          }
                        }}
                      >
                        {isAdded ? "Agregado ✓" : "Agregar"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Seguir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
