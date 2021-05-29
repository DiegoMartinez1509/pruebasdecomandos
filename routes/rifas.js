const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');




router.get('/add', (req, res) => {
        res.render('rifas/add', { title: "Alta Rifa - Bruji Rifas" });
    })
    //ruta para guardar los rifas
router.post("/add", async(req, res) => {
    const {
        codigo_rifa,
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        fecha_registro,
        fecha_sorteo,
        estado,
        id_producto,
        dias_limite_retiro

    } = req.body;
    //var fecha_registro = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    //var fecha_modificacion = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    const newRifa = {
        codigo_rifa,
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        fecha_registro,
        fecha_sorteo,
        estado,
        id_producto,
        dias_limite_retiro
    };
    await pool.query("insert into rifas set ?", [newRifa]);
    const success = req.flash('success', '¡Registro Guardado correctamente!');
    res.redirect("/rifas");
});

//ruta para listar los rifas
router.get("/", async(req, res) => {
    const rifas = await pool.query("select * from rifas");
    res.render("rifas/list", { rifas: rifas, title: "Rifas - Bruji Rifas" });
});

//ruta para eliminar rifa
router.get("/delete/:id", async(req, res) => {
    const codigo_rifa = req.params.codigo_rifa;
    await pool.query('delete from rifas where codigo_rifa = ?', codigo_rifa);
    const success = req.flash('success', 'Registro Eliminado correctamente!');
    res.redirect("/rifas");
})

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:codigo_rifa", async(req, res) => {
    const codigo_rifa = req.params.codigo_rifa;
    const rifa = await pool.query('select * from rifas where codigo_rifa = ?', codigo_rifa);
    res.render("rifas/edit", { rifa: rifa[0], title: "Editar Rifa - Bruji Rifas" });

});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:codigo_rifa", async(req, res) => {
    const codigo_rifa = req.params.codigo_rifa;
    const {


        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        fecha_registro,
        fecha_sorteo,
        estado,
        id_producto,
        dias_limite_retiro
    } = req.body;
    const newRifa = {

        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        fecha_registro,
        fecha_sorteo,
        estado,
        id_producto,
        dias_limite_retiro
    };
    await pool.query("update rifas set ? where codigo_rifa = ?", [newRifa, codigo_rifa]);
    const success = req.flash('success', 'Registro Actualizado correctamente!');
    res.redirect("/rifas");
});

module.exports = router;