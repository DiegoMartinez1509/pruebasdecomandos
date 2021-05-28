const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/add', (req, res) =>{
    res.render('productos/add',  { title: "Alta Producto - Bruji Rifas" });
})
 //ruta para guardar los productos
 router.post("/add", async (req, res) => {
    const {
        id,
        nombre,
        marca,
        id_categoria,
        descripcion,
        url_fabricante
    } = req.body;
    const newProducto = {
        id,
        nombre,
        marca,
        id_categoria,
        descripcion,
        url_fabricante
    };
    await pool.query("insert into productos set ?", [newProducto]);
    const success = req.flash('success','Guardado correctamente!');
    res.redirect("/productos");
  });

//ruta para listar los productos
router.get("/", async (req, res) => {
    const productos = await pool.query("select * from productos");
    res.render("productos/list", { productos: productos, title: "Productos - Bruji Rifas" });
  });

  //ruta para eliminar producto
router.get("/delete/:id", async(req, res) => {
    const id = req.params.id;
    await pool.query('delete from productos where id = ?', id);
    const success = req.flash('success','Eliminado correctamente!');
    res.redirect("/productos");
  })

  //ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async(req, res) => {
  const id = req.params.id;
  const producto = await pool.query('select * from productos where id = ?', id);
  res.render("productos/edit", { producto : producto[0], title: "Editar Producto - Bruji Rifas" });
  
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async(req, res) => {
  const id = req.params.id;  
  const {
    
    nombre,
    marca,
    id_categoria,
    descripcion,
    url_fabricante
  } = req.body;
  const newProducto = {
    id,
    nombre,
    marca,
    id_categoria,
    descripcion,
    url_fabricante
};
  await pool.query("update productos set ? where id = ?", [newProducto, id]);
  const success = req.flash('success','Actualizado correctamente!');
  res.redirect("/productos");
});

module.exports = router;