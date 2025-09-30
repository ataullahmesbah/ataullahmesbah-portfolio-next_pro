// components/ShippingLabel.js
import { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';

const ShippingLabel = ({ order, onClose }) => {
    const labelRef = useRef();
    const [barcodeDataUrl, setBarcodeDataUrl] = useState(null);

    // Generate barcode using Canvas
    useEffect(() => {
        const generateBarcode = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size
                canvas.width = 300;
                canvas.height = 80;
                
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Barcode settings
                const barWidth = 2;
                const barHeight = 50;
                const startX = 20;
                const startY = 10;
                
                // Convert order ID to binary representation (simple code39 simulation)
                const binaryData = order.orderId.split('').map(char => {
                    const code = char.charCodeAt(0).toString(2).padStart(8, '0');
                    return code;
                }).join('');
                
                // Draw barcode
                ctx.fillStyle = '#000000';
                let x = startX;
                
                for (let i = 0; i < binaryData.length; i++) {
                    if (binaryData[i] === '1') {
                        ctx.fillRect(x, startY, barWidth, barHeight);
                    }
                    x += barWidth;
                }
                
                // Draw order ID below barcode
                ctx.fillStyle = '#000000';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(order.orderId, canvas.width / 2, barHeight + 30);
                
                setBarcodeDataUrl(canvas.toDataURL());
            } catch (error) {
                console.error('Barcode generation failed:', error);
                // Fallback: create simple text barcode
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 300;
                canvas.height = 60;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#000000';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`📦 ${order.orderId}`, canvas.width / 2, 35);
                setBarcodeDataUrl(canvas.toDataURL());
            }
        };

        generateBarcode();
    }, [order.orderId]);

    const handlePrint = () => {
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Shipping Label - ${order.orderId}</title>
                <style>
                    @media print {
                        @page { 
                            margin: 0; 
                            size: 100mm 150mm;
                        }
                        body { 
                            margin: 0; 
                            padding: 0;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                    * { 
                        margin: 0; 
                        padding: 0; 
                        box-sizing: border-box; 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    }
                    .shipping-label {
                        width: 100mm;
                        height: 150mm;
                        padding: 5mm;
                        border: 1.5px solid #2c3e50;
                        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                        color: #2c3e50;
                        font-size: 9px;
                        line-height: 1.3;
                        position: relative;
                        overflow: hidden;
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 4mm; 
                        padding-bottom: 2mm;
                        border-bottom: 2px solid #3498db;
                        background: linear-gradient(135deg, #3498db, #2980b9);
                        margin: -5mm -5mm 4mm -5mm;
                        padding: 3mm;
                        color: white;
                    }
                    .company-name { 
                        font-size: 16px; 
                        font-weight: 800; 
                        margin-bottom: 1mm;
                        letter-spacing: 0.5px;
                    }
                    .company-tagline {
                        font-size: 8px;
                        opacity: 0.9;
                        font-weight: 300;
                    }
                    .order-id { 
                        font-size: 11px; 
                        font-weight: 600;
                        margin-top: 1mm;
                        background: rgba(255,255,255,0.2);
                        padding: 1mm 2mm;
                        border-radius: 3px;
                        display: inline-block;
                    }
                    .barcode-section { 
                        text-align: center; 
                        margin: 2mm 0 3mm 0;
                        padding: 2mm;
                        background: #f8f9fa;
                        border-radius: 4px;
                        border: 1px solid #e9ecef;
                    }
                    .barcode {
                        max-width: 100%;
                        height: 25mm;
                        margin-bottom: 1mm;
                    }
                    .barcode-number {
                        font-family: 'Courier New', monospace;
                        font-weight: bold;
                        font-size: 10px;
                        letter-spacing: 1px;
                        color: #2c3e50;
                    }
                    .two-column {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 3mm;
                        margin-bottom: 3mm;
                    }
                    .section { 
                        margin-bottom: 3mm; 
                    }
                    .section-title { 
                        font-weight: 700; 
                        margin-bottom: 1mm; 
                        padding-bottom: 0.5mm;
                        border-bottom: 1px solid #3498db;
                        color: #2c3e50;
                        font-size: 9px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .address-box {
                        border: 1px solid #bdc3c7;
                        padding: 2mm;
                        background: #ffffff;
                        border-radius: 3px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    .address-title {
                        font-weight: 600;
                        color: #3498db;
                        margin-bottom: 0.5mm;
                        font-size: 8px;
                    }
                    .contact-info {
                        font-size: 8px;
                        color: #7f8c8d;
                        margin-top: 0.5mm;
                    }
                    .products { 
                        margin-top: 2mm; 
                    }
                    .product-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 0.5mm;
                        padding: 1mm;
                        background: #f8f9fa;
                        border-radius: 2px;
                        border-left: 2px solid #3498db;
                    }
                    .product-name {
                        flex: 1;
                        font-weight: 500;
                    }
                    .product-details {
                        font-size: 8px;
                        color: #7f8c8d;
                        text-align: right;
                    }
                    .shipping-info {
                        background: #e8f4fc;
                        padding: 2mm;
                        border-radius: 3px;
                        border: 1px solid #3498db;
                        margin-top: 2mm;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 1mm;
                        font-size: 8px;
                    }
                    .info-item {
                        display: flex;
                        justify-content: space-between;
                    }
                    .info-label {
                        font-weight: 600;
                        color: #2c3e50;
                    }
                    .info-value {
                        font-weight: 500;
                        color: #e74c3c;
                    }
                    .footer {
                        position: absolute;
                        bottom: 5mm;
                        left: 5mm;
                        right: 5mm;
                        text-align: center;
                        font-size: 7px;
                        color: #7f8c8d;
                        border-top: 1px solid #bdc3c7;
                        padding-top: 1mm;
                        background: white;
                    }
                    .urgency-badge {
                        position: absolute;
                        top: 5mm;
                        right: 5mm;
                        background: #e74c3c;
                        color: white;
                        padding: 1mm 2mm;
                        border-radius: 3px;
                        font-size: 8px;
                        font-weight: bold;
                        transform: rotate(5deg);
                    }
                    .weight-indicator {
                        position: absolute;
                        bottom: 12mm;
                        right: 5mm;
                        background: #34495e;
                        color: white;
                        padding: 1mm 2mm;
                        border-radius: 3px;
                        font-size: 8px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="shipping-label">
                    <div class="urgency-badge">SHIPPING</div>
                    
                    <div class="header">
                        <div class="company-name">SOOQRA ONE</div>
                        <div class="company-tagline">Premium E-commerce Delivery</div>
                        <div class="order-id">ORDER #${order.orderId}</div>
                    </div>
                    
                    <div class="barcode-section">
                        <img class="barcode" src="${barcodeDataUrl}" alt="Barcode" />
                        <div class="barcode-number">${order.orderId}</div>
                    </div>

                    <div class="two-column">
                        <div class="section">
                            <div class="section-title">Sender Information</div>
                            <div class="address-box">
                                <div class="address-title">SOOQRA ONE</div>
                                <div>Dhaka, Bangladesh</div>
                                <div class="contact-info">
                                    📞 0123456789 | ✉️ info@sooqra.com<br>
                                    🌐 www.sooqra.com
                                </div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">Recipient Information</div>
                            <div class="address-box">
                                <div class="address-title">${order.customerInfo.name}</div>
                                <div>${order.customerInfo.address}</div>
                                <div>${order.customerInfo.city || ''} ${order.customerInfo.postcode || ''}</div>
                                <div>${order.customerInfo.district || ''} ${order.customerInfo.thana || ''}</div>
                                <div class="contact-info">
                                    📞 ${order.customerInfo.phone}<br>
                                    ✉️ ${order.customerInfo.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="shipping-info">
                        <div class="section-title">Shipping Details</div>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Order Date:</span>
                                <span class="info-value">${new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Payment:</span>
                                <span class="info-value">${order.paymentMethod === 'cod' ? 'COD' : 'Prepaid'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Amount:</span>
                                <span class="info-value">৳${order.total.toLocaleString()}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Items:</span>
                                <span class="info-value">${order.products.length}</span>
                            </div>
                        </div>
                    </div>

                    <div class="section products">
                        <div class="section-title">Package Contents</div>
                        ${order.products.map(product => `
                            <div class="product-item">
                                <span class="product-name">${product.title}</span>
                                <div class="product-details">
                                    Qty: ${product.quantity} | Size: ${product.size || 'N/A'}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="weight-indicator">
                        Weight: ${order.products.length > 2 ? 'MEDIUM' : 'LIGHT'}
                    </div>

                    <div class="footer">
                        <strong>SOOQRA ONE</strong> - Thank you for your business! | Track your order at www.sooqra.com/track
                    </div>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        printWindow.onload = () => {
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        };
    };

    const handleDownload = async () => {
        if (labelRef.current) {
            try {
                const dataUrl = await toPng(labelRef.current, {
                    quality: 1.0,
                    backgroundColor: '#ffffff',
                    pixelRatio: 3 // High resolution for print
                });

                const link = document.createElement('a');
                link.download = `sooqra-shipping-${order.orderId}.png`;
                link.href = dataUrl;
                link.click();
                
                toast.success('Label downloaded successfully!');
            } catch (error) {
                console.error('Download failed:', error);
                toast.error('Download failed. Please try again.');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Shipping Label
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">
                            Order # {order.orderId} • {order.customerInfo.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Preview */}
                <div className="border-2 border-gray-200 rounded-xl p-6 mb-6 bg-white shadow-inner">
                    <div
                        ref={labelRef}
                        className="shipping-label-preview mx-auto bg-gradient-to-br from-white to-gray-50 shadow-lg"
                        style={{
                            width: '100mm',
                            height: '150mm',
                            padding: '5mm',
                            border: '1.5px solid #2c3e50',
                            color: '#2c3e50',
                            fontSize: '9px',
                            lineHeight: '1.3',
                            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Urgency Badge */}
                        <div style={{
                            position: 'absolute',
                            top: '5mm',
                            right: '5mm',
                            background: '#e74c3c',
                            color: 'white',
                            padding: '1mm 2mm',
                            borderRadius: '3px',
                            fontSize: '8px',
                            fontWeight: 'bold',
                            transform: 'rotate(5deg)'
                        }}>
                            SHIPPING
                        </div>

                        {/* Header */}
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '4mm',
                            paddingBottom: '2mm',
                            borderBottom: '2px solid #3498db',
                            background: 'linear-gradient(135deg, #3498db, #2980b9)',
                            margin: '-5mm -5mm 4mm -5mm',
                            padding: '3mm',
                            color: 'white'
                        }}>
                            <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '1mm', letterSpacing: '0.5px' }}>
                                SOOQRA ONE
                            </div>
                            <div style={{ fontSize: '8px', opacity: '0.9', fontWeight: '300' }}>
                                Premium E-commerce Delivery
                            </div>
                            <div style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                marginTop: '1mm',
                                background: 'rgba(255,255,255,0.2)',
                                padding: '1mm 2mm',
                                borderRadius: '3px',
                                display: 'inline-block'
                            }}>
                                ORDER #{order.orderId}
                            </div>
                        </div>

                        {/* Barcode Section */}
                        <div style={{
                            textAlign: 'center',
                            margin: '2mm 0 3mm 0',
                            padding: '2mm',
                            background: '#f8f9fa',
                            borderRadius: '4px',
                            border: '1px solid #e9ecef'
                        }}>
                            {barcodeDataUrl && (
                                <img 
                                    src={barcodeDataUrl} 
                                    alt="Barcode" 
                                    style={{
                                        maxWidth: '100%',
                                        height: '25mm',
                                        marginBottom: '1mm'
                                    }}
                                />
                            )}
                            <div style={{
                                fontFamily: "'Courier New', monospace",
                                fontWeight: 'bold',
                                fontSize: '10px',
                                letterSpacing: '1px',
                                color: '#2c3e50'
                            }}>
                                {order.orderId}
                            </div>
                        </div>

                        {/* Sender & Recipient */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3mm', marginBottom: '3mm' }}>
                            {/* Sender */}
                            <div>
                                <div style={{ fontWeight: '700', marginBottom: '1mm', paddingBottom: '0.5mm', borderBottom: '1px solid #3498db', color: '#2c3e50', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Sender Information
                                </div>
                                <div style={{ border: '1px solid #bdc3c7', padding: '2mm', background: '#ffffff', borderRadius: '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                    <div style={{ fontWeight: '600', color: '#3498db', marginBottom: '0.5mm', fontSize: '8px' }}>
                                        SOOQRA ONE
                                    </div>
                                    <div>Dhaka, Bangladesh</div>
                                    <div style={{ fontSize: '8px', color: '#7f8c8d', marginTop: '0.5mm' }}>
                                        📞 0123456789 | ✉️ info@sooqra.com<br/>
                                        🌐 www.sooqra.com
                                    </div>
                                </div>
                            </div>

                            {/* Recipient */}
                            <div>
                                <div style={{ fontWeight: '700', marginBottom: '1mm', paddingBottom: '0.5mm', borderBottom: '1px solid #3498db', color: '#2c3e50', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Recipient Information
                                </div>
                                <div style={{ border: '1px solid #bdc3c7', padding: '2mm', background: '#ffffff', borderRadius: '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                    <div style={{ fontWeight: '600', color: '#3498db', marginBottom: '0.5mm', fontSize: '8px' }}>
                                        {order.customerInfo.name}
                                    </div>
                                    <div>{order.customerInfo.address}</div>
                                    <div>{order.customerInfo.city || ''} {order.customerInfo.postcode || ''}</div>
                                    <div>{order.customerInfo.district || ''} {order.customerInfo.thana || ''}</div>
                                    <div style={{ fontSize: '8px', color: '#7f8c8d', marginTop: '0.5mm' }}>
                                        📞 {order.customerInfo.phone}<br/>
                                        ✉️ {order.customerInfo.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div style={{ background: '#e8f4fc', padding: '2mm', borderRadius: '3px', border: '1px solid #3498db', marginTop: '2mm' }}>
                            <div style={{ fontWeight: '700', marginBottom: '1mm', paddingBottom: '0.5mm', borderBottom: '1px solid #3498db', color: '#2c3e50', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Shipping Details
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1mm', fontSize: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: '600', color: '#2c3e50' }}>Order Date:</span>
                                    <span style={{ fontWeight: '500', color: '#e74c3c' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: '600', color: '#2c3e50' }}>Payment:</span>
                                    <span style={{ fontWeight: '500', color: '#e74c3c' }}>{order.paymentMethod === 'cod' ? 'COD' : 'Prepaid'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: '600', color: '#2c3e50' }}>Amount:</span>
                                    <span style={{ fontWeight: '500', color: '#e74c3c' }}>৳{order.total.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: '600', color: '#2c3e50' }}>Items:</span>
                                    <span style={{ fontWeight: '500', color: '#e74c3c' }}>{order.products.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        <div style={{ marginTop: '3mm' }}>
                            <div style={{ fontWeight: '700', marginBottom: '1mm', paddingBottom: '0.5mm', borderBottom: '1px solid #3498db', color: '#2c3e50', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Package Contents
                            </div>
                            {order.products.map((product, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5mm', padding: '1mm', background: '#f8f9fa', borderRadius: '2px', borderLeft: '2px solid #3498db' }}>
                                    <span style={{ flex: 1, fontWeight: '500' }}>{product.title}</span>
                                    <div style={{ fontSize: '8px', color: '#7f8c8d', textAlign: 'right' }}>
                                        Qty: {product.quantity} | Size: {product.size || 'N/A'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Weight Indicator */}
                        <div style={{
                            position: 'absolute',
                            bottom: '12mm',
                            right: '5mm',
                            background: '#34495e',
                            color: 'white',
                            padding: '1mm 2mm',
                            borderRadius: '3px',
                            fontSize: '8px',
                            fontWeight: 'bold'
                        }}>
                            Weight: {order.products.length > 2 ? 'MEDIUM' : 'LIGHT'}
                        </div>

                        {/* Footer */}
                        <div style={{
                            position: 'absolute',
                            bottom: '5mm',
                            left: '5mm',
                            right: '5mm',
                            textAlign: 'center',
                            fontSize: '7px',
                            color: '#7f8c8d',
                            borderTop: '1px solid #bdc3c7',
                            paddingTop: '1mm',
                            background: 'white'
                        }}>
                            <strong>SOOQRA ONE</strong> - Thank you for your business! | Track your order at www.sooqra.com/track
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={handlePrint}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Shipping Label
                    </button>

                    <button
                        onClick={handleDownload}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PNG
                    </button>

                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShippingLabel;