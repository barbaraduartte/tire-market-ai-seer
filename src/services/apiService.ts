
interface SerpApiResponse {
  search_metadata: {
    status: string;
  };
  search_parameters: {
    q: string;
  };
  search_information: {
    total_results: number;
  };
  ads?: Array<{
    position: number;
    title: string;
    link: string;
    displayed_link: string;
    snippet: string;
  }>;
  organic_results?: Array<{
    position: number;
    title: string;
    link: string;
    snippet: string;
  }>;
  related_searches?: Array<{
    query: string;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

class ApiService {
  private serpApiKey: string;
  private geminiApiKey: string;

  constructor(serpApiKey: string, geminiApiKey: string) {
    this.serpApiKey = serpApiKey;
    this.geminiApiKey = geminiApiKey;
  }

  async searchSerpApi(query: string): Promise<SerpApiResponse> {
    console.log('Buscando dados no SerpAPI para:', query);
    
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${this.serpApiKey}&location=Brazil&hl=pt&gl=br`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`SerpAPI Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos do SerpAPI:', data);
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados do SerpAPI:', error);
      throw error;
    }
  }

  async analyzeWithGemini(prompt: string): Promise<string> {
    console.log('Analisando com Gemini AI:', prompt.substring(0, 100) + '...');
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      console.log('Resposta do Gemini AI recebida');
      
      return data.candidates[0]?.content?.parts[0]?.text || 'Análise não disponível';
    } catch (error) {
      console.error('Erro ao analisar com Gemini:', error);
      throw error;
    }
  }

  async getMarketAnalysis(): Promise<any> {
    console.log('Iniciando análise completa do mercado de pneus...');
    
    const tireKeywords = [
      'pneu aro 13',
      'pneu aro 14', 
      'pneu aro 15',
      'pneu continental',
      'pneu pirelli',
      'pneu remold',
      'pneu barato'
    ];

    const results = [];
    
    // Buscar dados para cada palavra-chave
    for (const keyword of tireKeywords) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
        const serpData = await this.searchSerpApi(keyword);
        
        results.push({
          keyword,
          totalResults: serpData.search_information?.total_results || 0,
          adsCount: serpData.ads?.length || 0,
          organicCount: serpData.organic_results?.length || 0,
          relatedSearches: serpData.related_searches?.slice(0, 3) || [],
          topAds: serpData.ads?.slice(0, 3) || [],
          topOrganic: serpData.organic_results?.slice(0, 3) || []
        });
        
        console.log(`Dados coletados para: ${keyword}`);
      } catch (error) {
        console.error(`Erro ao buscar dados para ${keyword}:`, error);
        results.push({
          keyword,
          error: error.message,
          totalResults: 0,
          adsCount: 0,
          organicCount: 0,
          relatedSearches: [],
          topAds: [],
          topOrganic: []
        });
      }
    }

    // Análise com Gemini
    const prompt = `
    Analise os seguintes dados do mercado de pneus no Brasil e forneça insights estratégicos:

    ${results.map(r => `
    Palavra-chave: ${r.keyword}
    Total de resultados: ${r.totalResults}
    Número de anúncios: ${r.adsCount}
    Buscas relacionadas: ${r.relatedSearches.map(s => s.query).join(', ')}
    `).join('\n')}

    Por favor, forneça:
    1. Análise da competição no mercado
    2. Palavras-chave com maior oportunidade
    3. Tendências observadas
    4. Recomendações estratégicas
    5. Estimativa de volume de mercado

    Responda em português, de forma objetiva e profissional.
    `;

    try {
      const geminiAnalysis = await this.analyzeWithGemini(prompt);
      
      return {
        keywordData: results,
        aiAnalysis: geminiAnalysis,
        timestamp: new Date(),
        summary: {
          totalKeywords: results.length,
          avgCompetition: results.reduce((acc, r) => acc + r.adsCount, 0) / results.length,
          topKeywords: results
            .sort((a, b) => b.totalResults - a.totalResults)
            .slice(0, 5)
            .map(r => ({ keyword: r.keyword, volume: r.totalResults }))
        }
      };
    } catch (error) {
      console.error('Erro na análise com Gemini:', error);
      return {
        keywordData: results,
        aiAnalysis: 'Análise de IA não disponível no momento.',
        timestamp: new Date(),
        summary: {
          totalKeywords: results.length,
          avgCompetition: results.reduce((acc, r) => acc + r.adsCount, 0) / results.length,
          topKeywords: results
            .sort((a, b) => b.totalResults - a.totalResults)
            .slice(0, 5)
            .map(r => ({ keyword: r.keyword, volume: r.totalResults }))
        }
      };
    }
  }
}

export default ApiService;
