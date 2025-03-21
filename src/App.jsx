import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Productos from "./pages/Productos";
import Verduras from "./pages/Verduras";
import Frutas from "./pages/Frutas";
import Editar from "./pages/Editar";
import Pizarron from "./pages/Pizarron";
import PizarronB from "./pages/PizarronB";

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
    {/* Rutas con Layout */}
    <Route path="/" element={<Layout />}>
      <Route index element={<Home peso={peso} />} />
      <Route path="about" element={<About />} />
      <Route path="productos" element={<Productos />} />
      <Route path="verduras" element={<Verduras />} />
      <Route path="frutas" element={<Frutas />} />
      <Route path="editar" element={<Editar />} />
    </Route>

    {/* Ruta sin Layout */}
    <Route path="pizarron" element={<Pizarron />} />
    <Route path="pizarronB" element={<PizarronB />} />
  </Routes>
</Router>

  );
}

export default App;