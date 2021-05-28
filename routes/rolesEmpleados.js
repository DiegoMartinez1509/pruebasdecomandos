const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/add', (req, res) =>{
    res.render('rolesEmpleados/add',  { title: "Alta Rol Empleado - Bruji Rifas" });
})
 //ruta para guardar los rolesEmpleados
 router.post("/add", async (req, res) => {
    const {
      id_empleado,
      id_rol
    } = req.body;
    const newRolEmpleado = {
        id_empleado,
        id_rol
    };
    await pool.query("insert into roles_empleados set ?", [newRolEmpleado]);
    const success = req.flash('success','¡Registro Guardado correctamente!');
    res.redirect("/rolesEmpleados");
  });

//ruta para listar los rolesempleados
router.get("/", async (req, res) => {
    const rolesEmpleados = await pool.query("select * from roles_empleados");
    res.render("rolesEmpleados/list", { rolesEmpleados: rolesEmpleados, title: "Roles Empleados - Bruji Rifas" });
  });

  //ruta para eliminar rol
router.get("/delete/:id", async(req, res) => {
    const id = req.params.id;
    await pool.query('delete from roles_empleados where id = ?', id);
    const success = req.flash('success','Registro Eliminado correctamente!');
    res.redirect("/rolesEmpleados");
  })

  //ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async(req, res) => {
  const id = req.params.id;
  const rol = await pool.query('select * from roles_empleados where id = ?', id);
  res.render("rolesEmpleados/edit", { rol : rol[0], title: "Editar Rol Empleado - Bruji Rifas" });
  
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async(req, res) => {
  const id = req.params.id;  
  const {
    id_empleado,
      id_rol
  } = req.body;
  const newRolEmpleado = {
    id_empleado,
      id_rol
 };
  await pool.query("update roles_empleados set ? where id = ?", [newRolEmpleado, id]);
  const success = req.flash('success','Registro Actualizado correctamente!');
  res.redirect("/rolesEmpleados");
});

module.exports = router;