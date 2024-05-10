import './App.css'
import React, { useState } from 'react';

function App() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showData, setShowData] = useState<boolean>(false);
  const [showMessage, setMessage] = useState<boolean>(false);

  const HandleInputChange = (stateUpdate: (arg0: any) => void) => {
      return (event: { target: { value: any; }; }) => {
          stateUpdate(event.target.value);
      }
  }

  const HandleOnClickEnviar = () => {
      if(email == "pmercadoruano@gmail.com" && password == "12234" ){
          setShowData(true)
          setMessage(false)
      }else{
          setShowData(false)
          setMessage(true)
      }
  }

  return(
      <>
      <section className="dataContainer">
          {
              showData ?(
                  <>
                  <p>Email: {email}</p>
                  <p>Password: {password}</p>
                  </>
              ) : 
              showMessage && (
                  <p>Incorrect Credentials</p>
              )

          }
      </section>
      <section className="formContainer">
          <span className="inputContainer">
              <label htmlFor="email">Email: </label>
              <input type="email" id="email" name="email" value={email} onChange={HandleInputChange(setEmail)}/>
          </span>
          <span className="inputContainer">
              <label htmlFor="password">Password: </label>
              <input type="password" id="password" name="password" value={password} onChange={HandleInputChange(setPassword)} />
          </span>
          <button onClick={HandleOnClickEnviar}>LogIn</button>
      </section>
      </>
  );
}

export default App;