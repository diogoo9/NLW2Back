import express, { request } from "express";

const app = express();
app.use(express.json());

const users = [
  { name: "Diogo", age: 14 },
  { name: "Diogo", age: 14 },
  { name: "Diogo", age: 14 },
];

app.get("/users", (reqquest, response) => {
  return response.send(users);
});

app.post("/users", (request, response) => {
  const { name, age } = request.body;
  users.push({ name, age });

  return response.json("Usuário adicionado com sucesso!")
});

app.listen(3000);
