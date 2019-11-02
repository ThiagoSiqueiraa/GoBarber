const express = require("express");

const server = express();

server.use(express.json());

const projetos = [{ id: "1", title: "Teste", tasks: [] }];

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projetos.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

function logRequests(req, res, next) {
  console.count("Número de requisições");

  return next();
}

server.use(logRequests);

server.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  const { tasks } = req.body;

  const projeto = {
    id,
    title,
    tasks
  };

  projetos.push(projeto);

  return res.json(projetos);
});

server.get("/projects", (req, res) => {
  return res.json(projetos);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projeto = projetos.find(p => p.id == id);
  projeto.title = title;
  return res.json(projetos);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projeto = projetos.find(p => p.id == id);

  projetos.splice(projeto, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projeto = projetos.find(p => p.id == id);

  projeto.tasks.push(title);

  return res.json(projetos);
});

server.listen(3000);
