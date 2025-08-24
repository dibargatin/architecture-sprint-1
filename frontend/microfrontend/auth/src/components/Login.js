import React from 'react';
import { login, checkToken } from '../utils/auth';
import InfoTooltip from "./InfoTooltip";

import '../blocks/login/login.css';

function Login (){  
  const handleTokenCheckRequired = event => {
    checkToken(event.detail)
      .then((res) => {
        dispatchEvent(new CustomEvent("on-token-valid", {
          detail: {
            email: res.data.email
          }
        })); 
      })
      .catch((err) => {
        dispatchEvent(new CustomEvent("on-token-invalid"));
        console.log(err);
      });
  }
  React.useEffect(() => {
    addEventListener("token-check-required", handleTokenCheckRequired); 
    return () => removeEventListener("token-check-required", handleTokenCheckRequired)
  }, []);
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState("");

  function closeAllPopups() {
    setIsInfoToolTipOpen(false);    
  }

  function handleSubmit(e){
    e.preventDefault();

    login(email, password)
      .then((jwt) => {
        dispatchEvent(new CustomEvent("on-login-success", {
          detail: {
            token: jwt.token,
            email: email
          }
        }));        
      })
      .catch((err) => {
        setTooltipStatus("fail");
        setIsInfoToolTipOpen(true);
      });
  }
  return (
    <div className="auth-form">
      <form className="auth-form__form" onSubmit={handleSubmit}>
        <div className="auth-form__wrapper">
          <h3 className="auth-form__title">Вход</h3>
          <label className="auth-form__input">
            <input type="text" name="name" id="email"
              className="auth-form__textfield" placeholder="Email"
              onChange={e => setEmail(e.target.value)} required  />
          </label>
          <label className="auth-form__input">
            <input type="password" name="password" id="password"
              className="auth-form__textfield" placeholder="Пароль"
              onChange={e => setPassword(e.target.value)} required  />
          </label>
        </div>
        <button className="auth-form__button" type="submit">Войти</button>
      </form>
      <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          status={tooltipStatus} />
    </div>    
  )
}

export default Login;
