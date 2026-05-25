<?php

namespace App\Services;

use App\Models\Article;

class SoapService
{
    /**
     * Mengambil semua daftar artikel 
     *
     * @return array
     */
    public function getAllArtikel(): array
    {
        return Article::with('category')
            ->latest()
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'category' => $article->category->nama_kategori ?? '',
                    'created_at' => $article->created_at->toIso8601String(),
                ];
            })
            ->toArray();
    }

    /**
     * Mengambil detail satu artikel berdasarkan ID
     *
     * @param int $id
     * @return array
     */
    public function getDetailArtikel(int $id): array
    {
        $article = Article::with('category')->find($id);

        if (!$article) {
            return ['status' => 'error', 'message' => 'Artikel tidak ditemukan.'];
        }

        return [
            'id' => $article->id,
            'title' => $article->title,
            'content' => $article->content,
            'category' => $article->category->nama_kategori ?? '',
            'created_at' => $article->created_at->toIso8601String(),
        ];
    }
}