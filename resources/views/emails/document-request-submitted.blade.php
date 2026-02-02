<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #f4f4f4; padding: 10px; text-align: center; border-bottom: 1px solid #ddd; }
        .content { padding: 20px; }
        .footer { margin-top: 20px; font-size: 0.9em; text-align: center; color: #777; }
        .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Document Request Received</h2>
        </div>
        <div class="content">
            <p>Dear {{ $documentRequest->student_name }},</p>
            
            <p>We have received your document request. Your reference number is <strong>{{ $documentRequest->reference_number }}</strong>.</p>

            <p><strong>Documents Requested:</strong></p>
            <ul>
                @foreach($documentRequest->items as $item)
                    <li>{{ $item->document_type }}</li>
                @endforeach
            </ul>

            <p><strong>Total Amount Due:</strong> ₱{{ number_format($documentRequest->amount_due, 2) }}</p>

            <p>To proceed, please ensure you upload your payment proof (if you haven't already).</p>

            <p>You can track your request and upload payment proof here:</p>
            <p>
                <a href="{{ route('request.show-status', ['reference_number' => $documentRequest->reference_number]) }}" class="button">
                    Track Request & Pay
                </a>
            </p>
        </div>
        <div class="footer">
            <p>Universidad de Dagupan</p>
            <p style="margin-top: 10px; font-size: 0.8em; color: #999;">
                For inquiries, please contact the Registrar's Office:<br>
                Email: registrar@udd.edu.ph | Phone: (075) 522-8295
            </p>
        </div>
    </div>
</body>
</html>
