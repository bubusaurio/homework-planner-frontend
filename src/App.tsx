import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showData, setShowData] = useState<boolean>(false);
  const [showMessage, setMessage] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [homework, setHomework] = useState<any[]>([]);

  useEffect(() => {
    const userInStorageString = window.localStorage.getItem("user");
    if (userInStorageString) {
      const userInStorage = JSON.parse(userInStorageString);
      setUser(userInStorage);
    }
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`http://localhost:3010/api/v1/homeworks/`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setHomework(data);
    } catch (error) {
      console.log(error);
    }
  };

  const HandleInputChange = (stateUpdate: (arg0: any) => void) => {
    return (event: { target: { value: any } }) => {
      stateUpdate(event.target.value);
    };
  };

  const HandleOnClickEnviar = async () => {
    try {
      const response = await fetch("http://localhost:3010/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Authentication failed
        setMessage(true);
        setShowData(false);
        return;
      }

      // Authentication successful
      const userData = await response.json();
      setUser(userData);
      window.localStorage.setItem("user", JSON.stringify(userData));
      fetchCategory();
      setShowData(true);
    } catch (error) {
      console.error("Error occurred:", error);
      setMessage(true);
      setShowData(false);
    }
  };

  return (
    <>
      <section className="dataContainer">
        {showData ? (
          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {homework.map((hw, index) => (
                  <tr key={index}>
                    <td>{hw.name}</td>
                    <td>{hw.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          showMessage && <p>Incorrect Credentials</p>
        )}
      </section>
      <section className="formContainer">
        <span className="inputContainer">
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={HandleInputChange(setEmail)}
          />
        </span>
        <span className="inputContainer">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={HandleInputChange(setPassword)}
          />
        </span>
        <button onClick={HandleOnClickEnviar}>LogIn</button>
      </section>
    </>
  );
}

export default App;
