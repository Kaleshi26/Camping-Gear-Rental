// backend/routes/employees.js
import express from 'express';
import auth from '../middleware/auth.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// Get all employees
router.get('/', auth(['admin']), async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create an employee
router.post('/', auth(['admin']), async (req, res) => {
  const { name, email, department, salary } = req.body;

  if (!name || !email || !department || !salary) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const employee = new Employee({ name, email, department, salary });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an employee
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;