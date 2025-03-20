import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


function Login() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/login",
        {
          nombre_usuario: nombreUsuario, // Enviar como JSON (correcto)
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.Token) {
        localStorage.setItem("token", response.data.Token);
        localStorage.setItem("username", nombreUsuario); // Guardar usuario

        setMessage("Login exitoso");
        navigate("/editar"); // Redirigir después del login
      } else {
        setMessage("Login fallido: " + response.data.Mensaje);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage("Credenciales incorrectas. Verifique usuario y contraseña.");
      } else {
        setMessage("Ocurrió un error: " + error.message);
      }
    }
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>

      <div class="mb-3">

        <label for="exampleInputEmail1" class="form-label">Usuario</label>
        <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
        />
        
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">Contraseña</label>
          <input type="password" class="form-control" id="exampleInputPassword1" value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <button type="submit" class="btn btn-primary" onClick={handleLogin}>Iniciar Sesión</button>
      {message && <p>{message}</p>}
      
    </div>
  );
}

export default Login;
