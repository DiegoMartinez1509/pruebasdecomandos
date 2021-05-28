const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

//ruta para abrir contratos/add 
router.get('/add', (req, res) =>{
    res.render('contratos/add',  { title: "Alta Contrato - Bruji Rifas" });
})

//ruta para guardar los contratos
 router.post("/add", async (req, res) => {
    const {
      nombre,
      num_horas,
      observaciones
    } = req.body;
    const newContrato = {
      nombre,
      num_horas,
      observaciones
    };
    await pool.query("insert into contratos set ?", [newContrato]);
    const success = req.flash('success','Guardado correctamente!');
    res.redirect("/contratos");
  });

//ruta para listar los contratos
router.get("/", async (req, res) => {
    const contratos = await pool.query("select * from contratos");
    res.render("contratos/list", { contratos: contratos, title: "Contratos - Bruji Rifas" });
  });

  //ruta para eliminar contrato
router.get("/delete/:id", async(req, res) => {
  const id = req.params.id;
  await pool.query('delete from contratos where id = ?', id);
  const success = req.flash('success','Eliminado correctamente!');
  res.redirect("/contratos");
})

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const contrato = await pool.query(
    "select * from contratos where id = ?",
    id
  );
  res.render("contratos/edit", {
    contrato: contrato[0],
    title: "Editar Contrato - Bruji Rifas",
  });
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { 
    nombre,
    num_horas,
    observaciones 
  } = req.body;
  const newContrato = {
    nombre,
    num_horas,
    observaciones
  };
  await pool.query("update contratos set ? where id = ?", [newContrato, id]);
  const success = req.flash('success','Actualizado correctamente!');
  res.redirect("/contratos");
});

module.exports = router;