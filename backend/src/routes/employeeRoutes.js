const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const employeeController = require('../controllers/employeeController');

// Admin & ChefProjet (lecture), Admin (écriture)
router.get('/',     verifyToken, verifyRole('Admin', 'ChefProjet'), employeeController.listEmployees);
router.post('/',    verifyToken, verifyRole('Admin'),               employeeController.createEmployee);
router.post('/chefprojet', verifyToken, verifyRole('Admin'),        employeeController.createChefProjet);
router.get('/:id',  verifyToken, verifyRole('Admin', 'ChefProjet'), employeeController.getEmployeeById);
router.put('/:id',  verifyToken, verifyRole('Admin'),               employeeController.updateEmployee);
router.delete('/:id', verifyToken, verifyRole('Admin'),             employeeController.deleteEmployee);

module.exports = router;
