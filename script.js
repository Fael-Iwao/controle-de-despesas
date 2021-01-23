const transactionsUL = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : []


const removeTransaction = id => {
	transactions = transactions.filter(transaction => transaction.id !== id);
	updateLocalStorage();
	init();
}

const addTransactionIntoDOM = ({ id, name, amount }) => {
	const operator = amount < 0 ? '-' : '+';
	const CSSClass = amount < 0 ? 'minus' : 'plus';
	const amountWithoutOperator = Math.abs(amount);
	const li = document.createElement('li');

	
	li.classList.add(CSSClass);
	li.innerHTML = `
		${name} <span> ${operator} R$ ${amountWithoutOperator}
		</span><button class="delete-btn" onclick="removeTransaction(${id})">x</button>
	`;
	transactionsUL.prepend(li);
}

const getExpense = transactionsAmounts => Math.abs(transactionsAmounts
	.filter((value) => value < 0)
	.reduce((accumulator, transaction) => accumulator + transaction, 0))
	.toFixed(2);
	
const getIncome = transactionsAmounts => transactionsAmounts
	.filter(value => value > 0)
	.reduce((accumulator, transaction) => accumulator + transaction, 0)
	.toFixed(2);

const getTotal = transactionsAmounts => transactionsAmounts
	.reduce((accumulator, transaction) => accumulator + transaction, 0)
	.toFixed(2);


const updateBalanceValues = () =>{
	const transactionsAmounts = transactions.map(({ amount }) => amount);
	
	const total = getTotal(transactionsAmounts)
	const income = getIncome(transactionsAmounts)
	const expense = getExpense(transactionsAmounts);

	incomeDisplay.innerText = `R$ ${income}`;
	expenseDisplay.innerText = `- R$ ${expense}`;
	balanceDisplay.innerText = `R$ ${total}`;
}

const init = () => {
	transactionsUL.innerHTML = '';
	transactions.forEach(addTransactionIntoDOM);
	updateBalanceValues();
}

const updateLocalStorage = () => {
	localStorage.setItem('transactions', JSON.stringify(transactions))
}


const generateID = () => Math.round(Math.random() * 1000)



const addToTransactionsArray = (transactionName, transactionAmount) => {
	transactions.push({
		id: generateID(),
		name: transactionName,
		amount: Number(transactionAmount)
	})
}

const cleanInputs = () => {
	inputTransactionName.value = '';
	inputTransactionAmount.value = '';
}

const handleFormSubmit = event => {
	event.preventDefault();

	const transactionName = inputTransactionName.value.trim();
	const transactionAmount = inputTransactionAmount.value.trim();
	const isSomeInputEmpty = transactionName === '' || transactionAmount === ''
	
	if(isSomeInputEmpty){
		alert('Preencha todos os campos');
		return;
	}

	addToTransactionsArray(transactionName, transactionAmount)
	updateLocalStorage();
	init();
	cleanInputs();
	
}

init();
form.addEventListener('submit', handleFormSubmit)