const Budget = require('../models/Budget');

// @desc    Get budget for a specific month
// @route   GET /api/budget
// @access  Private
const getBudget = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: 'Please provide month and year' });
        }

        const budget = await Budget.findOne({
            user: req.user,
            month,
            year
        });

        res.json(budget || { amount: 0 }); // Return 0 if no budget set
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Set or update budget
// @route   POST /api/budget
// @access  Private
const setBudget = async (req, res) => {
    const { month, year, amount } = req.body;

    try {
        let budget = await Budget.findOne({ user: req.user, month, year });

        if (budget) {
            budget.amount = amount;
            await budget.save();
        } else {
            budget = new Budget({
                user: req.user,
                month,
                year,
                amount
            });
            await budget.save();
        }

        res.json(budget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getBudget, setBudget };
