
export const PDF_STATEMENT_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; margin: 0; padding: 20px; }
        .header { border-bottom: 2px solid #25D366; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .header h1 { color: #25D366; margin: 0; font-size: 24px; }
        .info { margin-bottom: 20px; }
        .info p { margin: 5px 0; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #f8f9fa; border-bottom: 2px solid #dee2e6; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; color: #666; }
        td { padding: 12px; border-bottom: 1px solid #dee2e6; font-size: 14px; }
        .total-box { margin-top: 30px; text-align: right; border-top: 2px solid #333; padding-top: 10px; }
        .total-box h2 { margin: 0; font-size: 20px; color: #25D366; }
        .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #999; }
        .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .credit { color: #dc3545; }
        .payment { color: #25D366; }
    </style>
</head>
<body>
    <div class="header">
        <h1>DukaanMitra</h1>
        <div style="text-align: right">
            <p style="font-weight: bold; margin: 0;">Statement for {{customer_name}}</p>
            <p style="font-size: 12px; color: #666; margin: 0;">Date: {{generated_date}}</p>
        </div>
    </div>

    <div class="info">
        <p><strong>Shop:</strong> {{shop_name}}</p>
        <p><strong>Phone:</strong> +{{customer_phone}}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Items</th>
                <th>Type</th>
                <th style="text-align: right">Amount</th>
            </tr>
        </thead>
        <tbody>
            {{#each transactions}}
            <tr>
                <td>{{this.date}}</td>
                <td>{{this.items}}</td>
                <td class="{{#if this.is_credit}}credit{{else}}payment{{/if}}">
                    {{#if this.is_credit}}CREDIT{{else}}PAYMENT{{/if}}
                </td>
                <td style="text-align: right">₹{{this.amount}}</td>
            </tr>
            {{/each}}
        </tbody>
    </table>

    <div class="total-box">
        <p style="font-size: 12px; color: #666; margin-bottom: 5px;">Total Outstanding Balance</p>
        <h2>₹{{total_outstanding}}</h2>
    </div>

    <div class="footer">
        <p>This is a computer-generated statement by DukaanMitra on WhatsApp.</p>
        <p>Safe. Secure. Automatic Hisaab.</p>
    </div>
</body>
</html>
`;