
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
  Star
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface MarketDashboardProps {
  apiKeys: { serpapi: string; gemini: string };
}

const MarketDashboard: React.FC<MarketDashboardProps> = ({ apiKeys }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [marketData, setMarketData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  // Dados simulados para demonstração
  const trendData = [
    { name: 'Jan', volume: 4000, cpc: 2.4, tendencia: 85 },
    { name: 'Fev', volume: 3000, cpc: 1.8, tendencia: 88 },
    { name: 'Mar', volume: 5000, cpc: 2.8, tendencia: 92 },
    { name: 'Abr', volume: 6000, cpc: 3.2, tendencia: 95 },
    { name: 'Mai', volume: 8000, cpc: 2.9, tendencia: 98 },
    { name: 'Jun', volume: 9500, cpc: 3.5, tendencia: 100 }
  ];

  const categoryData = [
    { name: 'Pneus Aro 13', value: 35, color: '#3B82F6' },
    { name: 'Pneus Aro 14', value: 28, color: '#10B981' },
    { name: 'Pneus Aro 15', value: 22, color: '#F59E0B' },
    { name: 'Pneus Aro 16+', value: 15, color: '#EF4444' }
  ];

  const topSearches = [
    { term: 'pneu aro 13 barato', volume: 12500, trend: 'up', cpc: 1.85 },
    { term: 'pneu 175/70 r13', volume: 9800, trend: 'up', cpc: 2.10 },
    { term: 'pneu remold', volume: 8200, trend: 'down', cpc: 1.45 },
    { term: 'pneu continental', volume: 7600, trend: 'up', cpc: 3.20 },
    { term: 'pneu pirelli preço', volume: 6900, trend: 'up', cpc: 2.95 }
  ];

  const loadMarketData = async () => {
    setIsLoading(true);
    console.log('Carregando dados do mercado...');
    
    try {
      // Simular chamada para APIs
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMarketData({
        totalVolume: 156000,
        avgCpc: 2.65,
        competition: 0.82,
        trends: trendData,
        categories: categoryData,
        topSearches: topSearches
      });
      
      setLastUpdate(new Date());
      
      toast({
        title: "Dados atualizados",
        description: "Os dados do mercado foram carregados com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do mercado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMarketData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header com botão de atualização */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard do Mercado</h2>
          <p className="text-slate-600">
            Visão geral das tendências e oportunidades no mercado de pneus
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {lastUpdate && (
            <span className="text-sm text-slate-500">
              Última atualização: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <Button onClick={loadMarketData} disabled={isLoading} className="space-x-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Volume Total</p>
                <p className="text-2xl font-bold text-blue-900">156K</p>
                <p className="text-xs text-blue-700 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% vs mês anterior
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
                <p className="text-green-600 text-sm font-medium">CPC Médio</p>
                <p className="text-2xl font-bold text-green-900">R$ 2,65</p>
                <p className="text-xs text-green-700 flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -8% vs mês anterior
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
                <p className="text-orange-600 text-sm font-medium">Competição</p>
                <p className="text-2xl font-bold text-orange-900">82%</p>
                <p className="text-xs text-orange-700 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Alta competição
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
                <p className="text-purple-600 text-sm font-medium">Oportunidades</p>
                <p className="text-2xl font-bold text-purple-900">24</p>
                <p className="text-xs text-purple-700 flex items-center mt-1">
                  <Star className="h-3 w-3 mr-1" />
                  Palavras em alta
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência de Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Volume de Buscas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'volume' ? `${value} buscas` : `R$ ${value}`,
                    name === 'volume' ? 'Volume' : 'CPC'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Buscas */}
      <Card>
        <CardHeader>
          <CardTitle>Top Buscas do Mercado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSearches.map((search, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="px-2 py-1">
                    #{index + 1}
                  </Badge>
                  <span className="font-medium">{search.term}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-slate-600">
                    {search.volume.toLocaleString()} buscas/mês
                  </span>
                  <span className="text-slate-600">
                    R$ {search.cpc.toFixed(2)} CPC
                  </span>
                  <div className="flex items-center space-x-1">
                    {search.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketDashboard;
