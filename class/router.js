const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
    res.json([{'classname': 'BIO103'}]);
  });

// router.post('/', jsonParser, (req, res) => {
// // ensure `name` and `budget` are in request body
//     const requiredFields = ['name', 'checked'];
//     for (let i=0; i<requiredFields.length; i++) {
//         const field = requiredFields[i];
//         if (!(field in req.body)) {
//         const message = `Missing \`${field}\` in request body`;
//         console.error(message);
//         return res.status(400).send(message);
//         }
//     }
//     const item = ShoppingList.create(req.body.name, req.body.checked);
//     res.status(201).json(item);
// });

// router.delete('/:id', (req, res) => {
//     ShoppingList.delete(req.params.id);
//     console.log(`Deleted shopping list item \`${req.params.id}\``);
//     res.status(204).end();
//   });

module.exports = router;