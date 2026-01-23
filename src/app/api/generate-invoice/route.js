import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function POST(request) {
    try {
        const { order } = await request.json();

        if (!order || !order.orderId) {
            return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
        }

        // Initialize jsPDF
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        // Set default font
        doc.setFont("helvetica");
        doc.setTextColor(0, 0, 0); // Black text

        // Business Information (Top Section)
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("SOOQRA ONE SHOP", 105, 15, { align: "center" });
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("3 Muirfield Cresent, E14 9SZ, Bangladesh", 105, 22, { align: "center" });
        doc.text("+8801732183389 | sooqraone.shop@gmail.com", 105, 27, { align: "center" });

        // Invoice Header
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 105, 37, { align: "center" });

        // Invoice Details
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Date: ${new Date().toLocaleString()}`, 15, 43);
        doc.text(`Invoice #: ${order.orderId}`, 15, 48);

        // Customer Information
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("CUSTOMER DETAILS:", 15, 58);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(order.customerInfo.name, 15, 64);
        doc.text(order.customerInfo.phone, 15, 69);
        doc.text(order.customerInfo.email, 15, 74);
        doc.text(
            [
                order.customerInfo.address,
                order.customerInfo.city,
                order.customerInfo.district,
                order.customerInfo.thana,
                order.customerInfo.country,
            ].filter(Boolean).join(", "),
            15,
            79
        );

        // Items Table
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("ITEMS:", 15, 89);
        
        const tableData = order.products.map((product, index) => [
            `Item ${index + 1}`,
            product.title,
            product.quantity,
            `${product.price.toFixed(2)} BDT`,
            `${(product.quantity * product.price).toFixed(2)} BDT`
        ]);

        autoTable(doc, {
            startY: 94,
            head: [["Item", "Product Name", "Qty", "Price", "Total"]],
            body: tableData,
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: "bold",
                lineWidth: 0.2,
                lineColor: [0, 0, 0]
            },
            styles: {
                fontSize: 8,
                cellPadding: 2,
                lineWidth: 0.2,
                lineColor: [0, 0, 0]
            },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: "auto" },
                2: { cellWidth: 15 },
                3: { cellWidth: 25 },
                4: { cellWidth: 25 }
            },
            margin: { left: 15, right: 15 }
        });

        // Order Summary
        const finalY = doc.lastAutoTable.finalY + 10;
        
        // Summary Table (right-aligned)
        const summaryTableData = [
            ["Subtotal", `${order.products.reduce((sum, p) => sum + p.quantity * p.price, 0).toFixed(2)} BDT`],
            ["Discount", `${order.discount.toFixed(2)} BDT`],
            ["Shipping", `${order.shippingCharge.toFixed(2)} BDT`],
            ["Total", `${order.total.toFixed(2)} BDT`]
        ];

        autoTable(doc, {
            startY: finalY,
            head: [["Description", "Amount"]],
            body: summaryTableData,
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: [0, 0, 0],
                fontStyle: "bold",
                lineWidth: 0.2,
                lineColor: [0, 0, 0]
            },
            styles: {
                fontSize: 8,
                cellPadding: 2,
                lineWidth: 0.2,
                lineColor: [0, 0, 0]
            },
            columnStyles: {
                0: { cellWidth: 35, fontStyle: "bold" },
                1: { cellWidth: 25, halign: "right" }
            },
            margin: { left: 130, right: 15 },
            didParseCell: (data) => {
                if (data.row.index === 3) { // Bold the Total row
                    data.cell.styles.fontStyle = "bold";
                }
            }
        });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(128, 0, 128);
        doc.text("Thank you for your purchase!", 105, 280, { align: "center" });

        // Generate PDF as Uint8Array
        const pdfBytes = doc.output("arraybuffer");
        
        // Create response
        return new NextResponse(pdfBytes, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=invoice_${order.orderId}.pdf`,
            },
        });
    } catch (error) {
       
        return NextResponse.json(
            { error: `Failed to generate invoice: ${error.message}` },
            { status: 500 }
        );
    }
}