const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/add', (req, res) =>{
    res.render('inventarios/add',  { title: "Alta Inventario - Bruji Rifas" });
})
 //ruta para guardar los inventarios
 router.post("/add", async (req, res) => {
    const {
        fecha_registro,
        precio_compra,
        precio_venta,
        id_proveedor,
        observaciones,
        stock,
        id_producto
    } = req.body;
    const newInventario = {
        fecha_registro,
        precio_compra,
        precio_venta,
        id_proveedor,
        observaciones,
        stock,
        id_producto
    };
    await pool.query("insert into inventarios set ?", [newInventario]);
    const success = req.flash('success','¡Registro Guardado correctamente!');
    res.redirect("/inventarios");
  });

//ruta para listar los inventarios
router.get("/", async (req, res) => {
    const inventarios = await pool.query("select * from inventarios");
    res.render("inventarios/list", { inventarios: inventarios, title: "Inventarios - Bruji Rifas" });
  });

  //ruta para eliminar inventario
router.get("/delete/:id", async(req, res) => {
    const id = req.params.id;
    await pool.query('delete from inventarios where id = ?', id);
    const success = req.flash('success','Registro Eliminado correctamente!');
    res.redirect("/inventarios");
  })

  //ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async(req, res) => {
  const id = req.params.id;
  const inventario = await pool.query('select * from inventarios where id = ?', id);
  res.render("inventarios/edit", { inventario : inventario[0], title: "Editar Inventario - Bruji Rifas" });
  
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async(req, res) => {
  const id = req.params.id;  
  const {
    fecha_registro,
    precio_compra,
    precio_venta,
    id_proveedor,
    observaciones,
    stock,
    id_producto
  } = req.body;
  const newInventario = {
    fecha_registro,
    precio_compra,
    precio_venta,
    id_proveedor,
    observaciones,
    stock,
    id_producto
 };
  await pool.query("update inventarios set ? where id = ?", [newInventario, id]);
  const success = req.flash('success','Registro Actualizado correctamente!');
  res.redirect("/inventarios");
});

module.exports = router;