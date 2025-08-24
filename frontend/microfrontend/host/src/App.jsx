import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, useHistory, Switch } from 'react-router-dom';
import ReactDOM from "react-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Main from "./components/Main";

import "./index.css";

// Импорт компонентов из микрофронтенда auth
const Login = lazy(() => import('auth/Login').catch(() => {
  return { default: () => <div className='error'>Component Login is not available!</div> };
 }));

const Register = lazy(() => import('auth/Register').catch(() => {
  return { default: () => <div className='error'>Component Register is not available!</div> };
}));

const App = () => {  
  const history = useHistory();
  
  //
  // Аутентификация
  //
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const handleLoginSuccess = event => { 
    localStorage.setItem('jwt', event.detail.token);
    setIsLoggedIn(true);
    setEmail(event.detail.email);
    history.push("/");
  };
  useEffect(() => {
    addEventListener("on-login-success", handleLoginSuccess); 
    return () => removeEventListener("on-login-success", handleLoginSuccess)
  }, []);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatchEvent(new CustomEvent("token-check-required", {
        detail: jwt
      }));
    }
  }, [history])

  const handleTokenValid = event => {
    setIsLoggedIn(true);
    setEmail(event.email);
    history.push("/");
  }
  useEffect(() => {
    addEventListener("on-token-valid", handleTokenValid); 
    return () => removeEventListener("on-token-valid", handleTokenValid)
  }, []);

  const handleTokenInvalid = _ => {
    slocalStorage.removeItem("jwt");
  }
  useEffect(() => {
    addEventListener("on-token-invalid", handleTokenInvalid); 
    return () => removeEventListener("on-token-invalid", handleTokenInvalid)
  }, []);

  function signOut() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);    
    history.push("/signin");
  }

  //
  // Компоненты приложения
  //
  return <Suspense fallback="Please wait...">
    <div className="page__content">
      <Header email={email} onSignOut={signOut} />
      <Switch>
        <ProtectedRoute
            exact
            path="/"
            component={Main}
            loggedIn={isLoggedIn}
          />
        <Route path="/signup">
          <Register />
        </Route>
        <Route path="/signin">
          <Login />
        </Route>
      </Switch>
      <Footer />      
    </div>
  </Suspense>    
};
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>, 
  document.getElementById("app"));
