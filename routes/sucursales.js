const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/add', (req, res) =>{
    res.render('sucursales/add',  { title: "Alta Sucursal - Bruji Rifas" });
})

  //ruta para guardar las sucursales
router.post("/add", async (req, res) => {
    const {
      cod_sucursal,
      nombre,
      telefono,
      direccion,
      id_municipio,
      estado
    } = req.body;
    const newSucursal = {
      cod_sucursal,
      nombre,
      telefono,
      direccion,
      id_municipio,
      estado
    };
    await pool.query("insert into sucursales set ?", [newSucursal]);
    const success = req.flash('success','Guardado correctamente!');
    res.redirect("/sucursales");
  });

  //ruta para listar las sucursales
router.get("/", async (req, res) => {
    const sucursales = await pool.query("select a.*, b.nombre as municipio, c.nombre as departamento from sucursales as a inner join municipios as b on a.id_municipio = b.id inner join departamentos as c on b.id_departamento = c.id");
    res.render("sucursales/list", { sucursales: sucursales, title: "Sucursales - Bruji Rifas" });
  });
  
//ruta para eliminar
router.get("/delete/:cod_sucursal", async(req, res) => {
  const cod_sucursal = req.params.cod_sucursal;
  await pool.query('delete from sucursales where cod_sucursal = ?', cod_sucursal);
  const success = req.flash('success','Eliminado correctamente!');
  res.redirect("/sucursales");
})

//ruta que recibe el cod_sucursal para llenar el formulario o la vista
router.get("/edit/:cod_sucursal", async(req, res) => {
  const cod_sucursal = req.params.cod_sucursal;
  const sucursal = await pool.query('select * from sucursales where cod_sucursal = ?', cod_sucursal);
  res.render("sucursales/edit", { sucursal : sucursal[0], title: "Editar Sucursal - Bruji Rifas" });
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:cod_sucursal", async(req, res) => {
  const cod_sucursal = req.params.cod_sucursal;  
  const {
    
    nombre,
    telefono,
    direccion,
    id_municipio,
    estado
  } = req.body;
  const newSucursal = {
    
    nombre,
    telefono,
    direccion,
    id_municipio,
    estado
};
  await pool.query("update sucursales set ? where cod_sucursal = ?", [newSucursal, cod_sucursal]);
  const success = req.flash('success','Actualizado correctamente!');
  res.redirect("/sucursales");
});

module.exports = router;