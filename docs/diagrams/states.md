# 📊 Диаграммы состояний

### 1. Загрузка данных
```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> RequestCategories : "Приложение открыто"

    state "Запрос категорий" as RequestCategories {
        [*] --> SendingCategoryRequest
        SendingCategoryRequest --> CategorySuccess : "200 OK"
        SendingCategoryRequest --> CategoryError : "Ошибка"
        CategorySuccess --> [*]
        CategoryError --> [*]
    }

    RequestCategories --> RequestExpenses : "Категории загружены"
    RequestCategories --> LoadError : "Ошибка загрузки"

    state "Запрос расходов" as RequestExpenses {
        [*] --> SendingExpenseRequest
        SendingExpenseRequest --> ExpenseSuccess : "200 OK"
        SendingExpenseRequest --> ExpenseError : "Ошибка"
        ExpenseSuccess --> [*]
        ExpenseError --> [*]
    }

    RequestExpenses --> RequestBudgets : "Расходы загружены"
    RequestExpenses --> LoadError : "Ошибка загрузки"

    state "Запрос бюджетов" as RequestBudgets {
        [*] --> SendingBudgetRequest
        SendingBudgetRequest --> BudgetSuccess : "200 OK"
        SendingBudgetRequest --> BudgetError : "Ошибка"
        BudgetSuccess --> [*]
        BudgetError --> [*]
    }

    RequestBudgets --> RequestAnalytics : "Бюджеты загружены"
    RequestBudgets --> LoadError : "Ошибка загрузки"

    state "Запрос аналитики" as RequestAnalytics {
        [*] --> SendingAnalyticsRequest
        SendingAnalyticsRequest --> AnalyticsSuccess : "200 OK"
        SendingAnalyticsRequest --> AnalyticsError : "Ошибка"
        AnalyticsSuccess --> [*]
        AnalyticsError --> [*]
    }

    RequestAnalytics --> AllDataLoaded : "Аналитика загружена"
    RequestAnalytics --> LoadError : "Ошибка загрузки"

    state "Ошибка загрузки" as LoadError {
        [*] --> ErrorState
        ErrorState --> Retry : "Пользователь нажал 'Повторить'"
        Retry --> RequestCategories
        ErrorState --> Idle : "Пользователь отменил"
    }

    AllDataLoaded --> Idle : "Готов к использованию"
    Idle --> [*]
```

### 2. Добавление расхода
```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> FormOpened : "Нажатие 'Добавить расход'"

    state "Форма расхода" as FormOpened {
        [*] --> DataEntering
        DataEntering --> DataValidation : "Нажатие 'Сохранить'"
    }

    state "Проверка данных" as DataValidation {
        [*] --> Validating
        Validating --> DataValid : "Данные валидны"
        Validating --> DataInvalid : "Данные невалидны"
        DataInvalid --> DataEntering : "Исправление ошибок"
    }

    DataValid --> SendingRequest : "Отправка запроса"

    state "Отправка запроса" as SendingRequest {
        [*] --> RequestSent
        RequestSent --> RequestSuccess : "201 Created"
        RequestSent --> ServerError : "Ошибка сервера"
        ServerError --> Retry : "Пользователь нажал 'Повторить'"
        Retry --> RequestSent
    }

    RequestSuccess --> ExpenseCreated : "Расход создан"

    state "Расход создан" as ExpenseCreated {
        [*] --> SuccessState
        SuccessState --> Idle : "Возврат к списку"
    }

    state "Ошибка сервера" as ServerError {
        [*] --> ErrorState
        ErrorState --> Retry : "Пользователь нажал 'Повторить'"
        ErrorState --> FormOpened : "Возврат к форме"
    }

    Idle --> [*]
```

### 3. Экспорт данных в CSV
```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> ExportInitiated : "Нажатие 'Экспортировать в CSV'"

    state "Инициализация экспорта" as ExportInitiated {
        [*] --> PreparingData
    }

    state "Подготовка данных" as PreparingData {
        [*] --> DataFetching
        DataFetching --> DataReady : "Данные получены"
        DataFetching --> DataError : "Ошибка получения данных"
        DataError --> Retry : "Повторить"
    }

    DataReady --> GeneratingCSV : "Данные готовы"

    state "Генерация CSV" as GeneratingCSV {
        [*] --> CSVProcessing
        CSVProcessing --> CSVGenerated : "CSV создан"
        CSVProcessing --> CSVError : "Ошибка генерации"
        CSVError --> Retry : "Повторить"
    }

    CSVGenerated --> DownloadingFile : "Файл готов"

    state "Загрузка файла" as DownloadingFile {
        [*] --> FileDownload
        FileDownload --> FileSaved : "Файл сохранен"
        FileDownload --> DownloadError : "Ошибка загрузки"
        DownloadError --> Retry : "Повторить"
    }

    FileSaved --> ExportCompleted : "Экспорт завершен"

    state "Экспорт завершен" as ExportCompleted {
        [*] --> SuccessState
        SuccessState --> Idle : "Возврат к приложению"
    }

    state "Ошибка" as Retry {
        [*] --> ErrorState
        ErrorState --> PreparingData : "Повторная попытка"
        ErrorState --> Idle : "Отмена операции"
    }

    Idle --> [*]
```