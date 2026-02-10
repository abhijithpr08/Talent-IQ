import Nav from "../components/Nav";

function DashboardPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <Nav />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4 text-base-content">Dashboard</h1>
        <p className="text-base-content/70">
          Welcome to your dashboard. From here you&apos;ll see your sessions, problems and
          upcoming interviews.
        </p>
      </main>
    </div>
  );
}

export default DashboardPage;