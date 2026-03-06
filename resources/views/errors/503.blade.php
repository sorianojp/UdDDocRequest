@extends('errors::minimal')

@section('title', __('Service Unavailable'))
@section('code', '503')
@section('message', __('The document request system is currently in final preparations and will be live shortly. To ensure a faster and more organized processing experience, we have updated our submission system. This update was prompted by a high volume of duplicate requests, which previously slowed down our response times.
​Please note: As part of this transition, all pending requests have been cleared. We have now implemented a limit on the number of requests a student can submit. Rest assured, we receive every submission; there is no need to send duplicates.'))
