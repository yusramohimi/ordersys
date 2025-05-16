import SideBar from "../components/SideBar";

function Home() {
  return (
    <div className="min-h-screen flex flex-col">

      <div className="flex flex-1">
        <SideBar />

        <main className="flex-1 bg-gradient-to-br from-blue-100 via-white to-blue-50 p-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">Bienvenue sur GestionAchats</h1>
            <p className="text-lg text-gray-700 max-w-xl mx-auto">
              Centralisez vos achats, suivez vos fournisseurs et gardez le contrôle sur vos stocks. Simple, rapide et efficace.
            </p>
            <img
              src="/src/assets/image.png"
              alt="dashboard illustration"
              className="w-60 mx-auto mt-10 opacity-80"
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;


