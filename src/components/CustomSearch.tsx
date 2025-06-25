
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  X, 
  Brain, 
  TrendingUp, 
  Target,
  Loader2,
  Lightbulb
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import ApiService from '@/services/apiService';

interface CustomSearchProps {
  apiKeys: { serpapi: string; gemini: string };
}

const CustomSearch: React.FC<CustomSearchProps> = ({ apiKeys }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const { toast } = useToast();

  const addKeyword = () => {
    if (searchTerm.trim() && !keywords.includes(searchTerm.trim())) {
      setKeywords([...keywords, searchTerm.trim()]);
      setSearchTerm('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addKeyword();
    }
  };

  const performSearch = async () => {
    if (keywords.length === 0) {
      toast({
        title: "Nenhuma palavra-chave",
        description: "Adicione pelo menos uma palavra-chave para buscar.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    console.log('Iniciando busca personalizada para:', keywords);
    
    try {
      const apiService = new ApiService(apiKeys.serpapi, apiKeys.gemini);
      const results = await apiService.searchKeywords(keywords);
      
      // Processar dados para visualização
      const processedResults = {
        ...results,
        chartData: results.keywordData.map((item: any, index: number) => ({
          name: item.keyword,
          volume: Math.floor(item.totalResults / 1000),
          competition: item.adsCount,
          color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'][index % 7]
        }))
      };
      
      setSearchResults(processedResults);
      
      toast({
        title: "Busca concluída!",
        description: `Análise de ${keywords.length} palavras-chave finalizada com dados reais.`,
      });
      
    } catch (error: any) {
      console.error('Erro na busca:', error);
      toast({
        title: "Erro na busca",
        description: error.message || "Não foi possível realizar a busca. Verifique suas chaves de API.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Busca Personalizada do Mercado</h2>
        <p className="text-slate-600">
          Adicione suas próprias palavras-chave para obter análises específicas do mercado
        </p>
      </div>

      {/* Interface de busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-blue-600" />
            <span>Configure sua Busca</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Digite uma palavra-chave (ex: pneu michelin, remold aro 14)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={addKeyword} disabled={!searchTerm.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Lista de palavras-chave */}
          {keywords.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Palavras-chave adicionadas:</p>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="px-3 py-1 flex items-center space-x-2"
                  >
                    <span>{keyword}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-600" 
                      onClick={() => removeKeyword(keyword)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={performSearch}
            disabled={keywords.length === 0 || isSearching}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
            size="lg"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Buscando dados reais...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Buscar Dados do Mercado ({keywords.length} palavras)
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultados */}
      {searchResults && (
        <div className="space-y-6">
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-600">Total de Buscas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {searchResults.summary.topKeywords.reduce((acc: number, k: any) => acc + k.volume, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-600">Competição Média</p>
                <p className="text-2xl font-bold text-green-600">
                  {searchResults.summary.avgCompetition.toFixed(1)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-600">Palavras Analisadas</p>
                <p className="text-2xl font-bold text-purple-600">
                  {searchResults.summary.totalKeywords}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de volume */}
          <Card>
            <CardHeader>
              <CardTitle>Volume de Buscas por Palavra-chave</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={searchResults.chartData}>
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
                    formatter={(value: any) => [`${(value * 1000).toLocaleString()} buscas`, 'Volume']}
                  />
                  <Bar dataKey="volume" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Análise da IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>Análise Personalizada (Gemini AI)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-purple-50 rounded-lg">
                <pre className="whitespace-pre-wrap text-purple-900 text-sm">
                  {searchResults.aiAnalysis}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes por palavra-chave */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes por Palavra-chave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.keywordData.map((item: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{item.keyword}</h4>
                      <Badge variant="outline">
                        {item.totalResults.toLocaleString()} resultados
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Anúncios</p>
                        <p className="font-medium">{item.adsCount}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Resultados Orgânicos</p>
                        <p className="font-medium">{item.organicCount}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Buscas Relacionadas</p>
                        <p className="font-medium">{item.relatedSearches.length}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Status</p>
                        <p className="font-medium text-green-600">
                          {item.error ? 'Erro' : 'Sucesso'}
                        </p>
                      </div>
                    </div>

                    {item.relatedSearches.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Buscas relacionadas:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.relatedSearches.map((related: any, idx: number) => (
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
        </div>
      )}
    </div>
  );
};

export default CustomSearch;
