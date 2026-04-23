const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// In-memory mock database
global.mockStudents = global.mockStudents || [];

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        let studentArr = global.mockStudents.find(s => s.email === email);
        if (studentArr) return res.status(400).json({ msg: 'Duplicate email' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStudent = { id: Date.now().toString(), name, email, password: hashedPassword };
        global.mockStudents.push(newStudent);

        res.status(201).json({ msg: 'Student registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = global.mockStudents.find(s => s.email === email);
        if (!student) return res.status(400).json({ msg: 'Invalid login' });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid login' });

        const payload = { user: { id: student.id } };
        const jwtSecret = process.env.JWT_SECRET || 'secretkey123';
        
        jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: student.id, name: student.name, email: student.email } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
