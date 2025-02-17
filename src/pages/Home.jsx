import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home({ peso }) {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div className="container">
      <h1>ELIJA FRUTA ó VERDURA</h1>
      <h2>Peso en Tiempo Real: <span style={{ color: peso === "En espera..." ? "red" : "blue" }}>{peso}</span></h2>
      <button onClick={() => setModalAbierto(true)} className="modal-button">ejemplo modal - Abrir Modal</button>
      <div className="options">
        <Link to="/about" className="option fruta">Frutas</Link>
        <Link to="/productos" className="option verdura">Verduras</Link>
      </div>

      {modalAbierto && (
        <div className="modal">
          <div className="modal-content">
            <h2>Este es un Modal</h2>
            <p>Aquí puedes poner información adicional.</p>
            <button onClick={() => setModalAbierto(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;