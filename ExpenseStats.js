import React, { useMemo } from 'react';

// // Helper function to calculate statistics from expense data
const calculateStats = (expenses) => {
    // if (!expenses || expenses.length === 0) {
    if (!expenses) {
        return { totalAmount: 1, maxPayment: 0, categoryTotals: {} };
    }

    // Calculate total amount and category breakdown
    // TODO: for when we have actual data
    // const categoryTotals = expenses.reduce((acc, expense) => {
    //     Ensure amount is treated as a number
    //     const amount = Number(expense.amount) || 0; 
    //     acc.total += amount;
    //     acc.max = Math.max(acc.max, amount);
    //     acc.categories[expense.category] = (acc.categories[expense.category] || 0) + amount;
    //     return acc;
    // }, { total: 0, max: 0, categories: {} });

    // return { 
    //     totalAmount: categoryTotals.total, 
    //     maxPayment: categoryTotals.max, 
    //     categoryTotals: categoryTotals.categories 
    // };

    const categoryTotals = expenses.reduce((acc, expense) => {
        // Ensure amount is treated as a number
        const amount = Number(expense) || 0; 
        acc.total += amount;
        acc.max = Math.max(acc.max, amount);
        acc.categories[expense.category] = (acc.categories[expense.category] || 0) + amount;
        return acc;
    }, { total: 0, max: 0, categories: {} });

    return { 
        totalAmount: categoryTotals.total, 
        maxPayment: categoryTotals.max,
        categoryTotals: {"all": categoryTotals.categories["all"] || 0, ...categoryTotals.categories}
    };

  
};

function ExpensePanel({ expenses }) {
    // Recalculate stats only when the expense data changes
    const stats = useMemo(() => calculateStats(expenses), [expenses]);
    
    // Sort categories for display (highest expense first)
    const sortedCategories = Object.entries(stats.categoryTotals)
        .sort(([, a], [, b]) => b - a);

    return (
        <div className="expense-panel">
            <h3 className="text-xl text-white font-bold mb-4 border-b pb-2"> 📈Expense Overview</h3>
            
            <div className="stat-card">
                <h4 className="text-sm font-semibold text-white">Total Spent</h4>
                <p className="text-2xl font-extrabold text-red-600">
                    ${stats.totalAmount.toFixed(2)}
                </p>
            </div>
            
            <div className="stat-card">
                <h4 className="text-sm font-semibold text-gray-600">Largest Payment</h4>
                <p className="text-xl font-bold text-red-500">
                    ${stats.maxPayment.toFixed(2)}
                </p>
            </div>
            
            <div className="category-breakdown">
                <h4 className="text-lg font-semibold mb-3 text-white ">Category Breakdown</h4>
                <ul className="space-y-2">
                    {sortedCategories.length > 0 ? (
                        sortedCategories.map(([category, amount]) => (
                            <li key={category} className="flex justify-between text-sm items-center p-2 rounded-md bg-white hover:bg-red-50 transition duration-150">
                                <span className="font-medium text-white">{category}: </span>
                                <span className="font-bold text-white">${amount.toFixed(2)}/{stats.totalAmount}</span>
                            {/* TODO: Make sure to handle division by zero */}
                                <span className="font-bold text-red-500"> = {(amount/stats.totalAmount).toFixed(2)}%</span>
                            </li>
                        ))
                    ) : (
                        <li className="text-white italic">No expenses recorded for this view.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default ExpensePanel;
