import Nav from "../components/Nav";

function ProblemsPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <Nav />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4 text-base-content">Problems</h1>
        <p className="text-base-content/70">
          Here you&apos;ll be able to browse and practice coding problems.
        </p>
      </main>
    </div>
  );
}

export default ProblemsPage;
