import "./App.css";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Profile from "./Profile";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

function App() {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently } =
    useAuth0();
  const [syncDone, setSyncDone] = useState(false); // ⬅️ Para evitar múltiples llamadas

  useEffect(() => {
    const sincronizarUsuario = async () => {
      if (isAuthenticated && user && !syncDone) {
        try {
          const token = await getAccessTokenSilently();

          const response = await fetch(
            "http://localhost:3001/customers/sincronizar",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                auth0Id: user.sub,
                picture: user.picture,
              }),
            }
          );

          if (response.ok) {
            console.log("✅ Usuario sincronizado correctamente.");
            setSyncDone(true);
          } else {
            console.error("❌ Error al sincronizar:", await response.text());
          }
        } catch (error) {
          console.error("❌ Error en sincronización:", error);
        }
      }
    };

    sincronizarUsuario();
  }, [isAuthenticated, user, getAccessTokenSilently, syncDone]);

  if (isLoading) {
    return <h1>AUTH0 Is Loading</h1>;
  }

  return (
    <div className="App">
      <h1>App de Prueba Auth0</h1>
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}

      <Profile />
    </div>
  );
}

export default App;
