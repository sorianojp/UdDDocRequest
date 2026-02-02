<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .header {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            border-bottom: 1px solid #ddd;
        }
        .content {
            padding: 20px;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            text-align: center;
            color: #777;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            background-color: #007bff; /* Default Blue */
        }
        .status-PENDING { background-color: #ffc107; color: #000; }
        .status-PROCESSING { background-color: #17a2b8; }
        .status-DEFICIENT { background-color: #dc3545; }
        .status-READY { background-color: #28a745; }
        .status-CLAIMED { background-color: #6c757d; }
        .status-REJECTED { background-color: #343a40; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Document Request Update</h2>
        </div>
        <div class="content">
            <p>Dear {{ $documentRequest->student_name }},</p>
            
            <p>This is to inform you that the status of your document request (Reference No: <strong>{{ $documentRequest->reference_number }}</strong>) has been updated.</p>

            <p>
                <strong>New Status:</strong> 
                <span class="status-badge status-{{ $documentRequest->status }}">
                    {{ $documentRequest->status }}
                </span>
            </p>

            @if($documentRequest->status === 'DEFICIENT' && $documentRequest->deficiency_remarks)
                <div style="background-color: #fff3cd; border: 1px solid #ffeeba; padding: 10px; border-radius: 4px; margin-top: 10px;">
                    <strong>Deficiency Remarks:</strong><br>
                    {{ $documentRequest->deficiency_remarks }}
                </div>
            @endif

            @if($documentRequest->status === 'READY')
                <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 10px; border-radius: 4px; margin-top: 10px;">
                    <strong>Your documents are ready for claiming!</strong><br>
                    @if($documentRequest->claiming_date)
                        Claiming Date: {{ $documentRequest->claiming_date->format('F j, Y') }}
                    @endif
                </div>
            @endif

            <p>You can track the full details of your request using the link below:</p>
            <p>
                <a href="{{ route('request.show-status', ['reference_number' => $documentRequest->reference_number]) }}">
                    View Request Details
                </a>
            </p>
        </div>
        <div class="footer">
            <p>Thank you for using our service.</p>
            <p>Universidad de Dagupan</p>
        </div>
    </div>
</body>
</html>
