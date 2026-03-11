import type { Expense, User, Income } from '../types';

type ExportFormat = 'csv' | 'json';

interface ExportOptions {
  filename: string;
  format: ExportFormat;
}

/**
 * Export Service
 * 
 * Handles data export functionality with support for CSV and JSON formats.
 * This service uses client-side exports for now but can be easily extended
 * to call backend APIs for server-side export generation.
 */

/**
 * Convert array of objects to CSV string
 */
function convertToCSV<T extends Record<string, any>>(data: T[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          
          const stringValue = String(value);
          
          // Always quote values that contain special characters or are dates
          const needsQuoting = 
            stringValue.includes(',') || 
            stringValue.includes('"') || 
            stringValue.includes('\n') ||
            stringValue.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/); // Date format MM/DD/YYYY
          
          if (needsQuoting) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(',')
    ),
  ];
  return csvRows.join('\n');
}

/**
 * Format date for CSV/Excel compatibility
 */
function formatDateForExport(dateString: string): string {
  try {
    const date = new Date(dateString);
    // Format as MM/DD/YYYY for better Excel compatibility
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Trigger browser download of data
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export expenses/transactions to file
 * 
 * @param expenses - Array of expense transactions
 * @param options - Export configuration
 * 
 * Backend Integration:
 * Replace with: `await api.post('/exports/transactions', { format, filters })`
 */
export function exportTransactions(
  expenses: Expense[],
  options: ExportOptions = { filename: 'transactions', format: 'csv' }
): void {
  const { filename, format } = options;
  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${timestamp}.${format}`;

  if (format === 'csv') {
    const dataForCSV = expenses.map((exp) => ({
      ID: exp.id,
      Date: formatDateForExport(exp.date),
      Store: exp.storeName,
      Amount: exp.amount,
      Category: exp.category,
      'Payment Method': exp.paymentMethod,
      Status: exp.status,
      Notes: exp.notes || '',
    }));
    const csvContent = convertToCSV(dataForCSV);
    downloadFile(csvContent, fullFilename, 'text/csv;charset=utf-8;');
  } else {
    const jsonContent = JSON.stringify(expenses, null, 2);
    downloadFile(jsonContent, fullFilename, 'application/json');
  }
}

/**
 * Export users to file
 * 
 * @param users - Array of users
 * @param options - Export configuration
 * 
 * Backend Integration:
 * Replace with: `await api.post('/exports/users', { format })`
 */
export function exportUsers(
  users: User[],
  options: ExportOptions = { filename: 'users', format: 'csv' }
): void {
  const { filename, format } = options;
  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${timestamp}.${format}`;

  if (format === 'csv') {
    const dataForCSV = users.map((user) => ({
      ID: user.id,
      Name: user.name,
      Email: user.email,
      Role: user.role,
      'Created At': formatDateForExport(user.createdAt),
    }));
    const csvContent = convertToCSV(dataForCSV);
    downloadFile(csvContent, fullFilename, 'text/csv;charset=utf-8;');
  } else {
    const jsonContent = JSON.stringify(users, null, 2);
    downloadFile(jsonContent, fullFilename, 'application/json');
  }
}

/**
 * Export income records to file
 * 
 * @param income - Array of income records
 * @param options - Export configuration
 * 
 * Backend Integration:
 * Replace with: `await api.post('/exports/income', { format, filters })`
 */
export function exportIncome(
  income: Income[],
  options: ExportOptions = { filename: 'income', format: 'csv' }
): void {
  const { filename, format } = options;
  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${timestamp}.${format}`;

  if (format === 'csv') {
    const dataForCSV = income.map((inc) => ({
      ID: inc.id,
      Date: formatDateForExport(inc.date),
      Source: inc.source,
      Amount: inc.amount,
      Category: inc.category,
      Notes: inc.notes || '',
    }));
    const csvContent = convertToCSV(dataForCSV);
    downloadFile(csvContent, fullFilename, 'text/csv;charset=utf-8;');
  } else {
    const jsonContent = JSON.stringify(income, null, 2);
    downloadFile(jsonContent, fullFilename, 'application/json');
  }
}

/**
 * Export generic report data
 * 
 * @param reportType - Type of report to generate
 * @param data - Data to export
 * 
 * Backend Integration:
 * Replace with: `await api.post('/exports/reports', { type: reportType })`
 * Backend will generate PDF/Excel reports with charts and formatting
 */
export async function exportReport(
  reportType: 'financial' | 'transaction-log' | 'category-breakdown' | 'monthly-summary' | 'revenue' | 'categories' | 'activity' | 'custom',
  data?: any
): Promise<void> {
  const timestamp = new Date().toISOString().split('T')[0];
  const safeReportType = reportType.replace(/[^a-z0-9-]/gi, '_');
  const filename = `${safeReportType}_report_${timestamp}.csv`;

  const summary = data?.summary as Record<string, unknown> | undefined;
  const expenses = Array.isArray(data?.expenses) ? (data.expenses as Expense[]) : [];
  const income = Array.isArray(data?.income) ? (data.income as Income[]) : [];

  const rows: Array<Record<string, string | number>> = [];

  if (summary) {
    Object.entries(summary).forEach(([metric, value]) => {
      const formattedValue =
        typeof value === 'string' && /\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}/.test(value)
          ? formatDateForExport(value)
          : typeof value === 'number'
            ? Number(value.toFixed(2))
            : String(value);

      rows.push({
        Section: 'Summary',
        Type: reportType,
        Date: '',
        Name: metric,
        Category: '',
        Amount: '',
        Status: '',
        Notes: formattedValue,
      });
    });
  }

  expenses.forEach((expense) => {
    rows.push({
      Section: 'Expense',
      Type: reportType,
      Date: formatDateForExport(expense.date),
      Name: expense.storeName,
      Category: expense.category,
      Amount: expense.amount,
      Status: expense.status,
      Notes: expense.notes ?? '',
    });
  });

  income.forEach((record) => {
    rows.push({
      Section: 'Income',
      Type: reportType,
      Date: formatDateForExport(record.date),
      Name: record.source,
      Category: record.category,
      Amount: record.amount,
      Status: record.status,
      Notes: record.notes ?? '',
    });
  });

  if (rows.length === 0) {
    rows.push({
      Section: 'Report',
      Type: reportType,
      Date: formatDateForExport(timestamp),
      Name: 'No structured rows provided',
      Category: '',
      Amount: '',
      Status: '',
      Notes: 'Report generated from available mock/local data.',
    });
  }

  const csvContent = convertToCSV(rows);
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}
