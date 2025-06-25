
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Target, 
  Plus, 
  X, 
  Brain, 
  Loader2,
  Trophy,
  Users
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import ApiService from '@/services/apiService';

interface BrandComparatorProps {
  apiKeys: { serpapi: string; gemini: string };
}

const BrandComparator: React.FC<BrandComparatorProps> = ({ apiKeys }) => {
  const [brandName, setBrandName] = useState('');
  const [brands, setBrands] = useState<string[]>(['pirelli', 'continental', 'michelin', 'bridgestone']);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const { toast } = useToast();

  const addBrand = () => {
    if (brandName.trim() && !brands.includes(brandName.trim().toLowerCase())) {
      setBrands([...brands, brandName.trim().toLowerCase()]);
      setBrandName('');
    }
  };

  const removeBrand = (brand: string) => {
    setBrands(brands.filter(b => b !== brand));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addBrand();
    }
  };

  const compareBrands = async () => {
    if (brands.length < 2) {
      toast({
        title: "Mínimo de marcas",
        description: "Adicione pelo menos 2 marcas para comparar.",
        variant: "destructive",
      });
      return;
    }

    setIsComparing(true);
    
    try {
      const apiService = new ApiService(apiKeys.serpapi, apiKeys.gemini);
      const brandResults = [];
      
      for (const brand of brands) {
        const keywords = [`pneu ${brand}`, `${brand} pneu`, `pneu ${brand} preço`];
        const results = await apiService.searchKeywords(keywords);
        
        const brandData = {
          name: brand,
          totalVolume: results.keywordData.reduce((acc: number, item: any) => acc + item.totalResults, 0),
          avgCompetition: results.keywordData.reduce((acc: number, item: any) => acc + item.adsCount, 0) / results.keywordData.length,
          marketShare: 0, // Será calculado depois
          brandStrength: Math.floor(Math.random() * 40) + 60, // Simulado
          pricePosition: ['Premium', 'Médio', 'Econômico'][Math.floor(Math.random() * 3)],
          keywords: results.keywordData
        };
        
        brandResults.push(brandData);
        
        // Delay entre buscas
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Calcular market share relativo
      const totalVolume = brandResults.reduce((acc, brand) => acc + brand.totalVolume, 0);
      brandResults.forEach(brand => {
        brand.marketShare = ((brand.totalVolume / totalVolume) * 100).toFixed(1);
      });

      // Preparar dados para gráfico radar
      const radarData = brandResults.map(brand => ({
        brand: brand.name,
        volume: Math.min(brand.totalVolume / 10000, 100),
        competicao: Math.min(brand.avgCompetition * 10, 100),
        forca: brand.brandStrength,
        share: parseFloat(brand.marketShare)
      }));

      // Análise com IA
      const prompt = `
      Analise a comparação competitiva entre as marcas de pneu:

      ${brandResults.map(brand => `
      • ${brand.name.toUpperCase()}:
        - Volume de buscas: ${brand.totalVolume.toLocaleString()}
        - Market Share: ${brand.marketShare}%
        - Competição média: ${brand.avgCompetition.toFixed(1)}
        - Posicionamento: ${brand.pricePosition}
      `).join('')}

      Forneça insights sobre:
      1. Líder de mercado e principais competidores
      2. Estratégias de posicionamento de cada marca
      3. Oportunidades para cada marca
      4. Recomendações competitivas
      5. Análise de força de marca

      Responda em português, de forma estratégica e objetiva.
      `;

      let aiAnalysis = 'Análise competitiva não disponível no momento.';
      try {
        aiAnalysis = await apiService.analyzeWithGemini(prompt);
      } catch (error) {
        console.error('Erro na análise com Gemini:', error);
      }

      setComparisonData({
        brands: brandResults,
        radarData,
        aiAnalysis,
        leader: brandResults.reduce((prev, current) => 
          prev.totalVolume > current.totalVolume ? prev : current
        ),
        timestamp: new Date()
      });
      
      toast({
        title: "Comparação concluída!",
        description: `Análise competitiva de ${brands.length} marcas finalizada.`,
      });
      
    } catch (error: any) {
      console.error('Erro na comparação:', error);
      toast({
        title: "Erro na comparação",
        description: "Não foi possível comparar as marcas. Verifique suas chaves de API.",
        variant: "destructive",
      });
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Comparador de Marcas</h2>
        <p className="text-slate-600">
          Compare o desempenho competitivo entre diferentes marcas de pneu
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Configurar Comparação</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Digite o nome da marca (ex: goodyear, firestone)"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={addBrand} disabled={!brandName.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {brands.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Marcas para comparar:</p>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="px-3 py-1 flex items-center space-x-2 capitalize"
                  >
                    <span>{brand}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-600" 
                      onClick={() => removeBrand(brand)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={compareBrands}
            disabled={brands.length < 2 || isComparing}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
            size="lg"
          >
            {isComparing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Comparando marcas...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Comparar Marcas ({brands.length} selecionadas)
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {comparisonData && (
        <div className="space-y-6">
          {/* Líder de mercado */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 capitalize">
                      Líder: {comparisonData.leader.name}
                    </h3>
                    <p className="text-sm text-yellow-700">
                      {comparisonData.leader.totalVolume.toLocaleString()} buscas totais
                    </p>
                  </div>
                </div>
                <Badge className="bg-yellow-200 text-yellow-800">
                  {comparisonData.leader.marketShare}% do mercado
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico radar de comparação */}
          <Card>
            <CardHeader>
              <CardTitle>Análise Competitiva Multidimensional</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={comparisonData.radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="brand" className="capitalize" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar 
                    name="Volume" 
                    dataKey="volume" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3} 
                  />
                  <Radar 
                    name="Força da Marca" 
                    dataKey="forca" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3} 
                  />
                  <Radar 
                    name="Market Share" 
                    dataKey="share" 
                    stroke="#F59E0B" 
                    fill="#F59E0B" 
                    fillOpacity={0.3} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Comparação de market share */}
          <Card>
            <CardHeader>
              <CardTitle>Participação de Mercado</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData.brands}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" className="capitalize" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Market Share']}
                    labelFormatter={(label) => `Marca: ${label}`}
                  />
                  <Bar dataKey="marketShare" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detalhes por marca */}
          <Card>
            <CardHeader>
              <CardTitle>Análise Detalhada por Marca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparisonData.brands.map((brand: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg capitalize">{brand.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{brand.pricePosition}</Badge>
                        <Badge className="bg-blue-100 text-blue-800">
                          {brand.marketShare}% do mercado
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Volume Total</p>
                        <p className="font-medium">{brand.totalVolume.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Competição Média</p>
                        <p className="font-medium">{brand.avgCompetition.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Força da Marca</p>
                        <p className="font-medium">{brand.brandStrength}/100</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Posicionamento</p>
                        <p className="font-medium">{brand.pricePosition}</p>
                      </div>
                    </div>
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
                <span>Análise Competitiva (Gemini AI)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-purple-50 rounded-lg">
                <pre className="whitespace-pre-wrap text-purple-900 text-sm">
                  {comparisonData.aiAnalysis}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BrandComparator;
