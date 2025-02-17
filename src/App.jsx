import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Productos from "./pages/Productos";

function App() {
  const [peso, setPeso] = React.useState("En espera...");

  React.useEffect(() => {
    const obtenerPeso = async () => {
      try {
        const respuesta = await fetch("http://127.0.0.1:5000/peso");
        const datos = await respuesta.json();

        if (typeof datos.peso === "number") {
          const respuesta_final = datos.peso >= 1000 
            ? `${(datos.peso / 1000).toLocaleString("es-AR", { minimumFractionDigits: 3 })} kg` 
            : `${datos.peso} gr`;

          setPeso(respuesta_final);
        } else {
          setPeso(datos.peso);
        }
      } catch (error) {
        console.error("Error obteniendo el peso:", error);
      }
    };

    const intervalo = setInterval(obtenerPeso, 1000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home peso={peso} />} />
          <Route path="about" element={<About />} />
          <Route path="productos" element={<Productos />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;