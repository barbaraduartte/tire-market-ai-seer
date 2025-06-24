
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  Target,
  Brain,
  Mail,
  Clock
} from 'lucide-react';

interface ReportsSectionProps {
  apiKeys: { serpapi: string; gemini: string };
}

const ReportsSection: React.FC<ReportsSectionProps> = ({ apiKeys }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const reportTemplates = [
    {
      id: 'weekly',
      title: 'Relatório Semanal',
      description: 'Análise semanal das tendências e oportunidades',
      icon: Calendar,
      color: 'blue',
      estimated: '2-3 min'
    },
    {
      id: 'competitor',
      title: 'Análise de Concorrentes',
      description: 'Comparação detalhada com principais concorrentes',
      icon: Target,
      color: 'green',
      estimated: '5-7 min'
    },
    {
      id: 'keyword',
      title: 'Oportunidades de Keywords',
      description: 'Lista de palavras-chave com potencial',
      icon: TrendingUp,
      color: 'purple',
      estimated: '3-4 min'
    },
    {
      id: 'ai-insights',
      title: 'Insights de IA',
      description: 'Análise profunda com recomendações personalizadas',
      icon: Brain,
      color: 'orange',
      estimated: '4-6 min'
    }
  ];

  const recentReports = [
    {
      id: 1,
      title: 'Relatório Semanal - Pneus Aro 13',
      date: '2024-06-20',
      type: 'weekly',
      status: 'completed',
      insights: 23,
      opportunities: 8
    },
    {
      id: 2,
      title: 'Análise de Concorrentes - Mercado Premium',
      date: '2024-06-18',
      type: 'competitor',
      status: 'completed',
      insights: 15,
      opportunities: 12
    },
    {
      id: 3,
      title: 'Oportunidades de Keywords - Pneus Econômicos',
      date: '2024-06-15',
      type: 'keyword',
      status: 'completed',
      insights: 31,
      opportunities: 18
    }
  ];

  const generateReport = async (templateId: string) => {
    setIsGenerating(true);
    console.log('Gerando relatório:', templateId);

    try {
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 3000));

      toast({
        title: "Relatório gerado",
        description: "Seu relatório foi criado com sucesso e está disponível para download.",
      });

    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Relatórios e Análises</h2>
        <p className="text-slate-600">
          Gere relatórios detalhados com insights automatizados do mercado de pneus
        </p>
      </div>

      {/* Templates de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTemplates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className={`border-2 ${getColorClasses(template.color)} hover:shadow-lg transition-all duration-200`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(template.color)}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {template.estimated}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{template.description}</p>
                <Button 
                  onClick={() => generateReport(template.id)}
                  disabled={isGenerating}
                  className="w-full"
                  variant="outline"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Relatórios Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-slate-600" />
            <span>Relatórios Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-slate-800">{report.title}</h4>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status === 'completed' ? 'Concluído' : 'Em andamento'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span>{new Date(report.date).toLocaleDateString('pt-BR')}</span>
                    <span>•</span>
                    <span>{report.insights} insights</span>
                    <span>•</span>
                    <span>{report.opportunities} oportunidades</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-1" />
                    Enviar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-slate-800">Relatórios Automáticos</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm">Relatório semanal automático</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Alertas de oportunidades</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Análise mensal de concorrentes</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-slate-800">Notificações</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm">Email quando relatório estiver pronto</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Alertas de mudanças significativas</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Resumo semanal por email</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsSection;
