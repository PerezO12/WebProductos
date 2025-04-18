const { response, request } = require("express");
const { Categoria} = require("../models/");



//ObtenerCategorias - paginado - total - populate
const categoriaGet = async (req = request, res = response ) => {
    const { limite = 10, desde = 0 } = req.query;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments( {estado: true} ),
        Categoria.find( {estado: true} )
            .populate( 'usuario', 'correo' )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ])


    res.json({
        total,
        categorias
    });
}
//obtenerCategoria - populate{}
const categoriaGetID = async (req = request, res = response ) => {

    const { id } = req.params;

    const categoria = await Categoria.findById( id ).populate( 'usuario', 'correo' );


    res.json({
        categoria
    })
}

const crearCategoria = async( req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne( {nombre} )

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre}, ya existe`
        })
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    //Guardar en DB
    await categoria.save();
    

    res.status(201).json(categoria)

}


//actualizarCategoria
const categoriaPut = async( req = request, res = response ) => {
    
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });


    res.json({
        categoria
    })

 }

//borrarCategoria - estado: false

const categoriaDelete = async( req = request, res = response ) => {
    
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });



    res.json({
        categoria
    })

 }


module.exports = {
    crearCategoria,
    categoriaGet,
    categoriaGetID,
    categoriaPut,
    categoriaDelete
}