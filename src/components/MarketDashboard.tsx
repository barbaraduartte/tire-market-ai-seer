
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Search, 
  Eye,
  RefreshCw,
  AlertCircle,
  Star,
  Brain,
  Globe
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import ApiService from '@/services/apiService';

interface MarketDashboardProps {
  apiKeys: { serpapi: string; gemini: string };
}

const MarketDashboard: React.FC<MarketDashboardProps> = ({ apiKeys }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [marketData, setMarketData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  const loadRealMarketData = async () => {
    if (!apiKeys.serpapi || !apiKeys.gemini) {
      toast({
        title: "Erro de configuração",
        description: "Chaves de API não configuradas corretamente.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Iniciando coleta de dados reais do mercado...');
    
    try {
      const apiService = new ApiService(apiKeys.serpapi, apiKeys.gemini);
      const realData = await apiService.getMarketAnalysis();
      
      // Processar dados para o dashboard
      const processedData = {
        totalVolume: realData.summary.topKeywords.reduce((acc: number, k: any) => acc + k.volume, 0),
        avgCompetition: realData.summary.avgCompetition,
        totalKeywords: realData.summary.totalKeywords,
        keywordData: realData.keywordData,
        aiInsights: realData.aiAnalysis,
        timestamp: realData.timestamp,
        
        // Dados para gráficos
        categoryData: realData.keywordData.map((item: any, index: number) => ({
          name: item.keyword,
          value: Math.floor((item.totalResults / 1000000) * 100) || 1,
          volume: item.totalResults,
          competition: item.adsCount,
          color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'][index % 7]
        })),
        
        topSearches: realData.summary.topKeywords.map((item: any, index: number) => ({
          term: item.keyword,
          volume: item.volume,
          trend: 'up',
          competition: realData.keywordData.find((k: any) => k.keyword === item.keyword)?.adsCount || 0
        }))
      };
      
      setMarketData(processedData);
      setLastUpdate(new Date());
      
      toast({
        title: "Dados reais carregados!",
        description: `Análise de ${realData.summary.totalKeywords} palavras-chave concluída com sucesso.`,
      });
      
    } catch (error: any) {
      console.error('Erro ao carregar dados reais:', error);
      toast({
        title: "Erro ao carregar dados",
        description: error.message || "Não foi possível carregar os dados reais do mercado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Carregar dados reais na inicialização
    if (apiKeys.serpapi && apiKeys.gemini) {
      loadRealMarketData();
    }
  }, [apiKeys.serpapi, apiKeys.gemini]);

  if (!marketData && !isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <CardContent>
            <Globe className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Dados do Mercado</h3>
            <p className="text-slate-600 mb-4">
              Clique em "Carregar Dados Reais" para obter informações atualizadas do mercado de pneus.
            </p>
            <Button onClick={loadRealMarketData} className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Search className="h-4 w-4 mr-2" />
              Carregar Dados Reais
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de atualização */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard do Mercado - Dados Reais</h2>
          <p className="text-slate-600">
            Análise em tempo real do mercado de pneus baseada em dados do Google
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {lastUpdate && (
            <span className="text-sm text-slate-500">
              Última atualização: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <Button onClick={loadRealMarketData} disabled={isLoading} className="space-x-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Carregando...' : 'Atualizar'}</span>
          </Button>
        </div>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">Coletando dados do mercado...</h3>
            <p className="text-slate-600">
              Buscando informações reais de volume, competição e tendências do mercado de pneus.
              Isso pode levar alguns minutos.
            </p>
          </CardContent>
        </Card>
      )}

      {marketData && (
        <>
          {/* Métricas principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Volume Total</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {(marketData.totalVolume / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-xs text-blue-700 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Resultados encontrados
                    </p>
                  </div>
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Competição Média</p>
                    <p className="text-2xl font-bold text-green-900">
                      {marketData.avgCompetition.toFixed(1)}
                    </p>
                    <p className="text-xs text-green-700 flex items-center mt-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Anúncios por termo
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Palavras Analisadas</p>
                    <p className="text-2xl font-bold text-orange-900">{marketData.totalKeywords}</p>
                    <p className="text-xs text-orange-700 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Termos do mercado
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Status IA</p>
                    <p className="text-2xl font-bold text-purple-900">Ativo</p>
                    <p className="text-xs text-purple-700 flex items-center mt-1">
                      <Brain className="h-3 w-3 mr-1" />
                      Análise Gemini
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Volume por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle>Volume por Palavra-chave</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marketData.categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        `${(value * 10000).toLocaleString()} resultados`,
                        'Volume'
                      ]}
                    />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribuição de Competição */}
            <Card>
              <CardHeader>
                <CardTitle>Competição por Segmento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={marketData.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, competition }) => `${name}: ${competition} ads`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="competition"
                    >
                      {marketData.categoryData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Palavras-chave */}
          <Card>
            <CardHeader>
              <CardTitle>Top Palavras-chave do Mercado (Dados Reais)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketData.topSearches.map((search: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="px-2 py-1">
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{search.term}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-slate-600">
                        {search.volume.toLocaleString()} resultados
                      </span>
                      <span className="text-slate-600">
                        {search.competition} anúncios
                      </span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights da IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>Análise Inteligente do Mercado (Gemini AI)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-purple-50 rounded-lg">
                <pre className="whitespace-pre-wrap text-purple-900 text-sm">
                  {marketData.aiInsights}
                </pre>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default MarketDashboard;
