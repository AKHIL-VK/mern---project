const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Student = require('../models/Student');

// POST /api/register -> Register a new student
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, course } = req.body;
        
        let student = await Student.findOne({ email });
        if (student) {
            return res.status(400).json({ msg: 'Student already exists' });
        }

        student = new Student({
            name,
            email,
            password,
            course
        });

        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(password, salt);

        await student.save();
        res.status(201).json({ msg: 'Student registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// POST /api/login -> Authenticate student and return JWT token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: student.id
            }
        };

        const jwtSecret = process.env.JWT_SECRET || 'secretkey123';
        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET /api/me -> Get student details
router.get('/me', auth, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select('-password');
        res.json(student);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT /api/update-password -> Update password (verify old password)
router.put('/update-password', auth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        const student = await Student.findById(req.user.id);
        if(!student) return res.status(404).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(oldPassword, student.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid old password' });
        }

        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(newPassword, salt);
        await student.save();

        res.json({ msg: 'Password updated successfully' });
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PUT /api/update-course -> Change course
router.put('/update-course', auth, async (req, res) => {
    try {
        const { course } = req.body;
        
        let student = await Student.findById(req.user.id);
        if(!student) return res.status(404).json({ msg: 'User not found' });

        student.course = course;
        await student.save();

        res.json({ msg: 'Course updated successfully' });
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
