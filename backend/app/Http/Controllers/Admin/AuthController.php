<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    //menampilkan halaman login
    public function showlogin()
    {
        return view('admin.auth.login');
    }

    //memproses data login
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            if (Auth::user()->role === 'admin') {
                return redirect()->intended('/admin/dashboard');
            }

            //login sukses tapi bukan admin, maka logout dan tampilkan pesan error
            Auth::logout();
            return back()->withErrors([
                'email' => 'Akses ditolak. Anda bukan Administrator.',
            ]);
        }

        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ])-> onlyInput('email');
    }

    //memproses logout
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
