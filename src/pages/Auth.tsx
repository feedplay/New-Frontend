import { useState } from 'react';
import { signInWithGoogle, signInWithGithub } from "@/firebase/auth"; // Import signInWithGoogle and signInWithGithub
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Success",
        description: "Successfully logged in with Google",
      });
      navigate('/index'); // Navigate to the Index route
    } catch (err: any) {
      console.error('Error signing in with Google:', err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
      toast({
        title: "Success",
        description: "Successfully logged in with GitHub",
      });
      navigate('/index'); // Navigate to the Index route
    } catch (err: any) {
      console.error('Error signing in with GitHub:', err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 mt-4"
        >
          Sign in with Google
        </button>

        <button
          onClick={handleGithubSignIn}
          className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 mt-4"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
};

export default Auth;
