
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GradientBackground } from "@/components/ui/gradient-background";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login bem-sucedido! 👋",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro no Login",
        description: "E-mail ou senha incorretos. Verifique e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <GradientBackground>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[400px] bg-white/90 backdrop-blur-sm border-zinc-300">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-zinc-900">🚀 Cronograma Inteligente</CardTitle>
            <CardDescription className="text-zinc-600">
              Acesse com suas credenciais para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email" className="text-zinc-900">Email</Label>
                  <Input 
                    id="email" 
                    placeholder="seu@email.com" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border-zinc-300 text-zinc-900"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password" className="text-zinc-900">Senha</Label>
                  <Input 
                    id="password" 
                    placeholder="Sua senha" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border-zinc-300 text-zinc-900"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button onClick={handleLogin} disabled={isLoading} className="w-full" size="lg">
              {isLoading ? "Aguarde..." : "Entrar"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </GradientBackground>
  );
}
