import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-extrabold text-foreground">404</h1>
        <p className="text-lg text-muted-foreground">La página que buscas no existe</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Home className="h-4 w-4" /> Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
