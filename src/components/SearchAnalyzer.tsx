
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Brain, 
  TrendingUp, 
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface SearchAnalyzerProps {
  apiKeys: { serpapi: string; gemini: string };
}

const SearchAnalyzer: React.FC<SearchAnalyzerProps> = ({ apiKeys }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();

  const analyzeSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsAnalyzing(true);
    console.log('Analisando termo:', searchTerm);

    try {
      // Simular análise com SerpAPI e Gemini
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Dados simulados baseados no termo de busca
      const mockAnalysis = {
        term: searchTerm,
        volume: Math.floor(Math.random() * 50000) + 1000,
        competition: Math.random(),
        cpc: (Math.random() * 5 + 0.5).toFixed(2),
        trend: Math.random() > 0.5 ? 'crescente' : 'estável',
        serpResults: [
          {
            title: 'Pneu Continental Aro 13 - Promoção',
            url: 'continental.com.br',
            position: 1,
            snippet: 'Os melhores pneus Continental com desconto especial...'
          },
          {
            title: 'Pneus Pirelli - Loja Oficial',
            url: 'pirelli.com.br',
            position: 2,
            snippet: 'Linha completa de pneus Pirelli para seu veículo...'
          },
          {
            title: 'Pneus Michelin - Qualidade e Durabilidade',
            url: 'michelin.com.br',
            position: 3,
            snippet: 'Tecnologia francesa em pneus de alta performance...'
          }
        ],
        aiInsights: {
          summary: `O termo "${searchTerm}" apresenta um volume de busca moderado com competição ${Math.random() > 0.5 ? 'alta' : 'média'}. É uma oportunidade interessante para explorar no mercado de pneus.`,
          opportunities: [
            'Explore palavras-chave relacionadas de cauda longa',
            'Considere anúncios segmentados por localização',
            'Analise o conteúdo dos concorrentes no top 3',
            'Monitore variações sazonais do termo'
          ],
          risks: [
            'Alta competição pode elevar custos de CPC',
            'Necessário conteúdo de qualidade para ranquear',
            'Volatilidade do mercado pode afetar performance'
          ]
        }
      };

      setAnalysisResult(mockAnalysis);

      toast({
        title: "Análise concluída",
        description: `Análise do termo "${searchTerm}" finalizada com sucesso!`,
      });

    } catch (error) {
      console.error('Erro na análise:', error);
      toast({
        title: "Erro na análise",
        description: "Não foi possível completar a análise. Verifique suas chaves de API.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCompetitionColor = (competition: number) => {
    if (competition < 0.3) return 'text-green-600 bg-green-50';
    if (competition < 0.7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getCompetitionLabel = (competition: number) => {
    if (competition < 0.3) return 'Baixa';
    if (competition < 0.7) return 'Média';
    return 'Alta';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Análise de Termos de Busca</h2>
        <p className="text-slate-600">
          Analise termos específicos para descobrir oportunidades no mercado de pneus
        </p>
      </div>

      {/* Barra de busca */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Digite um termo para analisar (ex: pneu aro 13, continental, remold)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && analyzeSearch()}
                className="text-lg h-12"
              />
            </div>
            <Button 
              onClick={analyzeSearch}
              disabled={!searchTerm.trim() || isAnalyzing}
              className="px-8 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analisar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados da análise */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Métricas principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600">Volume Mensal</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {analysisResult.volume.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">buscas/mês</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600">CPC Estimado</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {analysisResult.cpc}
                  </p>
                  <p className="text-xs text-slate-500">por clique</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600">Competição</p>
                  <Badge className={getCompetitionColor(analysisResult.competition)}>
                    {getCompetitionLabel(analysisResult.competition)}
                  </Badge>
                  <p className="text-xs text-slate-500 mt-1">
                    {(analysisResult.competition * 100).toFixed(0)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600">Tendência</p>
                  <div className="flex items-center justify-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600 capitalize">
                      {analysisResult.trend}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights da IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>Insights da IA Gemini</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-purple-900">{analysisResult.aiInsights.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4" />
                    <span>Oportunidades</span>
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.aiInsights.opportunities.map((opportunity: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Riscos</span>
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.aiInsights.risks.map((risk: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultados do Google */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Top Resultados do Google</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResult.serpResults.map((result: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="px-2 py-1">
                          #{result.position}
                        </Badge>
                        <h4 className="font-medium text-blue-600">{result.title}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-green-600 mb-2">{result.url}</p>
                    <p className="text-sm text-slate-600">{result.snippet}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SearchAnalyzer;
