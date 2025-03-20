function BillPayment() {
    const billCategories = [
        { id: 1, name: 'Electricity', icon: '⚡' },
        { id: 2, name: 'Water', icon: '💧' },
        { id: 3, name: 'Mobile', icon: '📱' },
        { id: 4, name: 'Internet', icon: '🌐' },
        { id: 5, name: 'DTH', icon: '📺' },
        { id: 6, name: 'Gas', icon: '🔥' }
    ];

    const recentBills = [
        { id: 1, name: 'Electricity Bill', amount: 2500, dueDate: '2024-03-01', status: 'pending' },
        { id: 2, name: 'Mobile Recharge', amount: 999, dueDate: '2024-02-28', status: 'paid' },
    ];

    return (
        <div className="bill-payment-container">
            <h1>Bill Payment</h1>

            <div className="bills-grid">
                {billCategories.map(category => (
                    <div key={category.id} className="card bill-category-card">
                        <div className="category-icon">{category.icon}</div>
                        <h3>{category.name}</h3>
                        <button className="btn btn-register">Pay Now</button>
                    </div>
                ))}
            </div>

            <div className="card recent-bills">
                <h2>Recent Bills</h2>
                <div className="bills-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Bill Name</th>
                                <th>Amount</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBills.map(bill => (
                                <tr key={bill.id}>
                                    <td>{bill.name}</td>
                                    <td>₹{bill.amount}</td>
                                    <td>{bill.dueDate}</td>
                                    <td>
                                        <span className={`status-badge ${bill.status}`}>
                                            {bill.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-register">
                                            {bill.status === 'pending' ? 'Pay Now' : 'View'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default BillPayment;