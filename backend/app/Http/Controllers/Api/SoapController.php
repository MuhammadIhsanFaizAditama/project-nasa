<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SoapService;
use Illuminate\Http\Request;

class SoapController extends Controller
{
    public function handle(Request $request)
    {
        $endpoint = route('soap.service');

        if ($request->isMethod('get')) {
            $wsdl = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<definitions name="SoapService"
  targetNamespace="{$endpoint}"
  xmlns="http://schemas.xmlsoap.org/wsdl/"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:tns="{$endpoint}"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema">

  <message name="getAllArtikelRequest"/>
  <message name="getAllArtikelResponse">
    <part name="return" type="xsd:string"/>
  </message>
  <message name="getDetailArtikelRequest">
    <part name="id" type="xsd:int"/>
  </message>
  <message name="getDetailArtikelResponse">
    <part name="return" type="xsd:string"/>
  </message>

  <portType name="SoapServicePort">
    <operation name="getAllArtikel">
      <input message="tns:getAllArtikelRequest"/>
      <output message="tns:getAllArtikelResponse"/>
    </operation>
    <operation name="getDetailArtikel">
      <input message="tns:getDetailArtikelRequest"/>
      <output message="tns:getDetailArtikelResponse"/>
    </operation>
  </portType>

  <binding name="SoapServiceBinding" type="tns:SoapServicePort">
    <soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="getAllArtikel">
      <soap:operation soapAction="getAllArtikel"/>
      <input><soap:body use="encoded" namespace="{$endpoint}" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/></input>
      <output><soap:body use="encoded" namespace="{$endpoint}" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/></output>
    </operation>
    <operation name="getDetailArtikel">
      <soap:operation soapAction="getDetailArtikel"/>
      <input><soap:body use="encoded" namespace="{$endpoint}" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/></input>
      <output><soap:body use="encoded" namespace="{$endpoint}" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/></output>
    </operation>
  </binding>

  <service name="SoapService">
    <port name="SoapServicePort" binding="tns:SoapServiceBinding">
      <soap:address location="{$endpoint}"/>
    </port>
  </service>

</definitions>
XML;
            return response($wsdl)->header('Content-Type', 'text/xml; charset=utf-8');
        }

        $service = new SoapService();
        $server = new \SoapServer(null, [
            'uri' => $endpoint,
            'location' => $endpoint,
        ]);
        $server->setObject($service);

        ob_start();
        $server->handle();
        $response = ob_get_clean();

        return response($response)->header('Content-Type', 'text/xml; charset=utf-8');
    }
}