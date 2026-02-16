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
        .status-WAITING_FOR_PAYMENT, .status-VERIFYING_PAYMENT { background-color: #fd7e14; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Document Request Update</h2>
        </div>
        <div class="content">
            <p>Dear {{ $documentRequest->student_name }},</p>
            
            <p>This is to inform you that the status of your document request has been updated.</p>
            
            <div style="text-align: center; margin: 20px 0; background-color: #e9ecef; padding: 15px; border-radius: 5px;">
                <p style="margin: 0; font-size: 0.9em; text-transform: uppercase; color: #6c757d;">Reference Number</p>
                <p style="margin: 5px 0 0 0; font-size: 1.8em; font-weight: bold; letter-spacing: 2px; color: #333;">
                    {{ $documentRequest->reference_number }}
                </p>
            </div>

            <p>
                <strong>New Status:</strong> 
                <span class="status-badge status-{{ $documentRequest->status }}">
                    {{ str_replace('_', ' ', ucwords(strtolower($documentRequest->status))) }}
                </span>
            </p>

            @if($documentRequest->status === 'WAITING_FOR_PAYMENT')
                <div style="background-color: #fff3cd; border: 1px solid #ffeeba; padding: 10px; border-radius: 4px; margin-top: 10px;">
                    <strong>Action Required:</strong><br>
                    Please upload your proof of payment to proceed with your request.
                </div>
            @endif

            @if($documentRequest->status === 'VERIFYING_PAYMENT')
                <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 10px; border-radius: 4px; margin-top: 10px;">
                    <strong>Payment Verification:</strong><br>
                    We have received your proof of payment. Please wait while we verify it.
                </div>
            @endif

            @if($documentRequest->status === 'DEFICIENT' && $documentRequest->deficiency_remarks)
                <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; border-radius: 4px; margin-top: 10px;">
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
            <p style="margin-top: 10px; font-size: 0.8em; color: #999;">
                For inquiries, please contact the Registrar's Office:<br>
                Email: registrar@udd.edu.ph | Phone: (075) 522-8295
            </p>
        </div>
    </div>
</body>
</html>
