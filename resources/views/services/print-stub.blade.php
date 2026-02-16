<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claim Stub - {{ $request->reference_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            border: 2px dashed #333;
            padding: 30px;
            border-radius: 10px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            text-transform: uppercase;
        }
        .header h2 {
            margin: 5px 0 0;
            font-size: 16px;
            font-weight: normal;
        }
        .ref-number {
            text-align: center;
            margin: 20px 0;
            background-color: #f0f0f0;
            padding: 10px;
            border-radius: 5px;
        }
        .ref-number span {
            display: block;
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
        }
        .ref-number strong {
            display: block;
            font-size: 32px;
            letter-spacing: 2px;
        }
        .details {
            margin-bottom: 20px;
        }
        .row {
            display: flex;
            margin-bottom: 8px;
        }
        .label {
            width: 120px;
            font-weight: bold;
            color: #555;
        }
        .value {
            flex: 1;
            font-weight: 500;
        }
        .document-list {
            margin: 15px 0;
            border: 1px solid #ddd;
        }
        .document-list table {
            width: 100%;
            border-collapse: collapse;
        }
        .document-list th, .document-list td {
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
        }
        .document-list th {
            background-color: #f9f9f9;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .note {
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 10px;
            border-radius: 5px;
            font-size: 13px;
            text-align: center;
            margin-top: 20px;
        }
        @media print {
            body { padding: 0; }
            .container { border: 2px solid #000; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="no-print" style="text-align: center; margin-bottom: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Print Claim Stub</button>
    </div>

    <div class="container">
        <div class="header">
            <h1>Universidad de Dagupan</h1>
            <h2>Document Request Claim Stub</h2>
        </div>

        <div class="ref-number">
            <span>Reference Number</span>
            <strong>{{ $request->reference_number }}</strong>
        </div>

        <div class="details">
            <div class="row">
                <span class="label">Student Name:</span>
                <span class="value">{{ $request->student_name }}</span>
            </div>
            <div class="row">
                <span class="label">Student ID:</span>
                <span class="value">{{ $request->student_id_number }}</span>
            </div>
            @if($request->claiming_date)
            <div class="row">
                <span class="label">Claim Date:</span>
                <span class="value">{{ $request->claiming_date->format('F j, Y') }}</span>
            </div>
            @endif
        </div>

        <div class="document-list">
            <table>
                <thead>
                    <tr>
                        <th>Document</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($request->items as $item)
                        <tr>
                            <td>{{ $item->document_type }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="note">
            <strong>IMPORTANT:</strong> Please present this stub and your valid ID at the Registrar's Office to claim your documents.
        </div>

        <div class="footer">
            Generated on {{ now()->format('F j, Y h:i A') }}
        </div>
    </div>

    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 500);
        }
    </script>
</body>
</html>
