import { useAuth } from './hooks/useAuth';

function App() {

  const { user, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <h1>Supabase Connected</h1>

      {user ? (
        <p>Logged in</p>
      ) : (
        <p>Not logged in</p>
      )}
    </>
  );
}
export default App;