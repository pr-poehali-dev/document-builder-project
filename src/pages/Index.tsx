import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

const organizations = [
  { name: 'АО "Мессояханефтегаз"', phone: '+7 (3452) 52-21-90' },
  { name: 'АО Связьтранснефть, Западно-Сибирское ПТ', phone: '+7 (3452) 49-32-01' },
  { name: 'ГАУ ДО ТО "Рио-центр"', phone: '+7 (3452) 565-390' },
  { name: 'Лукойл Информ', phone: '+7 (800) 100-09-11' },
  { name: 'НИК «Инновации ТЭК»', phone: '+7 (3452) 49-51-75' },
  { name: 'НОВАТЭК НТЦ', phone: '+7 345 268-03-00' },
  { name: 'ООО "ДЕВИЖН"', phone: '+7 345 256-52-43' },
  { name: 'ООО "Сибгеопроект"', phone: '+7 (3452) 68-84-47' },
  { name: 'ООО "Тюмень-Софт"', phone: '+7 (3452) 68-09-60' },
  { name: 'ООО "Харампурнефтегаз"', phone: '+7 (34936) 4-80-00' },
  { name: 'ООО «Газпром добыча Ноябрьск»', phone: '+7 (3496) 36-86-07' },
  { name: 'ООО ЛУКОЙЛ-Западная Сибирь', phone: '+7 (34667) 6-14-94' },
  { name: 'ПАО "Славнефть-Мегионнефтегаз"', phone: '+7 (346) 434-61-35' },
  { name: 'Сургутнефтегаз', phone: '+7 (3462) 42-70-09' },
  { name: 'ФАУ "ЗапсибНИИГГ"', phone: '+7 (3452) 46-16-15' },
  { name: 'ООО "ЛУКОЙЛ-Инжиниринг" "КогалымНИПИнефть"', phone: '+7 (3452) 54-51-33' },
];

const practiceTypes = [
  'Учебная практика',
  'Производственная практика',
  'Преддипломная практика',
  'Научно-исследовательская работа',
];

const practiceSubtypes = [
  'Ознакомительная практика',
  'Технологическая (проектно-технологическая) практика',
  'Преддипломная практика',
  'Научно-исследовательская работа',
];

interface FormData {
  studentName: string;
  studentGroup: string;
  organization: string;
  organizationPhone: string;
  practiceType: string;
  practiceSubtype: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  supervisor: string;
  position: string;
}

const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    studentGroup: '',
    organization: '',
    organizationPhone: '',
    practiceType: '',
    practiceSubtype: '',
    startDate: undefined,
    endDate: undefined,
    supervisor: '',
    position: '',
  });

  useEffect(() => {
    const savedData = localStorage.getItem('practiceReportData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData({
        ...parsed,
        startDate: parsed.startDate ? new Date(parsed.startDate) : undefined,
        endDate: parsed.endDate ? new Date(parsed.endDate) : undefined,
      });
    }
  }, []);

  const handleInputChange = (field: keyof FormData, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    localStorage.setItem('practiceReportData', JSON.stringify({
      ...newData,
      startDate: newData.startDate?.toISOString(),
      endDate: newData.endDate?.toISOString(),
    }));
  };

  const handleOrganizationChange = (orgName: string) => {
    const org = organizations.find(o => o.name === orgName);
    handleInputChange('organization', orgName);
    if (org) {
      handleInputChange('organizationPhone', org.phone);
    }
  };

  const generateWordDocument = async () => {
    if (!formData.studentName || !formData.organization || !formData.startDate || !formData.endDate) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'ОТЧЁТ',
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'руководителя производственной практики от организации',
                size: 28,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Студент: ${formData.studentName}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Группа: ${formData.studentGroup}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Организация: ${formData.organization}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Телефон: ${formData.organizationPhone}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Вид практики: ${formData.practiceType}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Тип практики: ${formData.practiceSubtype}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Период: с ${format(formData.startDate, 'dd.MM.yyyy', { locale: ru })} по ${format(formData.endDate, 'dd.MM.yyyy', { locale: ru })}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Руководитель практики: ${formData.supervisor}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Должность: ${formData.position}`,
                size: 24,
              }),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Отчет_${formData.studentName}_${format(new Date(), 'dd-MM-yyyy')}.docx`);
    toast.success('Документ успешно создан!');
  };

  const clearForm = () => {
    setFormData({
      studentName: '',
      studentGroup: '',
      organization: '',
      organizationPhone: '',
      practiceType: '',
      practiceSubtype: '',
      startDate: undefined,
      endDate: undefined,
      supervisor: '',
      position: '',
    });
    localStorage.removeItem('practiceReportData');
    toast.success('Форма очищена');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-secondary text-secondary-foreground">
            <div className="flex items-center gap-3">
              <Icon name="FileText" size={32} className="text-primary" />
              <div>
                <CardTitle className="text-3xl font-bold">Конструктор отчётов</CardTitle>
                <CardDescription className="text-secondary-foreground/80 mt-1">
                  Автоматизированная система формирования отчётов по производственной практике
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="studentName" className="text-base font-medium">
                  ФИО студента <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="studentName"
                  placeholder="Иванов Иван Иванович"
                  value={formData.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentGroup" className="text-base font-medium">
                  Группа
                </Label>
                <Input
                  id="studentGroup"
                  placeholder="ИВТ-21"
                  value={formData.studentGroup}
                  onChange={(e) => handleInputChange('studentGroup', e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization" className="text-base font-medium">
                Организация <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.organization} onValueChange={handleOrganizationChange}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Выберите организацию" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.name} value={org.name}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationPhone" className="text-base font-medium">
                Телефон организации
              </Label>
              <Input
                id="organizationPhone"
                value={formData.organizationPhone}
                onChange={(e) => handleInputChange('organizationPhone', e.target.value)}
                className="h-11"
                disabled
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="practiceType" className="text-base font-medium">
                  Вид практики <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.practiceType} onValueChange={(value) => handleInputChange('practiceType', value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Выберите вид" />
                  </SelectTrigger>
                  <SelectContent>
                    {practiceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="practiceSubtype" className="text-base font-medium">
                  Тип практики <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.practiceSubtype} onValueChange={(value) => handleInputChange('practiceSubtype', value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    {practiceSubtypes.map((subtype) => (
                      <SelectItem key={subtype} value={subtype}>
                        {subtype}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Дата начала <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-11 justify-start text-left font-normal"
                    >
                      <Icon name="Calendar" className="mr-2" size={16} />
                      {formData.startDate ? format(formData.startDate, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleInputChange('startDate', date)}
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Дата окончания <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-11 justify-start text-left font-normal"
                    >
                      <Icon name="Calendar" className="mr-2" size={16} />
                      {formData.endDate ? format(formData.endDate, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleInputChange('endDate', date)}
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="supervisor" className="text-base font-medium">
                  Руководитель практики
                </Label>
                <Input
                  id="supervisor"
                  placeholder="Петров П.П."
                  value={formData.supervisor}
                  onChange={(e) => handleInputChange('supervisor', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-base font-medium">
                  Должность
                </Label>
                <Input
                  id="position"
                  placeholder="Главный специалист"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Button
                onClick={generateWordDocument}
                className="flex-1 h-12 text-base font-medium"
                size="lg"
              >
                <Icon name="Download" className="mr-2" size={20} />
                Скачать Word документ
              </Button>
              <Button
                onClick={clearForm}
                variant="outline"
                className="h-12 px-8"
                size="lg"
              >
                <Icon name="RotateCcw" className="mr-2" size={20} />
                Очистить
              </Button>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-muted">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ваши данные автоматически сохраняются в браузере и будут доступны при следующем посещении.
                Поля, отмеченные звёздочкой (<span className="text-destructive">*</span>), обязательны для заполнения.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
