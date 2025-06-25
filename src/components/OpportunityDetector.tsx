
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Lightbulb, 
  Target, 
  TrendingUp, 
  DollarSign,
  Brain,
  Loader2,
  Zap,
  Star
} from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ApiService from '@/services/apiService';

interface OpportunityDetectorProps {
  apiKeys: { serpapi: string; gemini: string };
}

const OpportunityDetector: React.FC<OpportunityDetectorProps> = ({ apiKeys }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [opportunities, setOpportunities] = useState<any>(null);
  const { toast } = useToast();

  const detectOpportunities = async () => {
    setIsDetecting(true);
    
    try {
      const apiService = new ApiService(apiKeys.serpapi, apiKeys.gemini);
      
      // Analisar nichos específicos
      const nicheKeywords = [
        'pneu run flat', 'pneu ecológico', 'pneu silencioso',
        'pneu off road', 'pneu winter', 'pneu performance',
        'pneu caminhonete', 'pneu moto trail', 'pneu agrícola',
        'pneu reciclado', 'pneu inteligente', 'pneu conectado'
      ];

      const results = await apiService.searchKeywords(nicheKeywords);
      
      // Processar oportunidades
      const processedOpportunities = results.keywordData.map((item: any) => {
        const ratio = item.totalResults / (item.adsCount || 1);
        return {
          keyword: item.keyword,
          volume: item.totalResults,
          competition: item.adsCount,
          opportunity: item.opportunity,
          ratio: ratio,
          category: classifyCategory(item.keyword),
          potentialROI: calculatePotentialROI(ratio, item.totalResults),
          difficulty: item.competitionLevel,
          x: item.totalResults / 1000, // Volume para eixo X
          y: ratio / 1000 // Ratio para eixo Y
        };
      });

      // Identificar top oportunidades
      const topOpportunities = processedOpportunities
        .filter(opp => opp.opportunity === 'Alta' || opp.ratio > 20000)
        .sort((a, b) => b.potentialROI - a.potentialROI)
        .slice(0, 5);

      // Análise com IA focada em oportunidades
      const prompt = `
      Analise as seguintes oportunidades de mercado no setor de pneus:

      TOP OPORTUNIDADES IDENTIFICADAS:
      ${topOpportunities.map(opp => `
      • ${opp.keyword}:
        - Volume: ${opp.volume.toLocaleString()} buscas
        - Competição: ${opp.competition} anúncios
        - Categoria: ${opp.category}
        - ROI Potencial: ${opp.potentialROI}%
        - Dificuldade: ${opp.difficulty}
      `).join('')}

      NICHOS ANALISADOS:
      ${processedOpportunities.map(opp => `
      • ${opp.keyword}: ${opp.volume.toLocaleString()} buscas, ${opp.competition} anúncios
      `).join('')}

      Forneça insights estratégicos sobre:
      1. Oportunidades com maior potencial de ROI
      2. Nichos emergentes e tendências futuras
      3. Estratégias de entrada para cada oportunidade
      4. Investimento recomendado por nicho
      5. Cronograma de implementação sugerido

      Seja específico e prático nas recomendações.
      `;

      let aiAnalysis = 'Análise de oportunidades não disponível no momento.';
      try {
        aiAnalysis = await apiService.analyzeWithGemini(prompt);
      } catch (error) {
        console.error('Erro na análise com Gemini:', error);
      }

      setOpportunities({
        all: processedOpportunities,
        top: topOpportunities,
        aiAnalysis,
        summary: {
          totalNiches: processedOpportunities.length,
          highOpportunity: processedOpportunities.filter(opp => opp.opportunity === 'Alta').length,
          avgROI: processedOpportunities.reduce((acc, opp) => acc + opp.potentialROI, 0) / processedOpportunities.length,
          bestCategory: getCategoryWithMostOpportunities(processedOpportunities)
        },
        timestamp: new Date()
      });
      
      toast({
        title: "Detecção concluída!",
        description: `${topOpportunities.length} oportunidades de alto potencial identificadas.`,
      });
      
    } catch (error: any) {
      console.error('Erro na detecção:', error);
      toast({
        title: "Erro na detecção",
        description: "Não foi possível detectar oportunidades. Verifique suas chaves de API.",
        variant: "destructive",
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const classifyCategory = (keyword: string): string => {
    if (keyword.includes('ecológico') || keyword.includes('reciclado')) return 'Sustentabilidade';
    if (keyword.includes('performance') || keyword.includes('run flat')) return 'Performance';
    if (keyword.includes('off road') || keyword.includes('trail')) return 'Aventura';
    if (keyword.includes('silencioso') || keyword.includes('winter')) return 'Conforto';
    if (keyword.includes('inteligente') || keyword.includes('conectado')) return 'Tecnologia';
    if (keyword.includes('caminhonete') || keyword.includes('agrícola')) return 'Utilitário';
    return 'Nicho Especial';
  };

  const calculatePotentialROI = (ratio: number, volume: number): number => {
    const baseROI = Math.min(ratio / 1000, 50);
    const volumeBonus = Math.min(volume / 10000, 25);
    return Math.round(baseROI + volumeBonus);
  };

  const getCategoryWithMostOpportunities = (opportunities: any[]): string => {
    const categories = opportunities.reduce((acc, opp) => {
      acc[opp.category] = (acc[opp.category] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(categories).reduce((a: any, b: any) => 
      categories[a[0]] > categories[b[0]] ? a : b
    )[0] as string;
  };

  const getOpportunityColor = (potentialROI: number) => {
    if (potentialROI >= 40) return '#10B981'; // Verde
    if (potentialROI >= 25) return '#F59E0B'; // Amarelo
    return '#EF4444'; // Vermelho
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Detector de Oportunidades</h2>
        <p className="text-slate-600">
          Identifique nichos de mercado inexplorados e oportunidades de alto ROI
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span>Detectar Oportunidades de Mercado</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={detectOpportunities}
            disabled={isDetecting}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500"
            size="lg"
          >
            {isDetecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Escaneando oportunidades...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Iniciar Detecção de Oportunidades
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {opportunities && (
        <div className="space-y-6">
          {/* Resumo das oportunidades */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-600">Nichos Analisados</p>
                <p className="text-2xl font-bold text-blue-600">
                  {opportunities.summary.totalNiches}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-600">Oportunidades Altas</p>
                <p className="text-2xl font-bold text-green-600">
                  {opportunities.summary.highOpportunity}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-600">ROI Médio</p>
                <p className="text-2xl font-bold text-purple-600">
                  {opportunities.summary.avgROI.toFixed(0)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-600">Melhor Categoria</p>
                <p className="text-lg font-bold text-orange-600">
                  {opportunities.summary.bestCategory}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top 5 oportunidades */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Star className="h-5 w-5" />
                <span>Top 5 Oportunidades de Alto ROI</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {opportunities.top.map((opp: any, index: number) => (
                  <div key={index} className="bg-white border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">#{index + 1}</Badge>
                        <h4 className="font-semibold">{opp.keyword}</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {opp.potentialROI}% ROI
                        </Badge>
                        <Badge variant="outline">{opp.category}</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Volume</p>
                        <p className="font-medium">{opp.volume.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Competição</p>
                        <p className="font-medium">{opp.competition}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Dificuldade</p>
                        <p className="font-medium">{opp.difficulty}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Ratio V/C</p>
                        <p className="font-medium">{opp.ratio.toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de dispersão - Volume vs Competição */}
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Oportunidades (Volume vs Competição)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={opportunities.all}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="x" 
                    name="Volume" 
                    unit="k"
                    label={{ value: 'Volume de Buscas (milhares)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="y" 
                    name="Ratio" 
                    label={{ value: 'Potencial (Volume/Competição)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'x' ? `${(value * 1000).toLocaleString()} buscas` : value.toFixed(2),
                      name === 'x' ? 'Volume' : 'Potencial'
                    ]}
                    labelFormatter={(label, payload) => 
                      payload && payload[0] ? payload[0].payload.keyword : ''
                    }
                  />
                  <Scatter dataKey="y" fill="#3B82F6">
                    {opportunities.all.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={getOpportunityColor(entry.potentialROI)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <div className="flex justify-center mt-4 space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Alto ROI (40%+)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Médio ROI (25-40%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Baixo ROI (&lt;25%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Análise da IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>Estratégias de Oportunidade (Gemini AI)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-purple-50 rounded-lg">
                <pre className="whitespace-pre-wrap text-purple-900 text-sm">
                  {opportunities.aiAnalysis}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OpportunityDetector;
