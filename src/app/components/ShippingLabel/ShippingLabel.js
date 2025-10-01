import { useRef, useState, useEffect } from 'react';

const ShippingLabel = ({ order, onClose }) => {
    const labelRef = useRef();
    const [barcodeDataUrl, setBarcodeDataUrl] = useState(null);

    // Generate proper Code 128 barcode with improved quiet zones and sizing for better scannability
    useEffect(() => {
        const generateBarcode = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Increased canvas size for better resolution and quiet zones
                canvas.width = 400;
                canvas.height = 60;

                // White background
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Barcode settings - adjusted for scannability
                const data = order.orderId;
                const barWidth = 1.5; // Thinner bars for denser barcode if needed
                const barHeight = 50;
                const quietZone = 30; // Increased quiet zone (min 10 modules, ~15px per side)
                const startX = quietZone;
                const startY = 5;

                // Code 128 encoding table (unchanged)
                const code128Encoding = {
                    "0": "11011001100", "1": "11001101100", "2": "11001100110",
                    "3": "10010011000", "4": "10010001100", "5": "10001001100",
                    "6": "10011001000", "7": "10011000100", "8": "10001100100",
                    "9": "11001001000", "10": "11001000100", "11": "11000100100",
                    "12": "10110011100", "13": "10011011100", "14": "10011001110",
                    "15": "10111001100", "16": "10011101100", "17": "10011100110",
                    "18": "11001110010", "19": "11001011100", "20": "11001001110",
                    "21": "11011100100", "22": "11001110100", "23": "11101101110",
                    "24": "11101001100", "25": "11100101100", "26": "11100100110",
                    "27": "11101100100", "28": "11100110100", "29": "11100110010",
                    "30": "11011011000", "31": "11011000110", "32": "11000110110",
                    "33": "10100011000", "34": "10001011000", "35": "10001000110",
                    "36": "10110001000", "37": "10001101000", "38": "10001100010",
                    "39": "11010001000", "40": "11000101000", "41": "11000100010",
                    "42": "10110111000", "43": "10110001110", "44": "10001101110",
                    "45": "10111011000", "46": "10111000110", "47": "10001110110",
                    "48": "11101110110", "49": "11010001110", "50": "11000101110",
                    "51": "11011101000", "52": "11011100010", "53": "11011101110",
                    "54": "11101011000", "55": "11101000110", "56": "11100010110",
                    "57": "11101101000", "58": "11101100010", "59": "11100011010",
                    "60": "11101111010", "61": "11001000010", "62": "11110001010",
                    "63": "10100110000", "64": "10100001100", "65": "10010110000",
                    "66": "10010000110", "67": "10000101100", "68": "10000100110",
                    "69": "10110010000", "70": "10110000100", "71": "10011010000",
                    "72": "10011000010", "73": "10000110100", "74": "10000110010",
                    "75": "11000010010", "76": "11001010000", "77": "11110111010",
                    "78": "11000010100", "79": "10001111010", "80": "10100111100",
                    "81": "10010111100", "82": "10010011110", "83": "10111100100",
                    "84": "10011110100", "85": "10011110010", "86": "11110100100",
                    "87": "11110010100", "88": "11110010010", "89": "11011011110",
                    "90": "11011110110", "91": "11110110110", "92": "10101111000",
                    "93": "10100011110", "94": "10001011110", "95": "10111101000",
                    "96": "10111100010", "97": "11110101000", "98": "11110100010",
                    "99": "10111011110", "100": "10111101110", "101": "11101011110",
                    "102": "11110101110", "103": "11010000100", "104": "11010010000",
                    "105": "11010011100", "106": "11000111010"
                };

                // Start code for Code 128B
                let binaryString = "11010010000";

                // Calculate checksum
                let checksum = 104; // Start code B value

                // Encode each character
                for (let i = 0; i < data.length; i++) {
                    const char = data[i];
                    let code = char.charCodeAt(0) - 32;

                    // Improved fallback: if outside range, use Code 128C for digits or shift
                    if (code < 0 || code > 94) {
                        code = 0; // Fallback to space, but log for debug
                        console.warn(`Invalid char in orderId: ${char}, falling back to space`);
                    }
                    checksum += code * (i + 1);
                    binaryString += code128Encoding[code];
                }

                // Add checksum (modulo 103)
                checksum = checksum % 103;
                binaryString += code128Encoding[checksum];

                // Stop code
                binaryString += "1100011101011";

                // Draw barcode
                ctx.fillStyle = '#000000';
                let x = startX;

                for (let i = 0; i < binaryString.length; i++) {
                    if (binaryString[i] === '1') {
                        ctx.fillRect(x, startY, barWidth, barHeight);
                    }
                    x += barWidth;
                }

                // Ensure end quiet zone
                if (x + quietZone > canvas.width) {
                    canvas.width = x + quietZone * 2; // Dynamically adjust canvas if barcode is long
                }

                setBarcodeDataUrl(canvas.toDataURL());
            } catch (error) {
                console.error('Barcode generation failed:', error);
                generateSimpleBarcode();
            }
        };

        const generateSimpleBarcode = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 400;
            canvas.height = 60;

            // White background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Simple barcode with improved settings
            ctx.fillStyle = '#000000';
            const barWidth = 1.5;
            const barHeight = 50;
            const quietZone = 30;
            const startX = quietZone;
            const startY = 5;

            let x = startX;

            const orderId = order.orderId;
            let binaryPattern = '';

            for (let i = 0; i < orderId.length; i++) {
                const charCode = orderId.charCodeAt(i);
                binaryPattern += charCode.toString(2).padStart(8, '0');
            }

            for (let i = 0; i < binaryPattern.length; i++) {
                if (binaryPattern[i] === '1') {
                    ctx.fillRect(x, startY, barWidth, barHeight);
                }
                x += barWidth;

                if (i % 8 === 0) { // Better gaps for readability
                    x += 2;
                }
            }

            // Ensure end quiet zone
            if (x + quietZone > canvas.width) {
                canvas.width = x + quietZone * 2;
            }

            setBarcodeDataUrl(canvas.toDataURL());
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
                            width: 100mm;
                            height: 150mm;
                        }
                        * {
                            box-sizing: border-box;
                        }
                    }
                    
                    .shipping-label {
                        width: 100mm;
                        height: 150mm;
                        padding: 4mm;
                        border: 2px solid #1a365d;
                        background: white;
                        color: #1a365d;
                        font-size: 9px;
                        line-height: 1.2;
                        position: relative;
                        font-family: 'Segoe UI', Arial, sans-serif;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .header { 
                        text-align: center; 
                        margin-bottom: 2mm;
                        padding-bottom: 2mm;
                        border-bottom: 3px solid #2b6cb0;
                        background: linear-gradient(135deg, #2b6cb0, #2c5282);
                        margin: -4mm -4mm 2mm -4mm;
                        padding: 3mm;
                        color: white;
                    }
                    
                    .company-name { 
                        font-size: 16px; 
                        font-weight: 800; 
                        margin-bottom: 1mm;
                        letter-spacing: 0.5px;
                    }
                    
                    .order-id { 
                        font-size: 10px; 
                        font-weight: 600;
                        margin-top: 1mm;
                        background: rgba(255,255,255,0.15);
                        padding: 1mm 2mm;
                        border-radius: 3px;
                        display: inline-block;
                    }
                    
                    .barcode-container { 
                        text-align: center; 
                        margin: 1mm 0 2mm 0;
                        padding: 1mm;
                        background: #f7fafc;
                        border-radius: 4px;
                        border: 1px solid #e2e8f0;
                        flex-shrink: 0;
                    }
                    
                    .barcode {
                        max-width: 100%;
                        height: 20mm;
                        display: block;
                        margin: 0 auto;
                    }
                    
                    .content-section {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 2mm;
                        margin-bottom: 2mm;
                        flex: 1;
                    }
                    
                    .info-box {
                        border: 1px solid #cbd5e0;
                        padding: 2mm;
                        background: white;
                        border-radius: 3px;
                        height: fit-content;
                    }
                    
                    .section-title { 
                        font-weight: 700; 
                        margin-bottom: 1mm; 
                        padding-bottom: 0.5mm;
                        border-bottom: 1px solid #2b6cb0;
                        color: #2d3748;
                        font-size: 8px;
                        text-transform: uppercase;
                        letter-spacing: 0.3px;
                    }
                    
                    .address-line {
                        margin-bottom: 0.3mm;
                    }
                    
                    .contact-info {
                        font-size: 7px;
                        color: #4a5568;
                        margin-top: 1mm;
                        padding-top: 1mm;
                        border-top: 1px dashed #e2e8f0;
                    }
                    
                    .shipping-details {
                        background: #ebf8ff;
                        padding: 2mm;
                        border-radius: 3px;
                        border: 1px solid #90cdf4;
                        margin-bottom: 2mm;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 1mm;
                        font-size: 8px;
                    }
                    
                    .detail-item {
                        display: flex;
                        justify-content: space-between;
                    }
                    
                    .detail-label {
                        font-weight: 600;
                        color: #2d3748;
                    }
                    
                    .detail-value {
                        font-weight: 500;
                        color: #e53e3e;
                    }
                    
                    .products-section {
                        flex: 1;
                        overflow: hidden;
                    }
                    
                    .products-scroll {
                        max-height: 25mm;
                        overflow-y: auto;
                        border: 1px solid #e2e8f0;
                        border-radius: 3px;
                        padding: 1mm;
                        background: #f7fafc;
                    }
                    
                    .product-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0.5mm 1mm;
                        border-bottom: 1px dashed #e2e8f0;
                        font-size: 8px;
                    }
                    
                    .product-row:last-child {
                        border-bottom: none;
                    }
                    
                    .product-name {
                        flex: 1;
                        font-weight: 500;
                        color: #2d3748;
                    }
                    
                    .product-meta {
                        font-size: 7px;
                        color: #718096;
                        text-align: right;
                        white-space: nowrap;
                        margin-left: 1mm;
                    }
                    
                    .footer {
                        text-align: center;
                        font-size: 6px;
                        color: #718096;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 1mm;
                        margin-top: 1mm;
                        flex-shrink: 0;
                    }
                    
                    .urgency-stamp {
                        position: absolute;
                        top: 4mm;
                        right: 4mm;
                        background: #e53e3e;
                        color: white;
                        padding: 1mm 2mm;
                        border-radius: 2px;
                        font-size: 7px;
                        font-weight: 800;
                        transform: rotate(5deg);
                        border: 1px solid white;
                    }
                </style>
            </head>
            <body>
                <div class="shipping-label">
                    <div class="urgency-stamp">SHIPPING</div>
                    
                    <div class="header">
                        <div class="company-name">SOOQRA ONE</div>
                        <div class="order-id">ORDER #${order.orderId}</div>
                    </div>
                    
                    <div class="barcode-container">
                        <img class="barcode" src="${barcodeDataUrl}" alt="Barcode" />
                    </div>

                    <div class="content-section">
                        <div class="info-box">
                            <div class="section-title">Sender</div>
                            <div class="address-line"><strong>SOOQRA ONE</strong></div>
                            <div class="address-line">Dhaka, Bangladesh</div>
                            <div class="contact-info">
                                Phone: 0123456789<br>
                                Email: info@sooqra.com
                            </div>
                        </div>

                        <div class="info-box">
                            <div class="section-title">Recipient</div>
                            <div class="address-line"><strong>${order.customerInfo.name}</strong></div>
                            <div class="address-line">${order.customerInfo.address}</div>
                            <div class="address-line">
                                ${[order.customerInfo.city, order.customerInfo.postcode].filter(Boolean).join(' ')}
                            </div>
                            <div class="address-line">
                                ${[order.customerInfo.district, order.customerInfo.thana].filter(Boolean).join(', ')}
                            </div>
                            <div class="contact-info">
                                Phone: ${order.customerInfo.phone}<br>
                                Email: ${order.customerInfo.email}
                            </div>
                        </div>
                    </div>

                    <div class="shipping-details">
                        <div class="detail-item">
                            <span class="detail-label">Date:</span>
                            <span class="detail-value">${new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Payment:</span>
                            <span class="detail-value">${order.paymentMethod === 'cod' ? 'COD' : 'Prepaid'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Amount:</span>
                            <span class="detail-value">৳${order.total.toLocaleString()}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Items:</span>
                            <span class="detail-value">${order.products.reduce((sum, p) => sum + p.quantity, 0)}</span>
                        </div>
                    </div>

                    <div class="products-section">
                        <div class="section-title">Products</div>
                        <div class="products-scroll">
                            ${order.products.map(product => `
                                <div class="product-row">
                                    <span class="product-name">${product.title}</span>
                                    <div class="product-meta">
                                        Qty: ${product.quantity} | ${product.size || 'N/A'}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="footer">
                        <strong>SOOQRA ONE</strong> - www.sooqra.com
                    </div>
                </div>
                
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            setTimeout(function() {
                                window.close();
                            }, 500);
                        }, 250);
                    };
                </script>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank', 'width=400,height=600');
        printWindow.document.write(printContent);
        printWindow.document.close();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-xl p-4 w-full max-w-2xl max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Shipping Label
                        </h2>
                        <p className="text-gray-600 text-xs mt-1">
                            Order: {order.orderId} • Customer: {order.customerInfo.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Preview Container */}
                <div className="border-2 border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-inner flex justify-center">
                    <div
                        ref={labelRef}
                        className="shipping-label-preview bg-white shadow-lg"
                        style={{
                            width: '100mm',
                            minHeight: '150mm',
                            padding: '4mm',
                            border: '2px solid #1a365d',
                            color: '#1a365d',
                            fontSize: '9px',
                            lineHeight: '1.2',
                            fontFamily: "'Segoe UI', Arial, sans-serif",
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Urgency Stamp */}
                        <div style={{
                            position: 'absolute',
                            top: '4mm',
                            right: '4mm',
                            background: '#e53e3e',
                            color: 'white',
                            padding: '1mm 2mm',
                            borderRadius: '2px',
                            fontSize: '7px',
                            fontWeight: '800',
                            transform: 'rotate(5deg)',
                            border: '1px solid white'
                        }}>
                            SHIPPING
                        </div>

                        {/* Header */}
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '2mm',
                            paddingBottom: '2mm',
                            borderBottom: '3px solid #2b6cb0',
                            background: 'linear-gradient(135deg, #2b6cb0, #2c5282)',
                            margin: '-4mm -4mm 2mm -4mm',
                            padding: '3mm',
                            color: 'white'
                        }}>
                            <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '1mm', letterSpacing: '0.5px' }}>
                                SOOQRA ONE
                            </div>
                            <div style={{
                                fontSize: '10px',
                                fontWeight: '600',
                                marginTop: '1mm',
                                background: 'rgba(255,255,255,0.15)',
                                padding: '1mm 2mm',
                                borderRadius: '3px',
                                display: 'inline-block'
                            }}>
                                ORDER #${order.orderId}
                            </div>
                        </div>

                        {/* Barcode */}
                        <div style={{
                            textAlign: 'center',
                            margin: '1mm 0 2mm 0',
                            padding: '1mm',
                            background: '#f7fafc',
                            borderRadius: '4px',
                            border: '1px solid #e2e8f0',
                            flexShrink: 0
                        }}>
                            {barcodeDataUrl && (
                                <img
                                    src={barcodeDataUrl}
                                    alt="Barcode"
                                    style={{
                                        maxWidth: '100%',
                                        height: '20mm',
                                        display: 'block',
                                        margin: '0 auto'
                                    }}
                                />
                            )}
                        </div>

                        {/* Sender & Recipient */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2mm', marginBottom: '2mm', flex: 1 }}>
                            {/* Sender */}
                            <div style={{ border: '1px solid #cbd5e0', padding: '2mm', background: 'white', borderRadius: '3px', height: 'fit-content' }}>
                                <div style={{ fontWeight: '700', marginBottom: '1mm', paddingBottom: '0.5mm', borderBottom: '1px solid #2b6cb0', color: '#2d3748', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                                    Sender
                                </div>
                                <div style={{ marginBottom: '0.3mm' }}><strong>SOOQRA ONE</strong></div>
                                <div style={{ marginBottom: '0.3mm' }}>Dhaka, Bangladesh</div>
                                <div style={{ fontSize: '7px', color: '#4a5568', marginTop: '1mm', paddingTop: '1mm', borderTop: '1px dashed #e2e8f0' }}>
                                    Phone: 0123456789<br />
                                    Email: info@sooqra.com
                                </div>
                            </div>

                            {/* Recipient */}
                            <div style={{ border: '1px solid #cbd5e0', padding: '2mm', background: 'white', borderRadius: '3px', height: 'fit-content' }}>
                                <div style={{ fontWeight: '700', marginBottom: '1mm', paddingBottom: '0.5mm', borderBottom: '1px solid #2b6cb0', color: '#2d3748', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                                    Recipient
                                </div>
                                <div style={{ marginBottom: '0.3mm' }}><strong>{order.customerInfo.name}</strong></div>
                                <div style={{ marginBottom: '0.3mm' }}>{order.customerInfo.address}</div>
                                <div style={{ marginBottom: '0.3mm' }}>
                                    {[order.customerInfo.city, order.customerInfo.postcode].filter(Boolean).join(' ')}
                                </div>
                                <div style={{ marginBottom: '0.3mm' }}>
                                    {[order.customerInfo.district, order.customerInfo.thana].filter(Boolean).join(', ')}
                                </div>
                                <div style={{ fontSize: '7px', color: '#4a5568', marginTop: '1mm', paddingTop: '1mm', borderTop: '1px dashed #e2e8f0' }}>
                                    Phone: {order.customerInfo.phone}<br />
                                    Email: {order.customerInfo.email}
                                </div>
                            </div>
                        </div>

                        {/* Shipping Details */}
                        <div style={{ background: '#ebf8ff', padding: '2mm', borderRadius: '3px', border: '1px solid #90cdf4', marginBottom: '2mm', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1mm', fontSize: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: '600', color: '#2d3748' }}>Date:</span>
                                <span style={{ fontWeight: '500', color: '#e53e3e' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: '600', color: '#2d3748' }}>Payment:</span>
                                <span style={{ fontWeight: '500', color: '#e53e3e' }}>{order.paymentMethod === 'cod' ? 'COD' : 'Prepaid'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: '600', color: '#2d3748' }}>Amount:</span>
                                <span style={{ fontWeight: '500', color: '#e53e3e' }}>৳{order.total.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: '600', color: '#2d3748' }}>Items:</span>
                                <span style={{ fontWeight: '500', color: '#e53e3e' }}>{order.products.reduce((sum, p) => sum + p.quantity, 0)}</span>
                            </div>
                        </div>

                        {/* Products Section */}
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontWeight: '700', marginBottom: '1mm', paddingBottom: '0.5mm', borderBottom: '1px solid #2b6cb0', color: '#2d3748', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                                Products
                            </div>
                            <div style={{ maxHeight: '25mm', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '1mm', background: '#f7fafc' }}>
                                {order.products.map((product, index) => (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5mm 1mm', borderBottom: '1px dashed #e2e8f0', fontSize: '8px' }}>
                                        <span style={{ flex: 1, fontWeight: '500', color: '#2d3748' }}>{product.title}</span>
                                        <div style={{ fontSize: '7px', color: '#718096', textAlign: 'right', whiteSpace: 'nowrap', marginLeft: '1mm' }}>
                                            Qty: {product.quantity} | {product.size || 'N/A'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{
                            textAlign: 'center',
                            fontSize: '6px',
                            color: '#718096',
                            borderTop: '1px solid #e2e8f0',
                            paddingTop: '1mm',
                            marginTop: '1mm',
                            flexShrink: 0
                        }}>
                            <strong>SOOQRA ONE</strong> - www.sooqra.com
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3 border-t border-gray-200">
                    <button
                        onClick={handlePrint}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Label
                    </button>

                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShippingLabel;