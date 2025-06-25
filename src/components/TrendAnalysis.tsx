
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target,
  Brain,
  Loader2,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import ApiService from '@/services/apiService';

interface TrendAnalysisProps {
  apiKeys: { serpapi: string; gemini: string };
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ apiKeys }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [trendData, setTrendData] = useState<any>(null);
  const { toast } = useToast();

  const analyzeTrends = async () => {
    setIsAnalyzing(true);
    
    try {
      const apiService = new ApiService(apiKeys.serpapi, apiKeys.gemini);
      const results = await apiService.analyzeMarketBehavior();
      
      // Simular dados de tendência temporal
      const timelineData = results.insights.map((insight: any, index: number) => ({
        mes: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'][index % 6],
        volume: Math.floor(insight.totalResults / 1000),
        crescimento: Math.random() > 0.5 ? Math.floor(Math.random() * 30) : -Math.floor(Math.random() * 15),
        categoria: insight.keyword
      }));

      setTrendData({
        ...results,
        timeline: timelineData
      });
      
      toast({
        title: "Análise de tendências concluída!",
        description: "Dados de comportamento temporal do mercado carregados.",
      });
      
    } catch (error: any) {
      console.error('Erro na análise de tendências:', error);
      toast({
        title: "Erro na análise",
        description: "Não foi possível carregar as tendências do mercado.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Crescendo':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'Declinando':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Crescendo': return 'bg-green-100 text-green-800';
      case 'Declinando': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Análise de Tendências</h2>
        <p className="text-slate-600">
          Monitore o comportamento temporal do mercado e identifique tendências emergentes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Gerar Análise de Tendências</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={analyzeTrends}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analisando tendências do mercado...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Iniciar Análise de Tendências
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {trendData && (
        <div className="space-y-6">
          {/* Resumo das tendências */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-600">Categorias em Alta</p>
                <p className="text-2xl font-bold text-green-600">
                  {trendData.summary.emergingTrends.length}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-600">Oportunidades</p>
                <p className="text-2xl font-bold text-blue-600">
                  {trendData.summary.highOpportunity}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-600">Competição Média</p>
                <p className="text-2xl font-bold text-purple-600">
                  {trendData.summary.avgCompetition.toFixed(1)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de tendências */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Volume de Buscas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={trendData.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`${value}k buscas`, 'Volume']} />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Lista de tendências por categoria */}
          <Card>
            <CardHeader>
              <CardTitle>Tendências por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendData.insights.map((insight: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{insight.keyword}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTrendColor(insight.trend)}>
                          {getTrendIcon(insight.trend)}
                          <span className="ml-1">{insight.trend}</span>
                        </Badge>
                        <Badge variant="outline" className={
                          insight.opportunity === 'Alta' ? 'border-green-500 text-green-700' :
                          insight.opportunity === 'Média' ? 'border-yellow-500 text-yellow-700' :
                          'border-red-500 text-red-700'
                        }>
                          {insight.opportunity} Oportunidade
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Volume Total</p>
                        <p className="font-medium">{insight.totalResults.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Competição</p>
                        <p className="font-medium">{insight.competitionLevel}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Anúncios</p>
                        <p className="font-medium">{insight.adsCount}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Orgânicos</p>
                        <p className="font-medium">{insight.organicCount}</p>
                      </div>
                    </div>

                    {insight.relatedSearches.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-slate-700 mb-1">Buscas relacionadas em alta:</p>
                        <div className="flex flex-wrap gap-1">
                          {insight.relatedSearches.slice(0, 4).map((related: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {related.query}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Análise da IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>Insights de Tendências (Gemini AI)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-purple-50 rounded-lg">
                <pre className="whitespace-pre-wrap text-purple-900 text-sm">
                  {trendData.aiAnalysis}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TrendAnalysis;
