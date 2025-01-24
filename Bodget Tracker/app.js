const incomeInput = document.getElementById('income');
const expenseInput = document.getElementById('expense');
const categoryInput = document.getElementById('category');
const addButton = document.getElementById('addBtn');
const incomeDisplay = document.getElementById('incomeDisplay');
const expenseDisplay = document.getElementById('expenseDisplay');
const savingsDisplay = document.getElementById('savingsDisplay');
const transactionList = document.getElementById('transactionList');
const exportBtn = document.getElementById('exportBtn');
const themeToggle = document.getElementById('themeToggle');

let income = 0;
let expenses = [];
let totalExpense = 0;

const ctx = document.getElementById('budgetChart').getContext('2d');
const budgetChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Savings', 'Expenses'],
        datasets: [{
            data: [income - totalExpense, totalExpense],
            backgroundColor: ['#2ecc71', '#e74c3c']
        }]
    }
});

function updateUI() {
    totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    incomeDisplay.textContent = `$${income}`;
    expenseDisplay.textContent = `$${totalExpense}`;
    savingsDisplay.textContent = `$${income - totalExpense}`;
    budgetChart.data.datasets[0].data = [income - totalExpense, totalExpense];
    budgetChart.update();
    renderTransactions();
}

function renderTransactions() {
    transactionList.innerHTML = '';
    expenses.forEach((exp, index) => {
        const li = document.createElement('li');
        li.textContent = `${exp.category}: $${exp.amount}`;
        li.innerHTML += ` <button onclick="deleteExpense(${index})">Delete</button>`;
        transactionList.appendChild(li);
    });
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateUI();
}

addButton.addEventListener('click', () => {
    const amount = parseFloat(expenseInput.value);
    const category = categoryInput.value;
    if (!income) return alert("Set income first!");
    if (amount && category) {
        expenses.push({ category, amount });
        expenseInput.value = '';
        updateUI();
    }
});

incomeInput.addEventListener('blur', () => {
    const amount = parseFloat(incomeInput.value);
    if (amount) {
        income = amount;
        incomeInput.disabled = true;
        updateUI();
    }
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

exportBtn.addEventListener('click', () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + 
        expenses.map(e => `${e.category},${e.amount}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'budget_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
