# 📊 Диаграммы последовательностей

### 1. Загрузка данных
```mermaid
sequenceDiagram
    participant User as Пользователь
    participant Frontend as Frontend
    participant Categories as CategoryController
    participant Expenses as ExpenseController
    participant Budgets as BudgetController
    participant Analytics as AnalyticsController
    participant CategoryService as CategoryService
    participant ExpenseService as ExpenseService
    participant BudgetService as BudgetService
    participant AnalyticsService as AnalyticsService
    participant CategoryRepo as CategoryRepository
    participant ExpenseRepo as ExpenseRepository
    participant BudgetRepo as BudgetRepository

    User->>Frontend: Открывает приложение
    Frontend->>Categories: GET /api/categories
    Categories->>CategoryService: getAllCategories()
    CategoryService->>CategoryRepo: findAll()
    CategoryRepo-->>CategoryService: Возвращает список категорий
    CategoryService-->>Categories: Возвращает список категорий
    Categories-->>Frontend: Возвращает список категорий

    Frontend->>Expenses: GET /api/expenses
    Expenses->>ExpenseService: getAllExpenses()
    ExpenseService->>ExpenseRepo: findAll()
    ExpenseRepo-->>ExpenseService: Возвращает список расходов
    ExpenseService-->>Expenses: Возвращает список расходов
    Expenses-->>Frontend: Возвращает список расходов

    Frontend->>Budgets: GET /api/budgets
    Budgets->>BudgetService: findAllBudgets()
    BudgetService->>BudgetRepo: findAll()
    BudgetRepo-->>BudgetService: Возвращает список бюджетов
    BudgetService-->>Budgets: Возвращает список бюджетов
    Budgets-->>Frontend: Возвращает список бюджетов

    Frontend->>Analytics: GET /api/analytics/balance
    Analytics->>AnalyticsService: getTotalBalance()
    AnalyticsService->>ExpenseRepo: findAll()
    ExpenseRepo-->>AnalyticsService: Возвращает все расходы
    AnalyticsService-->>Analytics: Возвращает общий баланс
    Analytics-->>Frontend: Возвращает общий баланс

    Frontend->>User: Отображает данные на главном экране
```

### 2. Добавление расхода
```mermaid
sequenceDiagram
    participant User as Пользователь
    participant Frontend as Frontend
    participant Expense as ExpenseController
    participant ExpenseService as ExpenseService
    participant CategoryService as CategoryService
    participant ExpenseRepo as ExpenseRepository
    participant CategoryRepo as CategoryRepository

    User->>Frontend: Заполняет форму расхода
    Frontend->>Expense: POST /api/expenses {name, amount, date, description, category}
    activate Expense

    Expense->>ExpenseService: createExpense(expenseRequest)
    activate ExpenseService

    ExpenseService->>CategoryService: findCategoryByName(categoryName)
    activate CategoryService

    alt Категория существует
        CategoryService-->>ExpenseService: Возвращает найденную категорию
    else Категория не существует
        CategoryService->>CategoryRepo: save(new Category(name))
        CategoryRepo-->>CategoryService: Возвращает новую категорию
        CategoryService-->>ExpenseService: Возвращает новую категорию
    end
    deactivate CategoryService

    ExpenseService->>ExpenseRepo: save(expense)
    activate ExpenseRepo
    ExpenseRepo->>ExpenseRepo: Выполняет INSERT
    ExpenseRepo-->>ExpenseService: Возвращает созданный Expense с ID
    deactivate ExpenseRepo

    ExpenseService-->>Expense: Возвращает созданный Expense
    deactivate ExpenseService

    Expense-->>Frontend: 201 Created + Expense с ID
    deactivate Expense

    Frontend->>User: Отображает успешное добавление
    User->>User: Видит обновленный список расходов
```

### 3. Экспорт данных в CSV
```mermaid
sequenceDiagram
    participant User as Пользователь
    participant Frontend as Frontend
    participant Csv as CsvController
    participant CsvService as CsvService
    participant ExpenseService as ExpenseService
    participant ExpenseRepo as ExpenseRepository
    participant CategoryService as CategoryService

    User->>Frontend: Нажимает "Экспортировать в CSV"
    Frontend->>Csv: GET /api/csv/export/expenses
    Csv->>CsvService: exportExpensesToCsv()
    activate CsvService

    CsvService->>ExpenseService: getAllExpenses()
    ExpenseService->>ExpenseRepo: findAll()
    ExpenseRepo-->>ExpenseService: Возвращает все расходы
    ExpenseService-->>CsvService: Возвращает список расходов

    loop Для каждого расхода
        CsvService->>CategoryService: findCategoryById()
        CategoryService-->>CsvService: Возвращает категорию
        CsvService->>CsvService: Формирует CSV строку
    end

    CsvService-->>Csv: Возвращает CSV данные
    deactivate CsvService

    Csv->>Frontend: Отправляет файл expenses.csv
    Frontend->>User: Сохраняет файл на устройстве
    User->>User: Получает уведомление об успешном экспорте
```