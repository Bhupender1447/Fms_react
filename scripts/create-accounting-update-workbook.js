const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const outputPath = path.join(__dirname, '..', 'public', 'templates', 'isovia-account-update-workbook.xlsx');
const workbook = XLSX.utils.book_new();

const guideRows = [
  ['ISOVIA ACCOUNT UPDATE WORKSHEET'],
  ['Purpose', 'Prepare and review accounting change requests with ChatGPT. This is a blank working template.'],
  ['Important', 'This workbook does not import changes into Isovia. Use the approved app workflow and verify each change before applying it.'],
  ['Privacy', 'Do not enter passwords, bank details, payment-card data, or unnecessary personal information.'],
  ['How to use', 'Add one requested field change per row in Update Requests. Keep stable record IDs and current values unchanged.'],
  ['ChatGPT review', 'Upload this workbook and ask ChatGPT to flag missing IDs, ambiguous fields, duplicates, or inconsistent requests. Do not ask it to invent financial amounts.'],
  ['Finance approval', 'Use the approval columns to record review status. ChatGPT output is a draft, not financial approval.'],
];

const requestHeaders = [
  'Change Ref',
  'Account Area',
  'Record Type',
  'Record ID',
  'Related Order / Trip ID',
  'Field to Change',
  'Current Value',
  'Requested Value',
  'Effective Date',
  'Reason',
  'Finance Review',
  'ChatGPT Review Notes',
];

const requestRows = [requestHeaders, ...Array.from({ length: 30 }, () => Array(requestHeaders.length).fill(''))];
const accountRows = [
  ['Account Area', 'Isovia destination', 'Worksheet guidance'],
  ['Accounts receivable', '/accountspayablereceivablelist', 'Customer balances; include customer and order IDs when relevant.'],
  ['Accounts payable', '/accountspayablereceivablelist', 'Payables are shown with receivables in the current app view.'],
  ['Revenue & expenses', '/revenuerxpenseslist', 'Period summary and transaction detail.'],
  ['Location income', '/netincometable', 'Income grouped by delivery location.'],
  ['Driver payroll', '/driverpaylist', 'Use the existing driver-pay workflow; do not treat assigned-order counts as pay amounts.'],
  ['Agent payroll', '/agentpaylist', 'Use the existing agent-pay workflow.'],
  ['Trip income', '/gettripIncome', 'Use the existing trip-income workflow.'],
  ['Expenses', '/getexpense', 'Use the existing expense workflow.'],
];

const promptRows = [
  ['CHATGPT REVIEW PROMPT'],
  ['Copy this prompt after filling the worksheet:'],
  ['Review the Update Requests sheet. Preserve every record ID and current value. Flag missing identifiers, ambiguous field names, conflicting requests, duplicate changes, and values that need finance confirmation. Do not invent values, calculate new balances, modify formulas, or claim these changes were applied to Isovia. Return a concise review grouped by Change Ref.'],
  ['Before sharing', 'Remove rows and notes that are not needed for the requested review. Do not upload credentials or unnecessary personal/financial details.'],
];

const addSheet = (name, rows, widths, filterRange) => {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet['!cols'] = widths.map((wch) => ({ wch }));
  if (filterRange) worksheet['!autofilter'] = { ref: filterRange };
  XLSX.utils.book_append_sheet(workbook, worksheet, name);
};

addSheet('Start Here', guideRows, [24, 105]);
addSheet('Update Requests', requestRows, [16, 24, 20, 18, 24, 24, 24, 24, 18, 40, 20, 44], 'A1:L31');
addSheet('Account Areas', accountRows, [28, 40, 88], 'A1:C9');
addSheet('ChatGPT Prompt', promptRows, [28, 120]);

workbook.Props = {
  Title: 'Isovia Account Update Worksheet',
  Subject: 'Blank accounting change request and ChatGPT review template',
  Author: 'Isovia',
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
XLSX.writeFile(workbook, outputPath);
console.log(`Created blank accounting worksheet: ${outputPath}`);
