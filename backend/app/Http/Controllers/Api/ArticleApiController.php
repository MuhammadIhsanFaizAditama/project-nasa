<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
use App\Http\Resources\Api\ArticleResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ArticleApiController extends Controller
{
    /**
     * Display a listing of articles.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $articles = Article::with(['category', 'user'])->latest()->get();
        return ArticleResource::collection($articles);
    }

    /**
     * Display the specified article.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse|\App\Http\Resources\Api\ArticleResource
     */
    public function show($id)
    {
        $article = Article::with(['category', 'user'])->find($id);
        if (!$article) {
            return response()->json([
                'status' => 'error',
                'message' => 'Article tidak ditemukan'
            ], 404);
        }
        return new ArticleResource($article);
    }

    /**
     * Store a newly created article.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $validated['user_id'] = Auth::id() ?: 1; // Fallback to user 1 if not explicitly authenticated (or default admin)
        $validated['slug'] = Str::slug($request->title) . '-' . time();

        $article = Article::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Artikel berhasil ditambahkan',
            'data' => new ArticleResource($article->load(['category', 'user']))
        ], 201);
    }

    /**
     * Update the specified article.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $article = Article::find($id);
        if (!$article) {
            return response()->json([
                'status' => 'error',
                'message' => 'Artikel tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $validated['slug'] = Str::slug($request->title) . '-' . time();

        $article->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Artikel berhasil diperbarui',
            'data' => new ArticleResource($article->load(['category', 'user']))
        ]);
    }

    /**
     * Remove the specified article.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $article = Article::find($id);
        if (!$article) {
            return response()->json([
                'status' => 'error',
                'message' => 'Artikel tidak ditemukan'
            ], 404);
        }

        // Delete associated image from storage if any
        if ($article->image) {
            Storage::disk('public')->delete($article->image);
        }

        $article->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Artikel berhasil dihapus'
        ]);
    }
}
