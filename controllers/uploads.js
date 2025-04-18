//importaciones de node
const path = require('path')
const fs = require('fs')
//Importaciones de 3eros
const { response, request } = require("express");
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL)
//mis importaciones
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");


const cargarArchivo = async(req, res = response) => {

    try{
      //imagenes, extenciones d archivo etc
      const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos')
      res.json({ nombre })

    }catch( err ){
      res.status(400).json( err );
    }

  }

/* 
MANEJO DE IMAGENES Y ARCHIVOS LOCALMENTE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
const actualizarImagen = async (req = request, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch(coleccion) {

    case 'usuarios':

      modelo = await Usuario.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }

      break;
      
    case 'productos':

      modelo = await Producto.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }

      break;

    default:
      return res.status(500).json({msg: 'Se me olvido implementar esto'})
  }

  //borrado de imagen anterior
  if ( modelo.img ) {
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
    if ( fs.existsSync( pathImagen ) ) {
      fs.unlinkSync( pathImagen );
    }
  }

  const nombre = await subirArchivo( req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.json(modelo)
}

const mostrarImagen = async( req, res = response ) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch(coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }

    break;
      
    case 'productos':

      modelo = await Producto.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }

    break;

    default:
      return res.status(500).json({msg: 'Se me olvido implementar esto'})
  }


    if ( modelo.img ) {
      // Retorna la imagen
      const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
      if ( fs.existsSync( pathImagen ) ) {
          return res.sendFile( pathImagen )
      }
  }

  const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
  res.sendFile( pathImagen );
}

/* 
MANEJO DE IMAGENES Y ARCHIVOS EN CLAUDINARY!!!!!!!!!!!!!!!!!!!!!
*/
const actualizarImagenClaudinary = async (req = request, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch(coleccion) {

    case 'usuarios':

      modelo = await Usuario.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }

      break;
      
    case 'productos':

      modelo = await Producto.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }

      break;

    default:
      return res.status(500).json({msg: 'Se me olvido implementar esto'})
  }

  //borrado de imagen anterior
  if ( modelo.img ) {
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[nombreArr.length - 1];
    const [ public_id ] = nombre.split('.');
    cloudinary.uploader.destroy( public_id );

  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  modelo.img = secure_url;

  await modelo.save();

  res.json(modelo);
}

const mostrarImagenClaudinary = async( req, res = response ) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch(coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }

    break;
      
    case 'productos':

      modelo = await Producto.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }

    break;

    default:
      return res.status(500).json({msg: 'Se me olvido implementar esto'})
  }

  console.log(modelo)

  // Retorna la imagen
    if ( modelo.img ) { 
      return res.json({
        img: modelo.img
      });     
  }
  const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
  res.sendFile( pathImagen );
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenClaudinary,
    mostrarImagenClaudinary,

}