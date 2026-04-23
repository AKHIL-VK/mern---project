// In-memory mock database
global.mockGrievances = global.mockGrievances || [];

exports.submitGrievance = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const newGrievance = {
            _id: Date.now().toString(),
            student: req.user.id,
            title,
            description,
            category,
            status: 'Pending',
            date: new Date()
        };
        global.mockGrievances.push(newGrievance);
        res.status(201).json(newGrievance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getGrievances = async (req, res) => {
    try {
        const userGrievances = global.mockGrievances
            .filter(g => g.student === req.user.id)
            .sort((a, b) => b.date - a.date);
        res.json(userGrievances);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getGrievanceById = async (req, res) => {
    try {
        const grievance = global.mockGrievances.find(g => g._id === req.params.id);
        if (!grievance) return res.status(404).json({ msg: 'Grievance not found' });
        
        if (grievance.student !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized access' });
        }
        res.json(grievance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateGrievance = async (req, res) => {
    try {
        const { title, description, category, status } = req.body;
        let index = global.mockGrievances.findIndex(g => g._id === req.params.id);
        if (index === -1) return res.status(404).json({ msg: 'Grievance not found' });

        let grievance = global.mockGrievances[index];

        if (grievance.student !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized access' });
        }

        if(title) grievance.title = title;
        if(description) grievance.description = description;
        if(category) grievance.category = category;
        if(status) grievance.status = status;

        global.mockGrievances[index] = grievance;
        res.json(grievance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteGrievance = async (req, res) => {
    try {
        let index = global.mockGrievances.findIndex(g => g._id === req.params.id);
        if (index === -1) return res.status(404).json({ msg: 'Grievance not found' });

        if (global.mockGrievances[index].student !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized access' });
        }

        global.mockGrievances.splice(index, 1);
        res.json({ msg: 'Grievance deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.searchGrievances = async (req, res) => {
    try {
        const titleQuery = req.query.title.toLowerCase();
        const userGrievances = global.mockGrievances
            .filter(g => g.student === req.user.id && g.title.toLowerCase().includes(titleQuery))
            .sort((a, b) => b.date - a.date);
        res.json(userGrievances);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
