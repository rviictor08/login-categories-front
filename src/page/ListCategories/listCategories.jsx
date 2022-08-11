import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import api from "../../services/api";
import { Container } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import './table.css';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export const ListCategories = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState({
    type: "",
    mensagem: ""
  });

  const confirmDelete = (user) => {
    confirmAlert({
      title: "CAUTION !!!!",
      message:
        "Are you absolutely sure you want to delete section " +
        user.id +
        "?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(user.id)
        },
        {
          label: "No",
          onClick: () => history.push("/usuarios")
        }
      ]
    });
  };


  const handleDelete = async (idUser) => {
    const valueToken = localStorage.getItem("token");
    const headers = {
      "headers": {
        "Authorization": "Bearer " + valueToken,
      },
    }
    await api.delete("/user/"+idUser, headers)
    .then((response) => {
      setStatus({
        type: "success",
        mensagem: response.data.mensagem
      })
      getUsers();
    }).catch( (err) => {
      if (err.response) {
        setStatus({
          type: "error",
          mensagem: err.response.data.mensagem
        })
      } else {
        setStatus({
          type: 'error',
          mensagem: "Erro tente mais tarde!!"
        })
      }
    })
  }

  const getUsers = async () => {
    const valueToken = localStorage.getItem("token");
    const headers = {
      headers: {
        Authorization: "Bearer " + valueToken,
      },
    };
    await api
      .get("/users", headers)
      .then((response) => {
        console.log(response.data.users);
        setData(response.data.users);
      })
      .catch((err) => {
        if (err.response) {
          setStatus({
            type: "error",
            mensagem: err.response.mensagem,
          });
        } else {
          setStatus({
            type: "error",
            mensagem: "Erro: Tente mais tarde!",
          });
        }
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="tabela">
      <Container>
      <h1>Lista de Usuários</h1>
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Sexo</th>
          <th>Funções</th>
        </tr>
      </thead>
      <tbody>
      {data.map(user => (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.gender}</td>
          <td>
          <Button className="button-warning" variant="warning">
            <Link className="btnLink" to={"usuarios/editar/"+user.id}>Editar</Link>
          </Button>
          <Button variant="danger" onClick={() => confirmDelete(user)}>
            Excluir
          </Button>
          </td>
        </tr>


      ))}

      </tbody>
      </Table>
       <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/usuarios/novo">Novo Usuário</Link>
          </li>
        </ul>
      </Container>
    </div>
  );
};
