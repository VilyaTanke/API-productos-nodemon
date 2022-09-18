const express = require ('express');
const router = express.Router();
const {query, validationResult } = require('express-validator');
const Producto = require('../../models/Producto');

// GET /api/productos
// devuelve la lista de productos
router.get('/', async (req, res, next) => {

    try {

        // filtros
        const name = req.query.name;
        const tags = req.query.tags;
        const venta = req.query.venta;
        const _id = req.query._id;


        // paginación
        const skip = req.query.skip;
        const limit = req.query.limit;

        // selección de campos
        const fields = req.query.fields;
        const sort = req.query.sort;


        // creamos el filtro vacio
        const filtro = {}

        if (name) {
            filtro.name = name;
        }

        if (tags) {
            filtro.tags = tags;
        }

        if (venta) {
            filtro.venta = venta;
          }
    
          if (_id) {
            filtro._id = _id;
          }


        const productos = await Producto.lista(filtro, skip, limit, fields, sort);

        res.json({ result: productos });
    } catch (err) {
        next(err);
    }

});

// PUT /api/productos/(_id)  (body)
// Actualizar un producto
router.put('/:id', async (req, res, next) => {
    try {
        
        const _id = req.params.id;
        const data = req.body;
        const productoActualizado = await Producto.findOneAndUpdate({ _id: _id}, data, {
            new: true // devuelve el documento actualizado
        });

        res.json({ result: productoActualizado });

    } catch (error) {
        next(err);
    }
});

router.get ('/:_id', async (req, res, next) => {
    try {
      
      const _id = req.params._id;

      const producto = await Producto.findOne({ _id: _id})

      res.json({ result: producto});

    } catch (error) {
      next(error);
    }
});

// para crear un producto nuevo
router.post ('/', async (req, res, next) => {
    try {
        const productoData = req.body;

        const producto = new Producto(productoData);

        const productoGuardado = await producto.save();

        res.json({ result: productoGuardado });

        console.log(`Se ha creado un nuevo producto con exito`);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
      const _id = req.params.id;
  
      await Producto.deleteOne({ _id: _id });
  
      res.json();
  
    } catch (error) {
      next(error);
    }
  });

module.exports = router;