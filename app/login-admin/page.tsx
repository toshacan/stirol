'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginAdmin() {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/super-panel');
        return;
      }

      const data = await res.json().catch(() => null);
      setErrorMsg(data?.error || 'Wrong password');
    } catch {
      setErrorMsg('Network error, try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white font-mono">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-xs px-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-white bg-black p-2 text-white text-sm outline-none focus:border-gray-400"
          placeholder="ENTER PASSWORD"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="border border-white p-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-40"
        >
          {loading ? 'CHECKING...' : 'ACCESS'}
        </button>

        {errorMsg && (
          <p className="text-red-500 text-[10px] uppercase tracking-widest text-center">
            {errorMsg}
          </p>
        )}
      </form>
    </div>
  );
}