const { User, Thought } = require("../models");

const userController = {
    async getUsers(req, res) {
        try {
            const users = await User.find()

                .populate({ path: "thoughts", select: "-__v" })
                .populate({ path: "friends", select: "-__v" });

            return res.status(200).json(users);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async getUser(req, res) {
        try {
            const user = await User.findone({ _id: req.params.userId})

                .populate({ path: "thoughts", select: "-__v" })
                .populate({ path: "friends", select: "-__v"});

            if (!user) {
                return res.status(404).json({ message: "No user with that ID"});
            }

            return res.status(200).json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }, 

    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    async updateUser(req, res) {
        try {
          const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
          );
    
          if (!user) {
            return res.status(404).json({ message: 'No user with this ID' });
          }
    
          return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }

            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            return res.status(200).json({ message: 'User, thought, and reaction deleted!' });
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async addFriend(req, res) {
        try {
            const friend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!friend) {
                return res.status(404).json({ message: 'No friend found with that ID :(' });
            }

            return res.status(200).json(friend);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async deleteFriend(req, res) {
        try {
            const friend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!friend) {
                return res.status(404).json({ message: 'No friend found with that ID :(' });
            }

            return res.status(200).json(student);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
};

module.exports = userController;