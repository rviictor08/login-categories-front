import React, { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import api from "../../services/api";
import { useHistory } from "react-router-dom";
import { Context } from "../../context/AuthContext";
import "./styles.css";

export function Login() {
  const history = useHistory();

  const { authenticated, signIn } = useContext(Context);
  console.log(`Situação na página Login: ${authenticated}`);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
    loading: false,
  });

  const valorInput = (e) =>
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

  const loginSubmit = async (e) => {
    e.preventDefault();
    // console.log(user.email);
    // console.log(user.password);
    const headers = {
      "Content-Type": "application/json"
    };

    setStatus({
      loading: true,
    });

    await api
      .post("/users/login", user, { headers })
      .then((response) => {
        // console.log(response)
        // setStatus({
        //   type: 'success',
        //   mensagem: response.data.mensagem,
        //   loading: false
        // })
        setStatus({ loading: false });
        localStorage.setItem("token", response.data.token);
        signIn(true);
        return history.push("/categorias");
      })
      .catch((error) => {
        setStatus({
          type: "error",
          mensagem: "Tente novamente!",
        });
        if (error.response) {
          // console.log(error.response)
          setStatus({
            type: "error",
            mensagem: error.response.data.mensagem,
            loading: false,
          });
        }
      });
  };

  return (
    <div className="box">
      {/* <Container className="box"> */}
      <Form onSubmit={loginSubmit} className="borderForm">
        {status.type == "error" ? (
          <h3 className="p-alert-error">{status.mensagem}</h3>
        ) : (
          ""
        )}
        {status.type == "success" ? (
          <h3 className="p-alert-success">{status.mensagem}</h3>
        ) : (
          ""
        )}
        {status.loading ? (
          <h3 className="p-alert-validando">Validando...</h3>
        ) : (
          ""
        )}
        <div className="user">
        </div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="FormLabel">
            Digite seu endereço de email ou usuário:
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            onChange={valorInput}
            placeholder="Digite seu E-mail"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Senha:</Form.Label>
          <Form.Control
            type="password"
            name="password"
            onChange={valorInput}
            placeholder="Digite sua senha"
          />
        </Form.Group>
        {status.loading ? (
          <Button variant="Secondary" disabled type="submit">
            Login
          </Button>
        ) : (
          <Button variant="dark" type="submit">
            Login
          </Button>
        )}
      </Form>
      {/* </Container> */}
    </div>
  );
}
