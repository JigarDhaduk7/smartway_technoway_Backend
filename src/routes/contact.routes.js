const express = require('express');
const router = express.Router();

const {
  createContact,
  getContacts,
  deleteContact
} = require('../controllers/contact.controller');

router.post('/create', createContact);      // CREATE
router.get('/', getContacts);               // GET ALL
router.delete('/delete/:id', deleteContact);// DELETE

module.exports = router;
