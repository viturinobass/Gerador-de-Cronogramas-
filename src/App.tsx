import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LoginPage } from "./pages/Login";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { GradientBackground } from "./components/ui/gradient-background";

const queryClient = new QueryClient();

// Componente que protege as rotas
const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Pode mostrar um spinner/loading aqui
    return (
        <GradientBackground>
            <div className="flex items-center justify-center min-h-screen text-white">
                Carregando...
            </div>
        </GradientBackground>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Renderiza a rota filha (Index)
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rotas Protegidas */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Index />} />
            </Route>

            {/* Rota para página não encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
