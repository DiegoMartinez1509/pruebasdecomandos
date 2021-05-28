const express = require("express");
const router = express.Router();
const pool = require("../config/db.config");

router.get("/add", (req, res) => {
  res.render("categorias/add", { title: "Alta Categoria - Bruji Rifas" });
});

//ruta para guardar los cargos
router.post("/add", async (req, res) => {
  const {
     nombre, 
     descripcion 
    } = req.body;
  const newCategoria = {
    nombre,
    descripcion,
  };
  await pool.query("insert into categorias set ?", [newCategoria]);
  const success = req.flash('success','Guardado correctamente!');
  res.redirect("/categorias");
});

//ruta para listar los contratos
router.get("/", async (req, res) => {
  const categorias = await pool.query("select * from categorias");
  res.render("categorias/list", { categorias: categorias, title: "Categorias - Bruji Rifas" });
});

//ruta para eliminar contrato
router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await pool.query("delete from categorias where id = ?", id);
  const success = req.flash('success','Eliminado correctamente!');
  res.redirect("/categorias");
});

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const categoria = await pool.query(
    "select * from categorias where id = ?", id);
  res.render("categorias/edit", {
    categoria: categoria[0], title: "Editar Categoria - Bruji Rifas"});
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { 
    nombre, 
    descripcion 
  } = req.body;
  const newCategoria = {
    nombre,
    descripcion,
  };
  await pool.query("update categorias set ? where id = ?", [newCategoria, id]);
  const success = req.flash('success','Actualizado correctamente!');
  res.redirect("/categorias");
});

module.exports = router;

