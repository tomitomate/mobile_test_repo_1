import { useEffect, useState } from 'react';

interface Board {
  id: string;
  name: string;
}

function App() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('/boards')
      .then(res => res.json())
      .then(setBoards)
      .catch(console.error);
  }, []);

  const createBoard = () => {
    fetch('/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
      .then(res => res.json())
      .then(b => setBoards(prev => [...prev, b]))
      .catch(console.error);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Boards</h1>
      <input
        className="border p-1 mr-2"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="New board name"
      />
      <button className="bg-blue-500 text-white px-2" onClick={createBoard}>
        Add
      </button>
      <ul className="mt-4 list-disc list-inside">
        {boards.map(b => (
          <li key={b.id}>{b.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
