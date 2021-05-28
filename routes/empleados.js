const express = require("express");
const router = express.Router();
const dateFormat = require("dateformat");
const pool = require("../config/db.config");


//ruta para listar empleados/list 
router.get("/", async (req, res) => {
  const empleados = await pool.query("select * from empleados_personales");
  res.render("empleados/list", { empleados: empleados, title: "Lista Empleados - Bruji Rifas" });
});

//ADD EMPLEADOS INICIA

router.get("/add", (req, res) => {
  res.render("empleados/add", {title: "Alta Empleado"
  });
});


//ruta para guardar los empleados_personales
router.post("/add", async (req, res) => {
  const {
    
    nombres,
    apellidos,
    DUI,
    correo,
    celular,
    fecha_nac,
    telefono,
    direccion,
    id_municipio,
    genero,
    estado_civil
    
  } = req.body;

  const letra = apellidos.charAt(0);
  
  
  const numero = await pool.query("SELECT COUNT(`cod_empleado`) as numero FROM empleados_personales where cod_empleado like "+ "'"+letra+"%'");
  const num= parseInt(numero[0].numero) + 1;

  var cod_empleado=0;
  if(num <= 9){
    cod_empleado = letra + '00' + num;
  }else if(num > 9){
     cod_empleado = letra + '0' + num;
  }
  
  var foto =cod_empleado+".jpg";
    
  console.log("Primer letra del Primemer Apellidos "+ letra + " numero: "+  num+" cod_empleado "+cod_empleado);
 
  

   const newEmpleado = {
    cod_empleado,
    foto,
    nombres,
    apellidos,
    DUI,
    correo,
    celular,
    fecha_nac,
    telefono,
    direccion,
    id_municipio,
    genero,
    estado_civil
  };
  await pool.query("insert into empleados_personales set ?", [newEmpleado]);
  const success = req.flash('success','Registro Guardado correctamente!');
  res.redirect("/empleados/add");
});
//ruta para guardar los empleados_laborales
router.post("/add_laborales", async (req, res) => {
  const {
    cod_empleado,
    id_cargo,
    NIT,
    seguro_social,
    cuenta_bancaria,
    AFP,
    fecha_registro,
    fecha_baja,
    id_contrato,
    jefe_inmediato,
    cod_sucursal,
    estado
    
  } = req.body;
   const newEmpleadoLab = {
    cod_empleado,
    id_cargo,
    NIT,
    seguro_social,
    cuenta_bancaria,
    AFP,
    fecha_registro,
    fecha_baja,
    id_contrato,
    jefe_inmediato,
    cod_sucursal,
    estado
  };
  await pool.query("insert into empleados_laborales set ?", [newEmpleadoLab]);
   const success = req.flash('success','Registro Guardado correctamente!');
  res.redirect("/empleados/add");
});
// FIN DE ADD EMPLEADOS


//EMPIEZA BASE DE DATOS   empleados_personal

//ruta para listar empleados/edit 

router.get("/edit", async (req, res) => {
  const empleados = await pool.query("select * from empleados_personales ");
  res.render("empleados/edit", { empleados: empleados, title: "Empleados Edit - Bruji Rifas" });
})

//ruta que recibe el cod_empleado para llenar el formulario o la vista edit_personal
router.get("/edit_personal/:cod_empleado", async (req, res) => {
  const empleados = await pool.query("select * from empleados_personales");
  const cod_empleado = req.params.cod_empleado;
  const empleado = await pool.query("select * from empleados_personales where cod_empleado = ?", cod_empleado );
  const empleado_lab = await pool.query("select * FROM empleados_laborales where cod_empleado = ?", cod_empleado );
  res.render("empleados/edit", { empleado: empleado[0], empleado_lab: empleado_lab[0], empleados:empleados,  title: "Editar Empleado - Bruji Rifas",});
});

//ruta que recibe el cod_empleado  para actualizar en la base de datos empleados_personal
router.post("/edit_personal/:cod_empleado", async (req, res) => {
  const cod_empleado = req.params.cod_empleado;
  const { 
    foto,
    nombres,
    apellidos,
    DUI,
    correo,
    celular,
    fecha_nac,
    telefono,
    direccion,
    id_municipio,
    genero,
    estado_civil
  } = req.body;
  const newEmpleadoPer = {
    foto,
    nombres,
    apellidos,
    DUI,
    correo,
    celular,
    fecha_nac,
    telefono,
    direccion,
    id_municipio,
    genero,
    estado_civil
  };
  await pool.query("update empleados_personales set ? where cod_empleado = ?", [newEmpleadoPer, cod_empleado]);
  const success = req.flash('success','Registro actualizado correctamente!');
  res.redirect("/empleados/edit_personal/" + cod_empleado);
});
//FINALIZA BASE DE DATOS   empleados_personal



//EMPIEZA BASE DE DATOS   empleados_laboral
//ruta que recibe el cod_empleado para llenar el formulario o la vista edit_laboral
/*router.get("/edit_laboral/:cod_empleado", async (req, res) => {
   const empleados = await pool.query("SELECT * FROM empleados_personales");
  const cod_empleado = req.params.cod_empleado;
   const empleado = await pool.query("select * FROM empleados_laborales where cod_empleado = ?",
    cod_empleado );
   res.render("empleados/edit", {
    empleado: empleado[0], empleados:empleados, title: "Editar Empleado - Bruji Rifas",
  });
  
});*/

//ruta que recibe el cod_empleado  para actualizar en la base de datos empleados_laboral
router.post("/edit_laboral/:cod_empleado", async (req, res) => {
  const cod_empleado = req.params.cod_empleado;
  const { 
   id_cargo,
   NIT,
   seguro_social,
   cuenta_bancaria,
   AFP,
   fecha_registro,
   fecha_baja,
   id_contrato,
   Jefe_inmediato,
   cod_sucursal,
   estado
  } = req.body;
  const newEmpleadoPer = {
    id_cargo,
   NIT,
   seguro_social,
   cuenta_bancaria,
   AFP,
   fecha_registro,
   fecha_baja,
   id_contrato,
   Jefe_inmediato,
   cod_sucursal,
   estado
  };
  await pool.query("update empleados_laborales set ? where cod_empleado = ?", [newEmpleadoPer, cod_empleado]);
  const success = req.flash('success','Actualizado correctamente!');
  res.redirect("/empleados/edit_laboral/" + cod_empleado);
});

//FINALIZA BASE DE DATOS   empleados_personal
module.exports = router;
