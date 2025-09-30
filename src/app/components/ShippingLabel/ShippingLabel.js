// components/ShippingLabel.js
import { useRef } from 'react';
import { toPng } from 'html-to-image';
import * as bwipjs from 'bwip-js';

const ShippingLabel = ({ order, onClose }) => {
    const labelRef = useRef();

    // Generate barcode
    const generateBarcode = async (orderId) => {
        try {
            const canvas = document.createElement('canvas');
            await bwipjs.toCanvas(canvas, {
                bcid: 'code128',
                text: orderId,
                scale: 2,
                height: 10,
                includetext: true,
                textxalign: 'center',
            });
            return canvas.toDataURL();
        } catch (error) {
            console.error('Barcode generation failed:', error);
            return null;
        }
    };

    const handlePrint = async () => {
        if (labelRef.current) {
            try {
                const barcodeDataUrl = await generateBarcode(order.orderId);

                // Create a new window for printing
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Shipping Label - ${order.orderId}</title>
                        <style>
                            @media print {
                                @page { margin: 0; size: auto; }
                                body { margin: 0.5cm; }
                            }
                            * { 
                                margin: 0; 
                                padding: 0; 
                                box-sizing: border-box; 
                                font-family: Arial, sans-serif;
                            }
                            .shipping-label {
                                width: 100mm;
                                height: 150mm;
                                padding: 8mm;
                                border: 2px solid #000;
                                position: relative;
                                background: white;
                                color: black;
                                font-size: 10px;
                                line-height: 1.2;
                            }
                            .header { 
                                text-align: center; 
                                margin-bottom: 6mm; 
                                border-bottom: 1px solid #000;
                                padding-bottom: 3mm;
                            }
                            .company-name { 
                                font-size: 14px; 
                                font-weight: bold; 
                                margin-bottom: 1mm;
                            }
                            .order-id { 
                                font-size: 12px; 
                                font-weight: bold;
                                margin-bottom: 2mm;
                            }
                            .barcode { 
                                text-align: center; 
                                margin: 3mm 0; 
                            }
                            .barcode img {
                                max-width: 100%;
                                height: 15mm;
                            }
                            .section { 
                                margin-bottom: 4mm; 
                            }
                            .section-title { 
                                font-weight: bold; 
                                margin-bottom: 1mm; 
                                border-bottom: 1px solid #ccc;
                                padding-bottom: 1mm;
                            }
                            .address-box {
                                border: 1px solid #000;
                                padding: 2mm;
                                margin-top: 1mm;
                                background: #f9f9f9;
                            }
                            .products { 
                                margin-top: 3mm; 
                            }
                            .product-item {
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 1mm;
                                padding-bottom: 1mm;
                                border-bottom: 1px dotted #ccc;
                            }
                            .footer {
                                position: absolute;
                                bottom: 8mm;
                                left: 8mm;
                                right: 8mm;
                                text-align: center;
                                font-size: 8px;
                                color: #666;
                                border-top: 1px solid #ccc;
                                padding-top: 2mm;
                            }
                            .two-column {
                                display: grid;
                                grid-template-columns: 1fr 1fr;
                                gap: 4mm;
                                margin-bottom: 4mm;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="shipping-label">
                            <div class="header">
                                <div class="company-name">SOOQRA ONE</div>
                                <div class="order-id">ORDER: ${order.orderId}</div>
                            </div>
                            
                            <div class="barcode">
                                <img src="${barcodeDataUrl}" alt="Barcode" />
                            </div>

                            <div class="two-column">
                                <div class="section">
                                    <div class="section-title">SENDER</div>
                                    <div class="address-box">
                                        <strong>SOOQRA ONE</strong><br/>
                                        Phone: 0123456789<br/>
                                        Email: info@sooqra.com<br/>
                                        Dhaka, Bangladesh
                                    </div>
                                </div>

                                <div class="section">
                                    <div class="section-title">RECIPIENT</div>
                                    <div class="address-box">
                                        <strong>${order.customerInfo.name}</strong><br/>
                                        📞 ${order.customerInfo.phone}<br/>
                                        📧 ${order.customerInfo.email}<br/>
                                        ${order.customerInfo.address}<br/>
                                        ${order.customerInfo.city || ''} ${order.customerInfo.postcode || ''}<br/>
                                        ${order.customerInfo.district || ''} ${order.customerInfo.thana || ''}<br/>
                                        ${order.customerInfo.country}
                                    </div>
                                </div>
                            </div>

                            <div class="section">
                                <div class="section-title">SHIPPING INFO</div>
                                <div><strong>Payment:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid'}</div>
                                <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</div>
                                <div><strong>Total:</strong> ৳${order.total.toLocaleString()}</div>
                            </div>

                            <div class="section products">
                                <div class="section-title">PRODUCTS (${order.products.length})</div>
                                ${order.products.map(product => `
                                    <div class="product-item">
                                        <span>${product.title}</span>
                                        <span>Qty: ${product.quantity}</span>
                                    </div>
                                `).join('')}
                            </div>

                            <div class="footer">
                                Thank you for shopping with SOOQRA ONE | www.sooqra.com
                            </div>
                        </div>
                    </body>
                    </html>
                `);

                printWindow.document.close();
                printWindow.focus();

                // Wait for images to load before printing
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 500);

            } catch (error) {
                console.error('Print failed:', error);
                alert('Printing failed. Please try again.');
            }
        }
    };

    const handleDownload = async () => {
        if (labelRef.current) {
            try {
                const barcodeDataUrl = await generateBarcode(order.orderId);
                const dataUrl = await toPng(labelRef.current, {
                    quality: 1.0,
                    backgroundColor: '#ffffff'
                });

                const link = document.createElement('a');
                link.download = `shipping-label-${order.orderId}.png`;
                link.href = dataUrl;
                link.click();
            } catch (error) {
                console.error('Download failed:', error);
                alert('Download failed. Please try again.');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Shipping Label - {order.orderId}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Preview */}
                <div className="border-2 border-gray-300 rounded-lg p-4 mb-6 bg-white">
                    <div
                        ref={labelRef}
                        className="shipping-label-preview mx-auto"
                        style={{
                            width: '100mm',
                            height: '150mm',
                            padding: '8mm',
                            border: '2px solid #000',
                            background: 'white',
                            color: 'black',
                            fontSize: '10px',
                            lineHeight: '1.2',
                            fontFamily: 'Arial, sans-serif'
                        }}
                    >
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '6mm', borderBottom: '1px solid #000', paddingBottom: '3mm' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '1mm' }}>
                                SOOQRA ONE
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '2mm' }}>
                                ORDER: {order.orderId}
                            </div>
                        </div>

                        {/* Barcode Placeholder */}
                        <div style={{ textAlign: 'center', margin: '3mm 0', height: '15mm', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Barcode: {order.orderId}
                        </div>

                        {/* Sender & Recipient */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4mm', marginBottom: '4mm' }}>
                            {/* Sender */}
                            <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '1mm', borderBottom: '1px solid #ccc', paddingBottom: '1mm' }}>
                                    SENDER
                                </div>
                                <div style={{ border: '1px solid #000', padding: '2mm', background: '#f9f9f9' }}>
                                    <strong>SOOQRA ONE</strong><br />
                                    Phone: 0123456789<br />
                                    Email: info@sooqra.com<br />
                                    Dhaka, Bangladesh
                                </div>
                            </div>

                            {/* Recipient */}
                            <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '1mm', borderBottom: '1px solid #ccc', paddingBottom: '1mm' }}>
                                    RECIPIENT
                                </div>
                                <div style={{ border: '1px solid #000', padding: '2mm', background: '#f9f9f9' }}>
                                    <strong>{order.customerInfo.name}</strong><br />
                                    📞 {order.customerInfo.phone}<br />
                                    📧 {order.customerInfo.email}<br />
                                    {order.customerInfo.address}<br />
                                    {order.customerInfo.city || ''} {order.customerInfo.postcode || ''}<br />
                                    {order.customerInfo.district || ''} {order.customerInfo.thana || ''}<br />
                                    {order.customerInfo.country}
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div style={{ marginBottom: '4mm' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '1mm', borderBottom: '1px solid #ccc', paddingBottom: '1mm' }}>
                                SHIPPING INFO
                            </div>
                            <div><strong>Payment:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid'}</div>
                            <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
                            <div><strong>Total:</strong> ৳{order.total.toLocaleString()}</div>
                        </div>

                        {/* Products */}
                        <div style={{ marginTop: '3mm' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '1mm', borderBottom: '1px solid #ccc', paddingBottom: '1mm' }}>
                                PRODUCTS ({order.products.length})
                            </div>
                            {order.products.map((product, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm', paddingBottom: '1mm', borderBottom: '1px dotted #ccc' }}>
                                    <span>{product.title}</span>
                                    <span>Qty: {product.quantity}</span>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div style={{ position: 'absolute', bottom: '8mm', left: '8mm', right: '8mm', textAlign: 'center', fontSize: '8px', color: '#666', borderTop: '1px solid #ccc', paddingTop: '2mm' }}>
                            Thank you for shopping with SOOQRA ONE | www.sooqra.com
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={handlePrint}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Label
                    </button>

                    <button
                        onClick={handleDownload}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PNG
                    </button>

                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShippingLabel;