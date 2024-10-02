// script.js

// Apply theme preference
function applyThemePreference() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    }
  }
  
  applyThemePreference();
  
  // Utility function to generate unique IDs
  function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Event listener for the welcome form
  document.getElementById('welcomeForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Get form values
    const budgetName = document.getElementById('budgetName').value;
    const userName = document.getElementById('userName').value;
    const budgetAmount = parseFloat(document.getElementById('budgetAmount').value);
    const budgetPeriod = document.getElementById('budgetPeriod').value;
  
    // Validation
    if (budgetAmount <= 0) {
      alert('Budget amount must be greater than zero.');
      return;
    }
  
    // Create a new budget object
    const newBudget = {
      id: generateId(),
      name: budgetName,
      userName: userName,
      totalBudget: budgetAmount,
      budgetPeriod: budgetPeriod,
      categories: [],
      notes: '',
      goals: [],
    };
  
    // Add predefined categories
    const includePredefined = confirm('Would you like to include predefined categories (Rent, Utilities, Groceries, etc.)?');
    if (includePredefined) {
      newBudget.categories = [
        { name: 'Rent', expenses: [], spent: 0, limit: null, subcategories: [] },
        { name: 'Utilities', expenses: [], spent: 0, limit: null, subcategories: [] },
        { name: 'Groceries', expenses: [], spent: 0, limit: null, subcategories: [] },
        { name: 'Transportation', expenses: [], spent: 0, limit: null, subcategories: [] },
        { name: 'Entertainment', expenses: [], spent: 0, limit: null, subcategories: [] },
      ];
    }
  
    // Get existing budgets from localStorage
    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    budgets.push(newBudget);
    localStorage.setItem('budgets', JSON.stringify(budgets));
  
    // Set the current budget ID
    localStorage.setItem('currentBudgetId', newBudget.id);
  
    // Redirect to the home page
    window.location.href = 'home.html';
  });
  
  // Toggle side menu
  const sideMenu = document.getElementById('sideMenu');
  const menuToggle = document.getElementById('menuToggle');
  const closeMenu = document.getElementById('closeMenu');
  
  menuToggle?.addEventListener('click', () => {
    sideMenu.classList.toggle('-translate-x-full');
  });
  
  closeMenu?.addEventListener('click', () => {
    sideMenu.classList.add('-translate-x-full');
  });
  
  // Toggle theme from side menu
  document.getElementById('toggleThemeSideMenu')?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDarkMode = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  });
  
  // Load existing budgets into side menu
  function loadSideMenuBudgets() {
    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    const budgetList = document.getElementById('budgetList');
    budgetList.innerHTML = ''; // Clear existing list
  
    if (budgets.length === 0) {
      budgetList.innerHTML = '<p class="text-gray-700 dark:text-gray-300">No existing budgets found.</p>';
      return;
    }
  
    budgets.forEach(budget => {
      const listItem = document.createElement('li');
      listItem.className = 'flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-2 rounded-md';
  
      listItem.innerHTML = `
        <div>
          <span class="text-gray-800 dark:text-white font-semibold">${budget.name}</span>
          <p class="text-sm text-gray-600 dark:text-gray-400">${budget.userName}</p>
        </div>
        <div class="flex items-center space-x-2">
          <button class="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 select-budget" data-id="${budget.id}">Select</button>
          <button class="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 delete-budget" data-id="${budget.id}">Delete</button>
        </div>
      `;
  
      budgetList.appendChild(listItem);
    });
  
    // Add event listeners to select buttons
    budgetList.querySelectorAll('.select-budget').forEach(button => {
      button.addEventListener('click', () => {
        localStorage.setItem('currentBudgetId', button.getAttribute('data-id'));
        window.location.href = 'home.html';
      });
    });
  
    // Add event listeners to delete buttons
    budgetList.querySelectorAll('.delete-budget').forEach(button => {
      button.addEventListener('click', () => {
        const budgetId = button.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this budget? This action cannot be undone.')) {
          deleteBudget(budgetId);
        }
      });
    });
  }
  
  // Function to delete a budget
  function deleteBudget(budgetId) {
    let budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    budgets = budgets.filter(budget => budget.id !== budgetId);
    localStorage.setItem('budgets', JSON.stringify(budgets));
  
    // If the deleted budget was the current budget, remove it
    if (localStorage.getItem('currentBudgetId') === budgetId) {
      localStorage.removeItem('currentBudgetId');
    }
  
    // Refresh the side menu
    loadSideMenuBudgets();
  }
  
  // Call the function to load budgets when the page loads
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    loadSideMenuBudgets();
  }
  
  // Export budget data
  document.getElementById('exportData')?.addEventListener('click', () => {
    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    if (budgets.length === 0) {
      alert('No data to export.');
      return;
    }
    let filename = prompt('Enter a filename for the exported data (without extension):', 'budgets');
    if (filename === null) {
      // User cancelled the prompt
      return;
    }
    filename = filename.trim() ? filename.trim() + '.json' : 'budgets.json';
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(budgets));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", filename);
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    document.body.removeChild(dlAnchorElem);
  });
  
  // Import budget data
  document.getElementById('importData')?.addEventListener('change', function(event) {
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const file = event.target.files[0];
    if (file) {
      fileNameDisplay.textContent = `Selected file: ${file.name}`;
    } else {
      fileNameDisplay.textContent = '';
      return;
    }
  
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importedBudgets = JSON.parse(e.target.result);
        localStorage.setItem('budgets', JSON.stringify(importedBudgets));
        alert('Data imported successfully!');
        loadSideMenuBudgets(); // Refresh the budget list
      } catch (error) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  });
  
  // Function to load budget data on home page
  function loadBudgetData() {
    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    const currentBudgetId = localStorage.getItem('currentBudgetId');
    const budget = budgets.find(b => b.id === currentBudgetId);
  
    if (!budget) {
      // If no budget, redirect to welcome page
      window.location.href = 'index.html';
      return;
    }
  
    // Display greeting
    document.getElementById('greeting').textContent = `Hello, ${budget.userName}!`;
  
    // Display budget information
    document.getElementById('totalBudget').textContent = `$${budget.totalBudget.toFixed(2)}`;
    document.getElementById('budgetPeriodDisplay').textContent = budget.budgetPeriod.charAt(0).toUpperCase() + budget.budgetPeriod.slice(1);
  
    // Calculate total spent and amount left
    const totalSpent = budget.categories.reduce((sum, category) => sum + category.spent, 0);
    const amountLeft = budget.totalBudget - totalSpent;
    document.getElementById('amountLeft').textContent = `$${amountLeft.toFixed(2)}`;
  
    // Update progress bar
    const budgetProgress = document.getElementById('budgetProgress');
    const budgetUsage = (totalSpent / budget.totalBudget) * 100;
    budgetProgress.style.width = `${budgetUsage}%`;
  
    // Provide feedback messages
    const feedbackMessage = document.getElementById('feedbackMessage');
    if (budgetUsage < 75) {
      feedbackMessage.textContent = '👍 You are doing great with your spending!';
      feedbackMessage.className = 'mb-6 text-xl font-semibold text-green-600';
    } else if (budgetUsage >= 75 && budgetUsage <= 100) {
      feedbackMessage.textContent = '⚠️ Watch your spending, you are nearing your budget limit.';
      feedbackMessage.className = 'mb-6 text-xl font-semibold text-yellow-600';
    } else {
      feedbackMessage.textContent = '🚨 You have exceeded your budget limit!';
      feedbackMessage.className = 'mb-6 text-xl font-semibold text-red-600';
    }
  
    // Prepare data for the chart
    const categoriesWithSpending = budget.categories.filter(category => category.spent > 0);
    const categoryNames = categoriesWithSpending.map(category => category.name);
    const categorySpending = categoriesWithSpending.map(category => category.spent);
    const chartColors = [
      '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0',
      '#9966ff', '#ff9f40', '#f67019', '#f53794',
      '#acc236', '#166a8f', '#00a950', '#58595b',
      '#8549ba'
    ];
  
    // Create the chart
    const ctx = document.getElementById('budgetChart')?.getContext('2d');
    if (ctx) {
      const budgetChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categoryNames,
          datasets: [{
            data: categorySpending,
            backgroundColor: chartColors.slice(0, categoriesWithSpending.length),
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: document.documentElement.classList.contains('dark') ? 'white' : 'black',
              },
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.label || '';
                  if (label) {
                    label += ': ';
                  }
                  label += `$${context.parsed}`;
                  return label;
                }
              }
            }
          },
        },
      });
    }
  
    // Load categories into grid view
    const categoriesGrid = document.getElementById('categoriesGrid');
    categoriesGrid.innerHTML = ''; // Clear existing categories
  
    budget.categories.forEach((category, index) => {
      const categoryCard = document.createElement('div');
      categoryCard.className = 'bg-white dark:bg-gray-800 p-4 rounded-lg shadow';
      categoryCard.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">${category.name}</h3>
        <p class="text-gray-600 dark:text-gray-400">Spent: $${category.spent.toFixed(2)}</p>
        <button class="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 view-expenses" data-index="${index}">View Expenses</button>
      `;
      categoriesGrid.appendChild(categoryCard);
  
      // Add event listener to view expenses button
      categoryCard.querySelector('.view-expenses').addEventListener('click', () => {
        viewExpenses(index);
      });
    });
  
    // View switching functionality
    const chartContainer = document.getElementById('chartContainer');
    const chartViewBtn = document.getElementById('chartViewBtn');
    const gridViewBtn = document.getElementById('gridViewBtn');
  
    chartViewBtn?.addEventListener('click', () => {
      chartContainer.classList.remove('hidden');
      categoriesGrid.classList.add('hidden');
      chartViewBtn.classList.replace('bg-gray-600', 'bg-blue-600');
      gridViewBtn.classList.replace('bg-blue-600', 'bg-gray-600');
    });
  
    gridViewBtn?.addEventListener('click', () => {
      chartContainer.classList.add('hidden');
      categoriesGrid.classList.remove('hidden');
      chartViewBtn.classList.replace('bg-blue-600', 'bg-gray-600');
      gridViewBtn.classList.replace('bg-gray-600', 'bg-blue-600');
    });
  
    // Load notes
    document.getElementById('notes').value = budget.notes;
  
    // Save notes as the user types
    document.getElementById('notes').addEventListener('input', () => {
      budget.notes = document.getElementById('notes').value;
      // Update budgets array
      const budgetIndex = budgets.findIndex(b => b.id === currentBudgetId);
      budgets[budgetIndex] = budget;
      localStorage.setItem('budgets', JSON.stringify(budgets));
    });
  
    // Load financial goals
    loadGoals(budget);
  }
  
  // Function to load financial goals
  function loadGoals(budget) {
    const goalsList = document.getElementById('goalsList');
    goalsList.innerHTML = ''; // Clear existing goals
  
    budget.goals.forEach((goal, index) => {
      const goalItem = document.createElement('div');
      goalItem.className = 'bg-white dark:bg-gray-800 p-4 rounded-lg shadow';
  
      const progressPercentage = ((goal.saved / goal.amount) * 100).toFixed(2);
  
      goalItem.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">${goal.name}</h3>
        <p class="text-gray-600 dark:text-gray-400">Saved: $${goal.saved.toFixed(2)} / $${goal.amount.toFixed(2)}</p>
        <div class="relative pt-1">
          <div class="overflow-hidden h-4 mb-4 text-xs flex rounded bg-green-200">
            <div style="width: ${progressPercentage}%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
          </div>
        </div>
        <button class="edit-goal bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" data-index="${index}">Edit</button>
      `;
      goalsList.appendChild(goalItem);
  
      // Add event listener to the "Edit" button
      goalItem.querySelector('.edit-goal').addEventListener('click', () => {
        openGoalModal('Edit Goal', goal, index);
      });
    });
  }
  
  
  // Add goal button event listener
  document.getElementById('addGoal')?.addEventListener('click', () => {
    openGoalModal('Add Goal');
  });
  
  // Function to open goal modal
  function openGoalModal(title, goal = null, index = null) {
    const goalModal = document.getElementById('goalModal');
    const goalModalTitle = document.getElementById('goalModalTitle');
    const goalNameInput = document.getElementById('goalName');
    const goalAmountInput = document.getElementById('goalAmount');
    const goalSavedInput = document.getElementById('goalSaved');
  
    goalModalTitle.textContent = title;
    goalNameInput.value = goal ? goal.name : '';
    goalAmountInput.value = goal ? goal.amount : '';
    goalSavedInput.value = goal ? goal.saved : '';
  
    goalModal.classList.remove('hidden');
  
    // Handle form submission
    const goalForm = document.getElementById('goalForm');
    goalForm.onsubmit = function(event) {
      event.preventDefault();
  
      // Validation
      if (goalNameInput.value.trim() === '') {
        alert('Goal name cannot be empty.');
        return;
      }
      if (parseFloat(goalAmountInput.value) <= 0) {
        alert('Goal amount must be greater than zero.');
        return;
      }
      if (parseFloat(goalSavedInput.value) < 0) {
        alert('Amount saved cannot be negative.');
        return;
      }
  
      const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
      const currentBudgetId = localStorage.getItem('currentBudgetId');
      const budget = budgets.find(b => b.id === currentBudgetId);
      const budgetIndex = budgets.findIndex(b => b.id === currentBudgetId);
  
      const newGoal = {
        name: goalNameInput.value,
        amount: parseFloat(goalAmountInput.value),
        saved: parseFloat(goalSavedInput.value),
      };
  
      if (index !== null) {
        // Edit existing goal
        budget.goals[index] = newGoal;
      } else {
        // Add new goal
        budget.goals.push(newGoal);
      }
  
      budgets[budgetIndex] = budget;
      localStorage.setItem('budgets', JSON.stringify(budgets));
  
      goalModal.classList.add('hidden');
      loadGoals(budget);
    };
  
    // Handle cancel button
    document.getElementById('cancelGoal').onclick = function() {
      goalModal.classList.add('hidden');
    };
  }
  
  
  // Function to view expenses in a category
  function viewExpenses(categoryIndex) {
    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    const currentBudgetId = localStorage.getItem('currentBudgetId');
    const budget = budgets.find(b => b.id === currentBudgetId);
  
    const category = budget.categories[categoryIndex];
  
    const expensesModal = document.getElementById('expensesModal');
    const expensesModalTitle = document.getElementById('expensesModalTitle');
    const expensesList = document.getElementById('expensesList');
  
    expensesModalTitle.textContent = `Expenses for ${category.name}`;
    expensesList.innerHTML = '';
  
    if (category.expenses.length === 0 && (!category.subcategories || category.subcategories.length === 0)) {
      expensesList.innerHTML = '<p class="text-gray-700 dark:text-gray-300">No expenses recorded for this category.</p>';
    } else {
      // List expenses in the category
      category.expenses.forEach(expense => {
        const listItem = document.createElement('li');
        listItem.className = 'flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-2 rounded-md';
        listItem.innerHTML = `
          <span class="text-gray-800 dark:text-white">${expense.description}</span>
          <span class="text-gray-800 dark:text-white">$${expense.amount.toFixed(2)}</span>
        `;
        expensesList.appendChild(listItem);
      });
  
      // List expenses in subcategories
      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach(subcat => {
          if (subcat.expenses.length > 0) {
            const subcatHeader = document.createElement('li');
            subcatHeader.className = 'mt-4 text-gray-700 dark:text-gray-300 font-semibold';
            subcatHeader.textContent = `Subcategory: ${subcat.name}`;
            expensesList.appendChild(subcatHeader);
  
            subcat.expenses.forEach(expense => {
              const listItem = document.createElement('li');
              listItem.className = 'flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-2 rounded-md';
              listItem.innerHTML = `
                <span class="text-gray-800 dark:text-white">${expense.description}</span>
                <span class="text-gray-800 dark:text-white">$${expense.amount.toFixed(2)}</span>
              `;
              expensesList.appendChild(listItem);
            });
          }
        });
      }
    }
  
    expensesModal.classList.remove('hidden');
  
    // Close modal
    document.getElementById('closeExpensesModal').onclick = function() {
      expensesModal.classList.add('hidden');
    };
  }
  
  // Load data based on the current page
  if (window.location.pathname.endsWith('home.html')) {
    loadBudgetData();
  } else if (window.location.pathname.endsWith('budget.html')) {
    loadBudgetManagementData();
  }
  
  // Function to load budget data on budget management page
  function loadBudgetManagementData() {
    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    const currentBudgetId = localStorage.getItem('currentBudgetId');
    const budget = budgets.find(b => b.id === currentBudgetId);
  
    if (!budget) {
      // If no budget, redirect to welcome page
      window.location.href = 'index.html';
      return;
    }
  
    // Display budget details for editing
    document.getElementById('editBudgetName').value = budget.name;
    document.getElementById('editUserName').value = budget.userName;
    document.getElementById('editBudgetAmount').value = budget.totalBudget;
    document.getElementById('editBudgetPeriod').value = budget.budgetPeriod;
  
    // Display categories
    const categoriesList = document.getElementById('categoriesList');
    categoriesList.innerHTML = ''; // Clear existing categories
  
    budget.categories.forEach((category, index) => {
      const categoryItem = document.createElement('div');
      categoryItem.className = 'bg-white dark:bg-gray-800 p-4 rounded-lg shadow';
  
      categoryItem.innerHTML = `
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">${category.name}</h3>
            <p class="text-gray-600 dark:text-gray-400">Spent: $${category.spent.toFixed(2)} ${category.limit ? `/ Limit: $${category.limit}` : ''}</p>
          </div>
          <div>
            <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2 add-expense" data-index="${index}">Add Expense</button>
            <button class="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 mr-2 edit-category" data-index="${index}">Edit</button>
            <button class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 delete-category" data-index="${index}">Delete</button>
          </div>
        </div>
      `;
  
      categoriesList.appendChild(categoryItem);
    });
  }
  
  // Event delegation for dynamically added buttons
  document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('add-expense')) {
      const index = parseInt(event.target.getAttribute('data-index'));
      openExpenseModal(index);
    } else if (event.target && event.target.classList.contains('edit-category')) {
      const index = parseInt(event.target.getAttribute('data-index'));
      const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
      const currentBudgetId = localStorage.getItem('currentBudgetId');
      const budget = budgets.find(b => b.id === currentBudgetId);
      const category = budget.categories[index];
      openCategoryModal('Edit Category', category, index);
    } else if (event.target && event.target.classList.contains('delete-category')) {
      const index = parseInt(event.target.getAttribute('data-index'));
      if (confirm('Are you sure you want to delete this category?')) {
        deleteCategory(index);
        loadBudgetManagementData();
      }
    }
  });
  
  // Function to open expense modal
  function openExpenseModal(categoryIndex) {
    const expenseModal = document.getElementById('expenseModal');
    const expenseModalTitle = document.getElementById('expenseModalTitle');
    const expenseDescriptionInput = document.getElementById('expenseDescription');
    const expenseAmountInput = document.getElementById('expenseAmount');
    const expenseSubcategorySelect = document.getElementById('expenseSubcategory');
  
    expenseModalTitle.textContent = 'Add Expense';
    expenseDescriptionInput.value = '';
    expenseAmountInput.value = '';
    expenseSubcategorySelect.innerHTML = '<option value="">None</option>';
  
    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    const currentBudgetId = localStorage.getItem('currentBudgetId');
    const budget = budgets.find(b => b.id === currentBudgetId);
  
    const category = budget.categories[categoryIndex];
  
    // Load subcategories into the select
    if (category.subcategories && category.subcategories.length > 0) {
      category.subcategories.forEach((subcat, idx) => {
        const option = document.createElement('option');
        option.value = idx;
        option.textContent = subcat.name;
        expenseSubcategorySelect.appendChild(option);
      });
    }
  
    expenseModal.classList.remove('hidden');
  
    // Handle form submission
    const expenseForm = document.getElementById('expenseForm');
    expenseForm.onsubmit = function(event) {
      event.preventDefault();
  
      // Validation
      if (expenseDescriptionInput.value.trim() === '') {
        alert('Expense description cannot be empty.');
        return;
      }
      if (parseFloat(expenseAmountInput.value) <= 0) {
        alert('Expense amount must be greater than zero.');
        return;
      }
  
      const expense = {
        description: expenseDescriptionInput.value,
        amount: parseFloat(expenseAmountInput.value),
        date: new Date().toISOString(),
      };
  
      const subcategoryIndex = expenseSubcategorySelect.value;
  
      if (subcategoryIndex !== '') {
        // Add expense to subcategory
        const subcategory = category.subcategories[subcategoryIndex];
        subcategory.expenses.push(expense);
        subcategory.spent += expense.amount;
      } else {
        // Add expense to category
        category.expenses.push(expense);
      }
  
      // Update total spent in category
      category.spent += expense.amount;
  
      budgets[budgets.findIndex(b => b.id === currentBudgetId)] = budget;
      localStorage.setItem('budgets', JSON.stringify(budgets));
  
      expenseModal.classList.add('hidden');
      loadBudgetManagementData();
    };
  
    // Handle cancel button
    document.getElementById('cancelExpense').onclick = function() {
      expenseModal.classList.add('hidden');
    };
  }
  
  // Function to delete a category
  function deleteCategory(index) {
    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    const currentBudgetId = localStorage.getItem('currentBudgetId');
    const budget = budgets.find(b => b.id === currentBudgetId);
    const budgetIndex = budgets.findIndex(b => b.id === currentBudgetId);
  
    budget.categories.splice(index, 1);
    budgets[budgetIndex] = budget;
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }
  
  // Function to open category modal
  function openCategoryModal(title, category = null, index = null) {
    const categoryModal = document.getElementById('categoryModal');
    const categoryModalTitle = document.getElementById('categoryModalTitle');
    const categoryNameInput = document.getElementById('categoryName');
    const categoryLimitInput = document.getElementById('categoryLimit');
    const subcategoriesList = document.getElementById('subcategoriesList');
  
    categoryModalTitle.textContent = title;
    categoryNameInput.value = category ? category.name : '';
    categoryLimitInput.value = category && category.limit ? category.limit : '';
  
    // Load existing subcategories
    subcategoriesList.innerHTML = '';
    const subcategories = category && category.subcategories ? category.subcategories : [];
    subcategories.forEach(subcat => {
      addSubcategoryInput(subcat.name, subcat.limit);
    });
  
    categoryModal.classList.remove('hidden');
  
    // Handle form submission
    const categoryForm = document.getElementById('categoryForm');
    categoryForm.onsubmit = function(event) {
      event.preventDefault();
  
      // Validation
      if (categoryNameInput.value.trim() === '') {
        alert('Category name cannot be empty.');
        return;
      }
  
      const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
      const currentBudgetId = localStorage.getItem('currentBudgetId');
      const budget = budgets.find(b => b.id === currentBudgetId);
      const budgetIndex = budgets.findIndex(b => b.id === currentBudgetId);
  
      // Collect subcategories
      const subcategoryInputs = subcategoriesList.querySelectorAll('.subcategory-input');
      const subcategoriesData = [];
      subcategoryInputs.forEach(inputGroup => {
        const subcatName = inputGroup.querySelector('.subcategory-name').value.trim();
        const subcatLimit = parseFloat(inputGroup.querySelector('.subcategory-limit').value) || null;
        if (subcatName !== '') {
          subcategoriesData.push({
            name: subcatName,
            limit: subcatLimit,
            expenses: [],
            spent: 0,
          });
        }
      });
  
      const newCategory = {
        name: categoryNameInput.value,
        limit: parseFloat(categoryLimitInput.value) || null,
        expenses: category ? category.expenses : [],
        spent: category ? category.spent : 0,
        subcategories: subcategoriesData,
      };
  
      if (index !== null) {
        // Edit existing category
        budget.categories[index] = newCategory;
      } else {
        // Add new category
        budget.categories.push(newCategory);
      }
  
      budgets[budgetIndex] = budget;
      localStorage.setItem('budgets', JSON.stringify(budgets));
  
      categoryModal.classList.add('hidden');
      loadBudgetManagementData();
    };
  
    // Handle cancel button
    document.getElementById('cancelCategory').onclick = function() {
      categoryModal.classList.add('hidden');
    };
  }
  
  // Function to add subcategory input fields
  function addSubcategoryInput(name = '', limit = '') {
    const subcategoriesList = document.getElementById('subcategoriesList');
    const subcategoryDiv = document.createElement('div');
    subcategoryDiv.className = 'subcategory-input flex space-x-2 items-center';
    subcategoryDiv.innerHTML = `
      <input type="text" class="subcategory-name w-full px-4 py-2 border rounded-md focus:outline-none focus:ring" placeholder="Subcategory Name" value="${name}">
      <input type="number" class="subcategory-limit w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring" placeholder="Limit" value="${limit}">
      <button type="button" class="remove-subcategory text-red-600 hover:text-red-800">✕</button>
    `;
    subcategoriesList.appendChild(subcategoryDiv);
  
    // Handle remove subcategory
    subcategoryDiv.querySelector('.remove-subcategory').onclick = function() {
      subcategoriesList.removeChild(subcategoryDiv);
    };
  }
  
  // Event listener for adding categories
  document.getElementById('addCategory')?.addEventListener('click', () => {
    openCategoryModal('Add Category');
  });
  
  // Event listener for adding subcategories
  document.getElementById('categoryModal')?.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'addSubcategory') {
      addSubcategoryInput();
    }
  });
  
  // Event listener for editing budget details
  document.getElementById('editBudgetForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Get form values
    const budgetName = document.getElementById('editBudgetName').value;
    const userName = document.getElementById('editUserName').value;
    const budgetAmount = parseFloat(document.getElementById('editBudgetAmount').value);
    const budgetPeriod = document.getElementById('editBudgetPeriod').value;
  
    // Validation
    if (budgetAmount <= 0) {
      alert('Budget amount must be greater than zero.');
      return;
    }
  
    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    const currentBudgetId = localStorage.getItem('currentBudgetId');
    const budgetIndex = budgets.findIndex(b => b.id === currentBudgetId);
  
    budgets[budgetIndex].name = budgetName;
    budgets[budgetIndex].userName = userName;
    budgets[budgetIndex].totalBudget = budgetAmount;
    budgets[budgetIndex].budgetPeriod = budgetPeriod;
  
    localStorage.setItem('budgets', JSON.stringify(budgets));
  
    alert('Budget details updated successfully!');
  });
  
  // Toggle theme
  document.getElementById('toggleTheme')?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDarkMode = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  });
  