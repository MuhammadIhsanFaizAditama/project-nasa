<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class NasaApiController extends Controller
{
    /**
     * Fetch Astronomy Picture of the Day (APOD) from NASA API.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function apod(): JsonResponse
    {
        $nasaApiKey = env('NASA_API_KEY') ?: 'DEMO_KEY';
        try {
            $response = Http::withoutVerifying()->timeout(10)->get('https://api.nasa.gov/planetary/apod', [
                'api_key' => $nasaApiKey,
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data dari NASA API.'
            ], $response->status());
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menghubungi NASA API: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search the NASA Image and Video Library.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->query('q');
        if (!$query) {
            return response()->json([
                'status' => 'error',
                'message' => 'Query pencarian (q) wajib diisi.'
            ], 400);
        }

        try {
            $response = Http::withoutVerifying()->timeout(15)->get('https://images-api.nasa.gov/search', [
                'q' => $query,
                'media_type' => $request->query('media_type', 'image,video')
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data dari NASA Images API.'
            ], $response->status());
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menghubungi NASA Images API: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retrieve a media asset's manifest from NASA Images API.
     *
     * @param  string  $nasaId
     * @return \Illuminate\Http\JsonResponse
     */
    public function asset($nasaId): JsonResponse
    {
        try {
            $response = Http::withoutVerifying()->timeout(15)->get("https://images-api.nasa.gov/asset/{$nasaId}");

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil manifest aset dari NASA Images API.'
            ], $response->status());
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menghubungi NASA Images API: ' . $e->getMessage()
            ], 500);
        }
    }
}
