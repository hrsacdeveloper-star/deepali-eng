import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';

type Todo = {
  id: number;
  name: string;
};

const DataPush = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from<Todo>('todos')
      .select('*')
      .order('id', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setTodos([]);
    } else {
      setTodos(data || []);
    }

    setLoading(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Enter a name before saving.');
      return;
    }

    setLoading(true);
    const { error: insertError } = await supabase.from('todos').insert([{ name: name.trim() }]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setName('');
      await fetchTodos();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4">Supabase SQL Data Push</h1>
      <p className="mb-6 text-sm text-slate-600">
        Add a new row to the <code className="rounded bg-slate-100 px-1 py-0.5">todos</code> table and list existing rows.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Todo name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter todo text"
            className="mt-2 w-full rounded border border-slate-300 px-3 py-2 shadow-sm focus:border-slate-500 focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save todo'}
        </button>
      </form>

      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      <div>
        <h2 className="text-2xl font-semibold mb-3">Todos</h2>
        {loading ? (
          <p className="text-sm text-slate-500">Loading todos…</p>
        ) : todos.length > 0 ? (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li key={todo.id} className="rounded border border-slate-200 bg-white px-4 py-3 shadow-sm">
                {todo.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No todos found yet.</p>
        )}
      </div>
    </div>
  );
};

export default DataPush;
