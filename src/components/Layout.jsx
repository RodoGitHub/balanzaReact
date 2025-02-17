import { Link, Outlet } from "react-router-dom";
import Button from "react-bootstrap/Button";


function Layout() {
  return (
    <div>
      <nav>
        <Link variant="primary" to="/">Inicio</Link> | 
        <Link  variant="primary" to="/about">Sobre Nosotros</Link> | 
        <Link  variant="primary" to="/productos">Productos</Link>
        <Button variant="primary">Hola, Bootstrap</Button>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

export default Layout;