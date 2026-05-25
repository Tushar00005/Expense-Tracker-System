const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

const getDashboardData = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: 'Please provide month and year' });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Fetch Budget
        const budgetDoc = await Budget.findOne({ user: req.user, month, year });
        const budgetAmount = budgetDoc ? budgetDoc.amount : 0;

        // Fetch Expenses
        const expenses = await Expense.find({
            user: req.user,
            date: { $gte: startDate, $lte: endDate }
        });

        // Calculations
        const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const totalWasted = expenses
            .filter(exp => exp.type === 'Waste')
            .reduce((acc, curr) => acc + curr.amount, 0);
        const remaining = budgetAmount - totalSpent;

        // Category Breakdown
        const categoryData = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

        // Daily Breakdown (1-31)
        const daysInMonth = new Date(year, month, 0).getDate();
        const dailyData = Array(daysInMonth).fill(0);
        expenses.forEach(exp => {
            const day = new Date(exp.date).getDate();
            dailyData[day - 1] += exp.amount;
        });

        // Insight Generation
        let insight = "You are doing great!";
        if (budgetAmount > 0) {
            if (totalSpent > budgetAmount) {
                insight = "You have exceeded your monthly budget!";
            } else if (totalSpent > 0.8 * budgetAmount) {
                insight = "Alert: You have reached 80% of your budget.";
            }
        }

        // Find highest spending category
        let maxCategory = '';
        let maxVal = 0;
        for (const [cat, val] of Object.entries(categoryData)) {
            if (val > maxVal) {
                maxVal = val;
                maxCategory = cat;
            }
        }
        if (maxCategory) {
            insight += ` You spent the most on ${maxCategory} this month.`;
        }

        // Check waste
        if (totalWasted > totalSpent * 0.3 && totalSpent > 0) {
            insight += " Try to cut down on wasted expenses.";
        }

        res.json({
            budget: budgetAmount,
            totalSpent,
            totalWasted,
            remaining,
            categoryData,
            dailyData,
            insight,
            alert: budgetAmount > 0 && totalSpent >= 0.8 * budgetAmount
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardData };
