/**
 * NESTLOOP — Client-Side Document PDF Generator
 * Uses jsPDF to construct real, downloadable, vector-rendered PDF documents
 * for Rental Agreements and Payment Receipts with clear DEMO/SAMPLE watermarks.
 */

window.NestloopPDF = (function () {
  function checkJsPDF() {
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
      console.warn("jsPDF is not loaded. Ensure assets/vendor/jspdf.umd.min.js is included.");
      return null;
    }
    return window.jspdf.jsPDF;
  }

  /**
   * Generates and downloads a real Rental Agreement PDF
   */
  function generateAgreement(rental, customer) {
    const jsPDF = checkJsPDF();
    if (!jsPDF) {
      alert("Document engine initializing. Please refresh or retry in a moment.");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background watermark: SAMPLE / DEMO DOCUMENT
    doc.saveGraphicsState && doc.saveGraphicsState();
    doc.setTextColor(230, 232, 235);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(54);
    // Draw rotated watermark across page
    doc.text("DEMO AGREEMENT", pageWidth / 2, pageHeight / 2 - 20, {
      align: "center",
      angle: 45
    });
    doc.setFontSize(28);
    doc.text("NON-BINDING PREVIEW", pageWidth / 2, pageHeight / 2 + 15, {
      align: "center",
      angle: 45
    });
    doc.restoreGraphicsState && doc.restoreGraphicsState();

    // Top Header Banner
    doc.setFillColor(16, 32, 53); // Midnight Navy dark
    doc.rect(0, 0, pageWidth, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("NESTLOOP", 18, 16);

    doc.setTextColor(69, 123, 157); // Slate accent
    doc.setFontSize(10);
    doc.text("FURNITURE THAT MOVES WITH YOU", 18, 22);

    doc.setTextColor(220, 229, 239);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text("SAMPLE RENTAL AGREEMENT", pageWidth - 18, 14, { align: "right" });
    doc.text("DEMO SPECIMEN ONLY", pageWidth - 18, 20, { align: "right" });

    // Document Meta Strip
    doc.setFillColor(240, 244, 248);
    doc.rect(14, 34, pageWidth - 28, 22, "F");
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, 34, pageWidth - 28, 22, "S");

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text("AGREEMENT NUMBER", 20, 41);
    doc.text("COMMENCEMENT DATE", 75, 41);
    doc.text("EXPIRATION DATE", 130, 41);
    doc.text("TENURE PERIOD", 175, 41);

    doc.setTextColor(26, 32, 44);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(rental.agreementNumber || "AGR-2026-DEMO", 20, 49);
    doc.text(rental.startDate || "2026-01-15", 75, 49);
    doc.text(rental.endDate || "2026-07-15", 130, 49);
    doc.text(`${rental.tenureMonths || 6} Months`, 175, 49);

    // Section 1: Parties Information
    let y = 66;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(26, 32, 44);
    doc.text("1. PARTIES TO THIS DEMONSTRATION AGREEMENT", 18, y);

    y += 6;
    doc.setDrawColor(29, 53, 87);
    doc.setLineWidth(0.5);
    doc.line(18, y, pageWidth - 18, y);

    y += 7;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Lessor (Service Provider):", 18, y);
    doc.text("Lessee (Customer / Resident):", 110, y);

    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 75, 82);
    doc.text("NESTLOOP Furnishing Solutions Pvt. Ltd. (Demo)", 18, y);
    doc.text(customer.name || "Alex Chen", 110, y);

    y += 4.5;
    doc.text("Reg: Madhapur Hitec City corridor, Telangana, India", 18, y);
    doc.text(`Email: ${customer.email || "alex.chen@nestloop.demo"}`, 110, y);

    y += 4.5;
    doc.text("Email: support@nestloop.demo | Web: nestloop.demo", 18, y);
    doc.text(`Phone: ${customer.phone || "+91 98765 43210"}`, 110, y);

    y += 4.5;
    doc.text("Status: Demonstration Instance / Static Hosting", 18, y);
    doc.text(`Delivery: ${customer.address || "HSR Layout, Bengaluru"}`, 110, y, { maxWidth: 82 });

    // Section 2: Rented Bundle Details
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(26, 32, 44);
    doc.text("2. RENTED FURNITURE SPECIFICATIONS & PRICING", 18, y);

    y += 6;
    doc.setDrawColor(29, 53, 87);
    doc.line(18, y, pageWidth - 18, y);

    // Table Header
    y += 7;
    doc.setFillColor(240, 244, 248); // Pale navy
    doc.rect(18, y, pageWidth - 36, 8, "F");
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 32, 44);
    doc.text("PACKAGE / BUNDLE", 22, y + 5.5);
    doc.text("CATEGORY", 85, y + 5.5);
    doc.text("REFUNDABLE DEPOSIT", 125, y + 5.5);
    doc.text("MONTHLY RENT", pageWidth - 22, y + 5.5, { align: "right" });

    // Table Row
    y += 8;
    doc.setFillColor(255, 255, 255);
    doc.rect(18, y, pageWidth - 36, 12, "F");
    doc.setDrawColor(226, 232, 240);
    doc.rect(18, y, pageWidth - 36, 12, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(rental.packageName || "Furniture Bundle", 22, y + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(rental.itemsSummary || "Standard package itemization", 22, y + 9.5, { maxWidth: 58 });

    doc.setTextColor(26, 32, 44);
    doc.setFontSize(8.5);
    doc.text(rental.category || "General", 85, y + 7);
    doc.text(`₹${(rental.depositPaid || 2500).toLocaleString('en-IN')}`, 125, y + 7);
    doc.setFont("helvetica", "bold");
    doc.text(`₹${(rental.monthlyRate || 1799).toLocaleString('en-IN')}/mo`, pageWidth - 22, y + 7, { align: "right" });

    // Section 3: Illustrative Terms and Covenants
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("3. KEY TERMS & DEMO CONDITIONS", 18, y);

    y += 6;
    doc.setDrawColor(29, 53, 87);
    doc.line(18, y, pageWidth - 18, y);

    const terms = [
      "A. DEMO STATUS: This agreement is an illustrative simulated sample created for browser evaluation purposes. It does not constitute a legal contract until executed via authenticated legal e-sign.",
      "B. MONTHLY DUE DATE: Rental payments fall due on the 15th calendar day of each ongoing billing month.",
      "C. DEPOSIT REFUND: The refundable security deposit is reconciled within 5 to 7 working days following end-of-tenure pickup and inspection.",
      "D. SWAP & EARLY RETURN: The lessee may initiate item swaps or early return requests via the customer portal. Final dispatch is subject to route verification.",
      "E. CARE & NORMAL WEAR: Normal environmental wear is covered under the NESTLOOP care promise. Willful structural mutilation is assessable.",
      "F. JURISDICTION: Governing dispute resolution is designated to the courts of the delivery metropolitan jurisdiction."
    ];

    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(60, 65, 72);
    for (const term of terms) {
      doc.text(term, 18, y, { maxWidth: pageWidth - 36 });
      y += 6.5;
    }

    // Signatures Area
    y += 6;
    doc.setDrawColor(200, 204, 210);
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.line(18, y + 16, 85, y + 16);
    doc.line(125, y + 16, pageWidth - 18, y + 16);
    doc.setLineDashPattern([], 0);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 32, 44);
    doc.text("Authorized Signatory (NESTLOOP)", 18, y + 21);
    doc.text("Resident / Customer Signature", 125, y + 21);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("[Electronically Verified — Demo Seed]", 18, y + 25);
    doc.text(`[Customer: ${customer.name || "Alex Chen"}]`, 125, y + 25);

    // Footer notice
    doc.setFillColor(240, 244, 248);
    doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    doc.text("NESTLOOP Static Demonstration Platform — Not a legal solicitation. All currency amounts shown in INR.", pageWidth / 2, pageHeight - 5, { align: "center" });

    // Trigger download
    const filename = `NESTLOOP-Agreement-${rental.rentalId || "SAMPLE"}.pdf`;
    doc.save(filename);
  }

  /**
   * Generates and downloads a real Payment Receipt PDF
   */
  function generateReceipt(invoice, customer) {
    const jsPDF = checkJsPDF();
    if (!jsPDF) {
      alert("Document engine initializing. Please refresh or retry in a moment.");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background watermark: SAMPLE RECEIPT
    doc.saveGraphicsState && doc.saveGraphicsState();
    doc.setTextColor(235, 237, 240);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(52);
    doc.text("DEMO RECEIPT", pageWidth / 2, pageHeight / 2 - 15, {
      align: "center",
      angle: 45
    });
    doc.setFontSize(26);
    doc.text("SIMULATED TRANSACTION", pageWidth / 2, pageHeight / 2 + 18, {
      align: "center",
      angle: 45
    });
    doc.restoreGraphicsState && doc.restoreGraphicsState();

    // Header Bar
    doc.setFillColor(16, 32, 53); // Midnight Navy dark
    doc.rect(0, 0, pageWidth, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("NESTLOOP", 18, 16);

    doc.setTextColor(69, 123, 157); // Slate accent
    doc.setFontSize(10);
    doc.text("FURNITURE THAT MOVES WITH YOU", 18, 22);

    doc.setTextColor(220, 229, 239);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text("PAYMENT RECEIPT", pageWidth - 18, 14, { align: "right" });
    doc.text("STATUS: PAID (DEMO)", pageWidth - 18, 20, { align: "right" });

    // Meta Grid
    doc.setFillColor(240, 244, 248);
    doc.rect(14, 34, pageWidth - 28, 24, "F");
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, 34, pageWidth - 28, 24, "S");

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text("INVOICE / RECEIPT #", 20, 41);
    doc.text("PAYMENT DATE", 75, 41);
    doc.text("BILLING CYCLE", 125, 41);
    doc.text("PAYMENT MODE", 175, 41);

    doc.setTextColor(26, 32, 44);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(invoice.invoiceId || "INV-2026-DEMO", 20, 50);
    doc.text(invoice.date || "2026-09-15", 75, 50);
    doc.setFontSize(8.5);
    doc.text(invoice.period || "Current Cycle", 125, 50);
    doc.text(invoice.method || "Auto-Debit", 175, 50);

    // Customer Billed To
    let y = 68;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(26, 32, 44);
    doc.text("BILLED TO:", 18, y);

    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`${customer.name || "Alex Chen"} (${customer.email || "alex.chen@nestloop.demo"})`, 18, y);
    y += 4.5;
    doc.text(customer.address || "HSR Layout, Bengaluru, Karnataka", 18, y);

    // Itemized Table
    y += 12;
    doc.setFillColor(240, 244, 248);
    doc.rect(18, y, pageWidth - 36, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(26, 32, 44);
    doc.text("LINE ITEM DESCRIPTION", 22, y + 5.5);
    doc.text("AMOUNT (INR)", pageWidth - 22, y + 5.5, { align: "right" });

    y += 8;
    const items = invoice.items || [
      { description: "Monthly Rental Itemization", amount: invoice.amount || 3298 }
    ];

    let subtotal = 0;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(50, 55, 62);

    for (const it of items) {
      doc.setFillColor(255, 255, 255);
      doc.rect(18, y, pageWidth - 36, 9, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(18, y, pageWidth - 36, 9, "S");

      doc.text(it.description, 22, y + 6);
      doc.text(`₹${Number(it.amount).toLocaleString('en-IN')}`, pageWidth - 22, y + 6, { align: "right" });
      subtotal += Number(it.amount);
      y += 9;
    }

    // Totals Box
    y += 4;
    doc.setDrawColor(29, 53, 87);
    doc.line(pageWidth - 85, y, pageWidth - 18, y);

    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text("Subtotal:", pageWidth - 55, y);
    doc.text(`₹${subtotal.toLocaleString('en-IN')}`, pageWidth - 22, y, { align: "right" });

    y += 5;
    doc.text("Applicable GST / Taxes (Included):", pageWidth - 70, y);
    doc.text("₹0 (Included)", pageWidth - 22, y, { align: "right" });

    y += 6;
    doc.setFillColor(240, 244, 248);
    doc.rect(pageWidth - 85, y, 67, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(29, 53, 87);
    doc.text("TOTAL PAID:", pageWidth - 80, y + 7);
    doc.text(`₹${(invoice.amount || subtotal).toLocaleString('en-IN')}`, pageWidth - 22, y + 7, { align: "right" });

    // Transaction Details Note
    y += 24;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(26, 32, 44);
    doc.text("DEMO PAYMENT RECORD DETAILS", 18, y);

    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Transaction ID: TXN_DEMO_" + Math.random().toString(36).substring(2, 10).toUpperCase(), 18, y);
    y += 4.5;
    doc.text("Authorization: SIMULATED_LOCAL_SESSION_OK", 18, y);
    y += 4.5;
    doc.text("Note: This receipt represents a static frontend simulation of recurring rental billing for demonstration purposes.", 18, y, { maxWidth: pageWidth - 36 });

    // Footer
    doc.setFillColor(240, 244, 248);
    doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    doc.text("NESTLOOP — Sustainable Furniture Rental Platform — All currency amounts shown in INR.", pageWidth / 2, pageHeight - 5, { align: "center" });

    const filename = `NESTLOOP-Receipt-${invoice.invoiceId || "SAMPLE"}.pdf`;
    doc.save(filename);
  }

  return {
    generateAgreement,
    generateReceipt
  };
})();
