<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SoapService;
use Illuminate\Http\Request;
use Laminas\Soap\AutoDiscover;
use Laminas\Soap\Server;

class SoapController extends Controller
{
    public function handle(Request $request)
    {
        $endpoint = route('soap.service');

        //diakses via get, generate WSDL secara otomatis
        if ($request->isMethod('get')) {
            $autodiscover = new AutoDiscover();
            $autodiscover->setClass(SoapService::class)
                ->setUri($endpoint);

            return response($autodiscover->generate()->toXml())
                ->header('Content-Type', 'text/xml; charset=utf-8');
        }

        //diakses via post, proses request data xml menggunakan SoapServer
        $soapServer = new Server(null, [
            'uri' => $endpoint,
            'location' => $endpoint,
        ]);

        $soapServer->setClass(SoapService::class);

        return response()->stream(function () use ($soapServer) {
            $soapServer->handle();
        }, 200, ['Content-Type' => 'text/xml; charset=utf-8']);
    }
}