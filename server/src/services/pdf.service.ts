import PDFDocument from 'pdfkit';
import { Expense, TimeEntry, FoodEntry } from '@aarvieve/shared';

export class PdfService {
  generateExpenseReport(expenses: Expense[], title: string = 'Expense Report'): PDFKit.PDFDocument {
    const doc = new PDFDocument({ margin: 50 });
    doc.fontSize(24).text(title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown(2);

    const total = expenses.reduce((s, e) => s + e.amount, 0);
    doc.fontSize(14).text(`Total Expenses: $${total.toFixed(2)}`);
    doc.fontSize(12).text(`Total Entries: ${expenses.length}`);
    doc.moveDown();

    // Table header
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Date', 50, doc.y, { width: 80 });
    doc.text('Title', 130, doc.y - 12, { width: 150 });
    doc.text('Category', 280, doc.y - 12, { width: 100 });
    doc.text('Amount', 380, doc.y - 12, { width: 80, align: 'right' });
    doc.moveDown();
    doc.font('Helvetica');

    for (const expense of expenses.slice(0, 50)) {
      const y = doc.y;
      if (y > 700) { doc.addPage(); }
      doc.text(expense.date, 50, doc.y, { width: 80 });
      doc.text(expense.title, 130, doc.y - 12, { width: 150 });
      doc.text(expense.category, 280, doc.y - 12, { width: 100 });
      doc.text(`$${expense.amount.toFixed(2)}`, 380, doc.y - 12, { width: 80, align: 'right' });
      doc.moveDown(0.5);
    }

    return doc;
  }

  generateTimeReport(entries: TimeEntry[], title: string = 'Time Tracking Report'): PDFKit.PDFDocument {
    const doc = new PDFDocument({ margin: 50 });
    doc.fontSize(24).text(title, { align: 'center' });
    doc.moveDown();

    const totalHours = entries.reduce((s, e) => s + (e.duration || 0), 0) / 3600;
    doc.fontSize(14).text(`Total Hours: ${totalHours.toFixed(2)}`);
    doc.moveDown(2);

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Date', 50, doc.y, { width: 80 });
    doc.text('Title', 130, doc.y - 12, { width: 150 });
    doc.text('Project', 280, doc.y - 12, { width: 100 });
    doc.text('Duration', 380, doc.y - 12, { width: 80, align: 'right' });
    doc.moveDown();
    doc.font('Helvetica');

    for (const entry of entries.slice(0, 50)) {
      if (doc.y > 700) doc.addPage();
      const hours = ((entry.duration || 0) / 3600).toFixed(2);
      doc.text(entry.startTime.split('T')[0], 50, doc.y, { width: 80 });
      doc.text(entry.title, 130, doc.y - 12, { width: 150 });
      doc.text(entry.project, 280, doc.y - 12, { width: 100 });
      doc.text(`${hours}h`, 380, doc.y - 12, { width: 80, align: 'right' });
      doc.moveDown(0.5);
    }

    return doc;
  }

  generateFoodReport(entries: FoodEntry[], title: string = 'Food Tracking Report'): PDFKit.PDFDocument {
    const doc = new PDFDocument({ margin: 50 });
    doc.fontSize(24).text(title, { align: 'center' });
    doc.moveDown();

    const totalCal = entries.reduce((s, e) => s + e.calories, 0);
    doc.fontSize(14).text(`Total Calories: ${totalCal}`);
    doc.moveDown(2);

    for (const entry of entries.slice(0, 50)) {
      if (doc.y > 700) doc.addPage();
      doc.fontSize(10);
      doc.text(`${entry.date} | ${entry.mealType} | ${entry.name} | ${entry.calories} cal`, 50);
      doc.moveDown(0.3);
    }

    return doc;
  }
}

export const pdfService = new PdfService();
