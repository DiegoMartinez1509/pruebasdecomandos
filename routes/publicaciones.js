const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/add', (req, res) =>{
    res.render('publicaciones/add',  { title: "Alta Publicación - Bruji Rifas" });
})
 //ruta para guardar los publicaciones
 router.post("/add", async (req, res) => {
    const {
        titulo,
        descripcion,
        contenido,
        estado,
        fecha,
        id_empleado
    } = req.body;
    const newPublicacion = {
        titulo,
        descripcion,
        contenido,
        estado,
        fecha,
        id_empleado   
    };
    await pool.query("insert into publicaciones set ?", [newPublicacion]);
    const success = req.flash('success','¡Registro Guardado correctamente!');
    res.redirect("/publicaciones");
  });

//ruta para listar los publicaciones
router.get("/", async (req, res) => {
    const publicaciones = await pool.query("select * from publicaciones");
    res.render("publicaciones/list", { publicaciones: publicaciones, title: "Publicaciones - Bruji Rifas" });
  });

  //ruta para eliminar publicacion
router.get("/delete/:id", async(req, res) => {
    const id = req.params.id;
    await pool.query('delete from publicaciones where id = ?', id);
    const success = req.flash('success','Registro Eliminado correctamente!');
    res.redirect("/publicaciones");
  })

  //ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async(req, res) => {
  const id = req.params.id;
  const publicacion = await pool.query('select * from publicaciones where id = ?', id);
  res.render("publicaciones/edit", { publicacion : publicacion[0], title: "Editar Publicación - Bruji Rifas" });
  
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async(req, res) => {
  const id = req.params.id;  
  const {
    titulo,
    descripcion,
    contenido,
    estado,
    fecha,
    id_empleado
  } = req.body;
  const newPublicacion = {
    titulo,
    descripcion,
    contenido,
    estado,
    fecha,
    id_empleado
};
  await pool.query("update publicaciones set ? where id = ?", [newPublicacion, id]);
  const success = req.flash('success','Registro Actualizado correctamente!');
  res.redirect("/publicaciones");
});

module.exports = router;