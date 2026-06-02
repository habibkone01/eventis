<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AuthLoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Connexion de l'admin
     */
    public function login(AuthLoginRequest $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect',
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'token' => $token,
        ], 200);
    }

    /**
     * Déconnexion de l'admin
     */
    public function logout(Request $request)
    {
        $token = $request->user()->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie',
        ], 200);
    }

    /**
     * Retourner l'admin connecté
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ], 200);
    }
}
