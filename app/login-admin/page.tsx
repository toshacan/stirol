'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginAdmin() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Отправляем пароль на сервер, чтобы он поставил куку
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/super-panel');
    } else {
      alert('Wrong password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-white bg-black p-2 text-white"
          placeholder="ENTER PASSWORD"
        />
        <button type="submit" className="border border-white p-2 hover:bg-white hover:text-black">
          ACCESS
        </button>
      </form>
    </div>
  );
}