const express = require("express");
const router = express.Router();
const pool = require("../config/db.config");

router.get("/add", (req, res) => {
  res.render("proveedores/add", { title: "Alta Proveedor - Bruji Rifas" });
});

//ruta para guardar los proveedores
router.post("/add", async (req, res) => {
  const {
    nombre,
    direccion,
    telefono,
    correo,
    celular,
    logo,
    sitio_web,
    encargado,
    celular_encargado,
    correo_encargado,
    id_municipio
  } = req.body;
  
  const newProveedor = {
   
    nombre,
    direccion,
    telefono,
    correo,
    celular,
    logo,
    sitio_web,
    encargado,
    celular_encargado,
    correo_encargado,
    id_municipio
  };
  await pool.query("insert into proveedores set ?", [newProveedor]);
  const success = req.flash('success','¡Registro Guardado Correctamente!');
  res.redirect("/proveedores");
});

//ruta para listar los proveedores
router.get("/", async (req, res) => {
  const proveedores = await pool.query("select a.*, b.nombre as municipio, c.nombre as departamento from proveedores as a inner join municipios as b on a.id_municipio = b.id inner join departamentos as c on b.id_departamento = c.id");
  res.render("proveedores/list", {
    proveedores: proveedores,
    title: "Proveedores - Bruji Rifas",
  });
});

//ruta para eliminar proveedor
router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await pool.query("delete from proveedores where id = ?", id);
  const success = req.flash('success','¡Registro Eliminado Correctamente!');
  res.redirect("/proveedores");
});

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const proveedor = await pool.query(
    /*"select a.*, b.nombre as municipio, c.nombre as departamento from proveedores as a inner join municipios as b on a.id_municipio = b.id inner join departamentos as c on b.id_departamento = c.id"*/

    "select * from proveedores where id = ?",id
  );
  res.render("proveedores/edit", {
    proveedor: proveedor[0],
    title: "Editar Proveedor - Bruji Rifas",
  });
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { 
    nombre,
    direccion,
    telefono,
    correo,
    celular,
    logo,
    sitio_web,
    encargado,
    celular_encargado,
    correo_encargado,
    id_municipio
   } = req.body;
  const newProveedor = {
    nombre,
    direccion,
    telefono,
    correo,
    celular,
    logo,
    sitio_web,
    encargado,
    celular_encargado,
    correo_encargado,
    id_municipio
  };
  await pool.query("update proveedores set ? where id = ?", [newProveedor, id]);
  const success = req.flash('success','¡Registro Actualizado Correctamente!');
  res.redirect("/proveedores");
});

module.exports = router;
