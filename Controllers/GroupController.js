const Group = require('../models/GroupModel');
const User = require('../models/UserModel');

const GroupController = {
    createGroup: async (req, res) => {
        const { name } = req.body;

        try {
            const group = await Group.create({ name });
            await group.addUser(req.userId); 
            res.status(200).json({ message: 'Group created successfully', group });
        } catch (error) {
            console.error('Error creating group', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getGroupList: async (req, res) => {
        try {
            const groups = await Group.findAll();
            res.status(200).json({ groups });
        } catch (error) {
            console.error('Error fetching group list', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};

module.exports = GroupController;
