// src/components/Menu.jsx
import { pizzas, empanadas, bebidas, postres } from "../data/pizzeriaProducts";

export default function Menu({ onAddToCart, isClosed }) {
  const renderCategory = (title, items, isFirst = false) => (
    <>
      <h3
        className={`mb-3 text-center ${isFirst ? "mt-3" : "mt-5"}`}
      >
        {title}
      </h3>

      <div className="row g-4">
        {items.map((item) => (
          <div key={item.id} className="col-12">
            <div className="card shadow-sm">
              <div className="row g-0">
                {/* FOTO */}
                <div className="col-md-3">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="img-fluid rounded-start"
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      minHeight: "160px",
                    }}
                  />
                </div>

                {/* CONTENIDO */}
                <div className="col-md-9">
                  <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start">
                    <div>
                      <h5 className="card-title mb-1">{item.name}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {item.category}
                      </h6>
                      <p className="card-text mb-2">{item.description}</p>
                    </div>

                    <div className="text-md-end mt-3 mt-md-0">
                      <div className="fw-bold fs-5 mb-2">${item.price}</div>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => onAddToCart(item)}
                        disabled={isClosed}
                      >
                        {isClosed ? "Cerrado" : "Agregar"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <section id="menu" className="py-4 bg-light">
      <div className="container-fluid px-4 px-lg-5">
        <h2 className="mb-3 text-center">Menú</h2>

        {renderCategory("Pizzas", pizzas, true)}
        {renderCategory("Empanadas", empanadas)}
        {renderCategory("Bebidas", bebidas)}
        {renderCategory("Postres", postres)}
      </div>
    </section>
  );
}
