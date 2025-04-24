import { Selector, t } from 'testcafe';

const constants = {
    username: 'demouser@easecommerce.in',
    password: 'cE7iQPP^',
    taskName: `Final run: QA Task by Apaar Garg`,
    description: 'This is a test task for QA automation.',
    dueDate: (() => {
        const now = new Date();
        return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    })()
};

// Selector Helpers
const getInput = name => Selector(`input[name="${name}"]`);
const getOption = text => Selector('div').withText(text).filterVisible();

// Static Selectors
const selectors = {
    username: Selector('input[placeholder="Email"]'),
    password: Selector('input[name="password"]'),
    loginBtn: Selector('button[data-test="login-submit-button"]'),
    dashboardTab: Selector('div[aria-label="Organisation-tabs"]').with({ visibilityCheck: true }),
    menuBtn: Selector('button[aria-label="Open Settings"]'),
    employeeOption: Selector('li').withText('Switch to Employee'),
    tasksHeader: Selector('p').withText('Tasks'),
    addTaskBtn: Selector('button').withText('Add Task'),
    submitTaskBtn: Selector('button').withText('Submit'),
    confirmBtn: Selector('button').withText('Yes, create it!'),
    taskName: getInput('name'),
    dueDate: Selector('input[placeholder="DD/MM/YYYY"]'),
    description: Selector('form').find('span').withText('Description').sibling('div').find('p'),
    taskVerification: Selector('p').withText(constants.taskName)
};

// Task Field Configs
const taskFields = [
    { name: 'superCategory', option: 'Marketing Campaign' },
    { name: 'subCategory', option: 'Social Media' },
    { name: 'portals', option: 'Nykaa' },
    { name: 'products', option: 'Ayurvedic Shampoo' },
    { name: 'assignedTo', option: 'Lokesh' },
    { name: 'reviewer', option: 'Lokesh' },
    { name: 'priority', option: 'Medium' }
];

// Utility: Select Dropdown Field
async function fillDropdownField(name, optionText) {
    await t
        .click(getInput(name))
        .click(getOption(optionText));
}

// Utility: Login
async function login() {
    await t
        .typeText(selectors.username, constants.username)
        .typeText(selectors.password, constants.password)
        .click(selectors.loginBtn)
        .expect(selectors.dashboardTab.exists).ok('Dashboard not visible, login might have failed.');
}

// Utility: Fill Task Form
async function fillTaskForm() {
    for (const { name, option } of taskFields) {
        await fillDropdownField(name, option);
    }

    await t
        .selectText(selectors.taskName).pressKey('delete')
        .typeText(selectors.taskName, constants.taskName)
        .typeText(selectors.dueDate, constants.dueDate)
        .typeText(selectors.description, constants.description);
}

// Test: Full Workflow
fixture('EaseCommerce Full Workflow').page('https://easecommerce.in/app/login');

test('Full Workflow Test: Login, Switch View, Add Task, Validate Creation', async () => {
    await login();

    // Switch to Employee View
    await t
        .click(selectors.menuBtn)
        .click(selectors.employeeOption)
        .expect(selectors.tasksHeader.exists).ok('Tasks section not visible');

    // Open Add Task Form and Run Negative Scenarios
    await t
        .click(selectors.addTaskBtn)
        .typeText(selectors.description, 'Only description entered')
        .expect(selectors.submitTaskBtn.hasAttribute('disabled')).ok('Submit should be disabled')
        .selectText(selectors.description).pressKey('delete')
        .typeText(selectors.taskName, 'Task without description')
        .expect(selectors.submitTaskBtn.hasAttribute('disabled')).ok('Submit should be disabled');

    // Fill Valid Form Fields
    await fillTaskForm();

    await t
        .expect(selectors.submitTaskBtn.hasAttribute('disabled')).notOk('Submit should be enabled')
        .click(selectors.submitTaskBtn)
        .click(selectors.confirmBtn)
        .expect(selectors.taskVerification.exists).notOk('Task not found in task list');
});
