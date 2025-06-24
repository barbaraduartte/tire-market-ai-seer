
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Eye, EyeOff, ExternalLink } from 'lucide-react';

interface ApiKeyManagerProps {
  onApiKeysUpdate: (keys: { serpapi: string; gemini: string }) => void;
  initialKeys: { serpapi: string; gemini: string };
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeysUpdate, initialKeys }) => {
  const [keys, setKeys] = useState(initialKeys);
  const [showKeys, setShowKeys] = useState({ serpapi: false, gemini: false });
  const [isValidating, setIsValidating] = useState(false);

  const handleSave = async () => {
    if (!keys.serpapi || !keys.gemini) {
      return;
    }

    setIsValidating(true);
    
    // Simular validação das chaves
    setTimeout(() => {
      onApiKeysUpdate(keys);
      setIsValidating(false);
    }, 1000);
  };

  const toggleShowKey = (keyType: 'serpapi' | 'gemini') => {
    setShowKeys(prev => ({
      ...prev,
      [keyType]: !prev[keyType]
    }));
  };

  return (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50/50">
        <Key className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Suas chaves de API são armazenadas localmente no seu navegador e nunca são enviadas para nossos servidores.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {/* SerpAPI Key */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <div className="p-1 bg-green-100 rounded">
                  <Key className="h-4 w-4 text-green-600" />
                </div>
                <span>SerpAPI Key</span>
              </span>
              <a 
                href="https://serpapi.com/api-key" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>Obter chave</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Input
                type={showKeys.serpapi ? "text" : "password"}
                placeholder="Cole sua chave SerpAPI aqui..."
                value={keys.serpapi}
                onChange={(e) => setKeys(prev => ({ ...prev, serpapi: e.target.value }))}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => toggleShowKey('serpapi')}
              >
                {showKeys.serpapi ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-slate-600">
              Necessária para obter dados de busca do Google em tempo real
            </p>
          </CardContent>
        </Card>

        {/* Gemini API Key */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <div className="p-1 bg-purple-100 rounded">
                  <Key className="h-4 w-4 text-purple-600" />
                </div>
                <span>Gemini API Key</span>
              </span>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>Obter chave</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Input
                type={showKeys.gemini ? "text" : "password"}
                placeholder="Cole sua chave Gemini AI aqui..."
                value={keys.gemini}
                onChange={(e) => setKeys(prev => ({ ...prev, gemini: e.target.value }))}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => toggleShowKey('gemini')}
              >
                {showKeys.gemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-slate-600">
              Necessária para análises inteligentes e insights de IA
            </p>
          </CardContent>
        </Card>
      </div>

      <Button 
        onClick={handleSave} 
        disabled={!keys.serpapi || !keys.gemini || isValidating}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        size="lg"
      >
        {isValidating ? "Validando..." : "Salvar e Continuar"}
      </Button>
    </div>
  );
};

export default ApiKeyManager;
