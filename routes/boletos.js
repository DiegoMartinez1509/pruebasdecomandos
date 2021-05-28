const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/add', (req, res) =>{
    res.render('boletos/add',  { title: "Alta Boleto - Bruji Rifas" });
})
 //ruta para guardar los boletos
 router.post("/add", async (req, res) => {
    const {
        precio,
        num_inicial,
        num_final,
        codigo_rifa,
        num_ganador
    } = req.body;
    const newBoleto = {
        precio,
        num_inicial,
        num_final,
        codigo_rifa,
        num_ganador
    };
    await pool.query("insert into boletos set ?", [newBoleto]);
    const success = req.flash('success','¡Registro Guardado correctamente!');
    res.redirect("/boletos");
  });

//ruta para listar los boletos
router.get("/", async (req, res) => {
    const boletos = await pool.query("select * from boletos");
    res.render("boletos/list", { boletos: boletos, title: "Boletos - Bruji Rifas" });
  });

  //ruta para eliminar boleto
router.get("/delete/:id", async(req, res) => {
    const id = req.params.id;
    await pool.query('delete from boletos where id = ?', id);
    const success = req.flash('success','Registro Eliminado correctamente!');
    res.redirect("/boletos");
  })

  //ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async(req, res) => {
  const id = req.params.id;
  const boleto = await pool.query('select * from boletos where id = ?', id);
  res.render("boletos/edit", { boleto : boleto[0], title: "Editar Boleto - Bruji Rifas" });
  
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async(req, res) => {
  const id = req.params.id;  
  const {
    precio,
    num_inicial,
    num_final,
    codigo_rifa,
    num_ganador
  } = req.body;
  const newBoleto = {
    precio,
    num_inicial,
    num_final,
    codigo_rifa,
    num_ganador
};
  await pool.query("update boletos set ? where id = ?", [newBoleto, id]);
  const success = req.flash('success','Registro Actualizado correctamente!');
  res.redirect("/boletos");
});

module.exports = router;