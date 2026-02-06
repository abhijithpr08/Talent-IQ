import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import { useUser } from "@clerk/clerk-react";

function App() {

  const {IsSignedIn} = useUser();

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>} /> 
      </Routes>

      <Toaster position="top-left" />
    </>
  );
}

export default App;
