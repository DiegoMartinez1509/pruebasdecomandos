const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/add', (req, res) =>{
    res.render('roles/add',  { title: "Alta Rol - Bruji Rifas" });
})
 //ruta para guardar los roles
 router.post("/add", async (req, res) => {
    const {
      nombre
    } = req.body;
    const newRol = {
      nombre
    };
    await pool.query("insert into roles set ?", [newRol]);
    const success = req.flash('success','¡Registro Guardado correctamente!');
    res.redirect("/roles");
  });

//ruta para listar los roles
router.get("/", async (req, res) => {
    const roles = await pool.query("select * from roles");
    res.render("roles/list", { roles: roles, title: "Roles - Bruji Rifas" });
  });

  //ruta para eliminar rol
router.get("/delete/:id", async(req, res) => {
    const id = req.params.id;
    await pool.query('delete from roles where id = ?', id);
    const success = req.flash('success','Registro Eliminado correctamente!');
    res.redirect("/roles");
  })

  //ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async(req, res) => {
  const id = req.params.id;
  const rol = await pool.query('select * from roles where id = ?', id);
  res.render("roles/edit", { rol : rol[0], title: "Editar Rol - Bruji Rifas" });
  
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async(req, res) => {
  const id = req.params.id;  
  const {
    nombre
  } = req.body;
  const newRol = {
    nombre
 };
  await pool.query("update roles set ? where id = ?", [newRol, id]);
  const success = req.flash('success','Registro Actualizado correctamente!');
  res.redirect("/roles");
});

module.exports = router;