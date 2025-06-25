
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  Search, 
  BarChart3, 
  Eye, 
  DollarSign, 
  Target,
  Settings,
  Zap,
  Brain,
  Globe,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import ApiKeyManager from '@/components/ApiKeyManager';
import MarketDashboard from '@/components/MarketDashboard';
import SearchAnalyzer from '@/components/SearchAnalyzer';
import CustomSearch from '@/components/CustomSearch';
import TrendAnalysis from '@/components/TrendAnalysis';
import BrandComparator from '@/components/BrandComparator';
import OpportunityDetector from '@/components/OpportunityDetector';
import ReportsSection from '@/components/ReportsSection';
import ApiService from '@/services/apiService';

const Index = () => {
  const [apiKeys, setApiKeys] = useState({
    serpapi: localStorage.getItem('serpapi_key') || '',
    gemini: localStorage.getItem('gemini_key') || ''
  });
  
  const [isConfigured, setIsConfigured] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateAndSetKeys = async (keys: { serpapi: string; gemini: string }) => {
    setIsValidating(true);
    
    try {
      const apiService = new ApiService(keys.serpapi, keys.gemini);
      const validation = await apiService.validateApiKeys();
      
      if (validation.valid) {
        setApiKeys(keys);
        localStorage.setItem('serpapi_key', keys.serpapi);
        localStorage.setItem('gemini_key', keys.gemini);
        setIsConfigured(true);
        
        toast({
          title: "Chaves validadas com sucesso!",
          description: "Sistema pronto para análises em tempo real do mercado.",
        });
      } else {
        setIsConfigured(false);
        toast({
          title: "Erro na validação",
          description: "Uma ou ambas as chaves API são inválidas.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsConfigured(false);
      toast({
        title: "Erro de validação",
        description: "Não foi possível validar as chaves API.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    if (apiKeys.serpapi && apiKeys.gemini) {
      validateAndSetKeys(apiKeys);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TireMarket AI
                </h1>
                <p className="text-sm text-slate-600">Análise Inteligente do Mercado de Pneus</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isConfigured ? "default" : "secondary"} className="px-3 py-1">
                {isConfigured ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    APIs Validadas
                  </>
                ) : (
                  <>
                    <Settings className="h-3 w-3 mr-1" />
                    Configuração Necessária
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {!isConfigured || isValidating ? (
          /* Configuration Section */
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                  {isValidating ? 'Validando APIs...' : 'Configuração Obrigatória'}
                </CardTitle>
                <p className="text-slate-600">
                  {isValidating 
                    ? 'Verificando a validade das suas chaves API...'
                    : 'Configure e valide suas chaves de API para acessar dados reais do mercado'
                  }
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ApiKeyManager onApiKeysUpdate={validateAndSetKeys} initialKeys={apiKeys} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <Card className="border-blue-100 bg-blue-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-blue-900">SerpAPI</h3>
                          <p className="text-sm text-blue-700">Dados de busca em tempo real</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-purple-100 bg-purple-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Brain className="h-8 w-8 text-purple-600" />
                        <div>
                          <h3 className="font-semibold text-purple-900">Gemini AI</h3>
                          <p className="text-sm text-purple-700">Análises inteligentes</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Main Application */
          <Tabs defaultValue="custom" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white/70 backdrop-blur-sm">
              <TabsTrigger 
                value="custom" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Search className="h-4 w-4 mr-2" />
                Busca Personalizada
              </TabsTrigger>
              <TabsTrigger 
                value="trends" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Tendências
              </TabsTrigger>
              <TabsTrigger 
                value="brands"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Target className="h-4 w-4 mr-2" />
                Comparador
              </TabsTrigger>
              <TabsTrigger 
                value="opportunities"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Oportunidades
              </TabsTrigger>
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="reports"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                Relatórios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="custom">
              <CustomSearch apiKeys={apiKeys} />
            </TabsContent>

            <TabsContent value="trends">
              <TrendAnalysis apiKeys={apiKeys} />
            </TabsContent>

            <TabsContent value="brands">
              <BrandComparator apiKeys={apiKeys} />
            </TabsContent>

            <TabsContent value="opportunities">
              <OpportunityDetector apiKeys={apiKeys} />
            </TabsContent>

            <TabsContent value="dashboard">
              <MarketDashboard apiKeys={apiKeys} />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsSection apiKeys={apiKeys} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
