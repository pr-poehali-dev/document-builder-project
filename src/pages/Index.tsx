import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, VerticalAlign } from 'docx';
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
  academicYear: string;
  studentGroup: string;
  practiceType: string;
  practiceSubtype: string;
  studentCount: string;
  duration: string;
  educationForm: string;
  practiceStartDate: Date | undefined;
  practiceEndDate: Date | undefined;
  orderNumber: string;
  orderDate: Date | undefined;
  fio: string;
  supervisor: string;
  meetingDate: Date | undefined;
  studentsPresent: string;
  studentsTotal: string;
  organization: string;
  orgCount: string;
  orgContact: string;
  qualityReview: string;
  recommendations: string;
  directorNotes: string;
  reportDate: Date | undefined;
  directorName: string;
  departmentHead: string;
}

const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    academicYear: '2024-2025',
    studentGroup: '',
    practiceType: '',
    practiceSubtype: '',
    studentCount: '',
    duration: '',
    educationForm: 'Очная',
    practiceStartDate: undefined,
    practiceEndDate: undefined,
    orderNumber: '',
    orderDate: undefined,
    fio: '',
    supervisor: '',
    meetingDate: undefined,
    studentsPresent: '',
    studentsTotal: '',
    organization: '',
    orgCount: '',
    orgContact: '',
    qualityReview: '',
    recommendations: '',
    directorNotes: '',
    reportDate: undefined,
    directorName: '',
    departmentHead: '',
  });

  useEffect(() => {
    const savedData = localStorage.getItem('practiceReportData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData({
        ...parsed,
        practiceStartDate: parsed.practiceStartDate ? new Date(parsed.practiceStartDate) : undefined,
        practiceEndDate: parsed.practiceEndDate ? new Date(parsed.practiceEndDate) : undefined,
        orderDate: parsed.orderDate ? new Date(parsed.orderDate) : undefined,
        meetingDate: parsed.meetingDate ? new Date(parsed.meetingDate) : undefined,
        reportDate: parsed.reportDate ? new Date(parsed.reportDate) : undefined,
      });
    }
  }, []);

  const handleInputChange = (field: keyof FormData, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    localStorage.setItem('practiceReportData', JSON.stringify({
      ...newData,
      practiceStartDate: newData.practiceStartDate?.toISOString(),
      practiceEndDate: newData.practiceEndDate?.toISOString(),
      orderDate: newData.orderDate?.toISOString(),
      meetingDate: newData.meetingDate?.toISOString(),
      reportDate: newData.reportDate?.toISOString(),
    }));
  };

  const handleOrganizationChange = (orgName: string) => {
    const org = organizations.find(o => o.name === orgName);
    handleInputChange('organization', orgName);
    if (org) {
      handleInputChange('orgContact', org.phone);
    }
  };

  const generateWordDocument = async () => {
    if (!formData.studentGroup || !formData.practiceType || !formData.practiceStartDate) {
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
                text: 'МИНИСТЕРСТВО НАУКИ И ВЫСШЕГО ОБРАЗОВАНИЯ РОССИЙСКОЙ ФЕДЕРАЦИИ',
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ',
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ ВЫСШЕГО ОБРАЗОВАНИЯ',
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '«ТЮМЕНСКИЙ ИНДУСТРИАЛЬНЫЙ УНИВЕРСИТЕТ»',
                size: 22,
                bold: true,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'ОТЧЁТ',
                size: 28,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `о прохождении практики обучающимися в ${formData.academicYear} учебном году`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: '1. Основные сведения о практике',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Выпускающая кафедра: ИСТ`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Группа (ы): ${formData.studentGroup}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Вид практики: ${formData.practiceType}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Тип практики: ${formData.practiceSubtype}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Количество обучающихся: ${formData.studentCount}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Продолжительность практики: ${formData.duration} недель`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Форма обучения: ${formData.educationForm}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Период проведения практики: ${formData.practiceStartDate ? format(formData.practiceStartDate, 'dd.MM.yyyy', { locale: ru }) : ''} - ${formData.practiceEndDate ? format(formData.practiceEndDate, 'dd.MM.yyyy', { locale: ru }) : ''}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: '2. Работа по организации практики',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Приказ об организации проведения практики № ${formData.orderNumber} от ${formData.orderDate ? format(formData.orderDate, 'dd.MM.yyyy', { locale: ru }) : ''}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `ФИО, должность руководителя практики от Университета: ${formData.fio}, ${formData.supervisor}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Дата проведения организационного собрания: ${formData.meetingDate ? format(formData.meetingDate, 'dd.MM.yyyy', { locale: ru }) : ''}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: '3. Ход прохождения практики',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Группа: ${formData.studentGroup}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Всего практикантов: ${formData.studentsTotal}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: '4. Перечень основных предприятий, предоставляющих обучающимся места практики',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Наименование предприятия: ${formData.organization}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Количество мест: ${formData.orgCount}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Контактный телефон: ${formData.orgContact}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: '6. Отзыв руководителей практики от кафедры о качестве работы практикантов:',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: formData.qualityReview || 'Практику прошли студенты в срок, установленные графиком учебного процесса, отчеты соответствуют подъвагаемым требованиям',
                size: 22,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: '8. Замечания, предложения кафедры о ходе подготовки и проведения практики',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: formData.recommendations || 'Обратить внимание на правильность оформления в отчетах списка используемых числа',
                size: 22,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: '10. Заключение заместителя директора по учебно-методической работе о практике: считать результаты удовлетворительными',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Зам. Директора по учебно-методической работе: __________ ${formData.directorName}`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: `«___» ___________ ${formData.reportDate ? format(formData.reportDate, 'yyyy', { locale: ru }) : ''} г.`,
                size: 22,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Заведующий кафедрой: __________ ${formData.departmentHead}`,
                size: 22,
              }),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Отчет_практика_${formData.studentGroup}_${format(new Date(), 'dd-MM-yyyy')}.docx`);
    toast.success('Документ успешно создан!');
  };

  const clearForm = () => {
    setFormData({
      academicYear: '2024-2025',
      studentGroup: '',
      practiceType: '',
      practiceSubtype: '',
      studentCount: '',
      duration: '',
      educationForm: 'Очная',
      practiceStartDate: undefined,
      practiceEndDate: undefined,
      orderNumber: '',
      orderDate: undefined,
      fio: '',
      supervisor: '',
      meetingDate: undefined,
      studentsPresent: '',
      studentsTotal: '',
      organization: '',
      orgCount: '',
      orgContact: '',
      qualityReview: '',
      recommendations: '',
      directorNotes: '',
      reportDate: undefined,
      directorName: '',
      departmentHead: '',
    });
    localStorage.removeItem('practiceReportData');
    toast.success('Форма очищена');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-secondary text-secondary-foreground">
            <div className="flex items-center gap-3">
              <Icon name="FileText" size={32} />
              <div>
                <CardTitle className="text-2xl font-bold">Конструктор отчётов по практике</CardTitle>
                <p className="text-sm text-secondary-foreground/80 mt-1">
                  Тюменский индустриальный университет
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">1. Основные сведения о практике</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Учебный год <span className="text-destructive">*</span></Label>
                  <Input
                    id="academicYear"
                    value={formData.academicYear}
                    onChange={(e) => handleInputChange('academicYear', e.target.value)}
                    placeholder="2024-2025"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentGroup">Группа <span className="text-destructive">*</span></Label>
                  <Input
                    id="studentGroup"
                    value={formData.studentGroup}
                    onChange={(e) => handleInputChange('studentGroup', e.target.value)}
                    placeholder="ИСТ-нб-22-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentCount">Количество обучающихся</Label>
                  <Input
                    id="studentCount"
                    type="number"
                    value={formData.studentCount}
                    onChange={(e) => handleInputChange('studentCount', e.target.value)}
                    placeholder="27"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Вид практики <span className="text-destructive">*</span></Label>
                  <Select value={formData.practiceType} onValueChange={(value) => handleInputChange('practiceType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите вид практики" />
                    </SelectTrigger>
                    <SelectContent>
                      {practiceTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Тип практики <span className="text-destructive">*</span></Label>
                  <Select value={formData.practiceSubtype} onValueChange={(value) => handleInputChange('practiceSubtype', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип практики" />
                    </SelectTrigger>
                    <SelectContent>
                      {practiceSubtypes.map((subtype) => (
                        <SelectItem key={subtype} value={subtype}>{subtype}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Продолжительность (недель)</Label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="4"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Форма обучения</Label>
                  <Input
                    value={formData.educationForm}
                    onChange={(e) => handleInputChange('educationForm', e.target.value)}
                    placeholder="Очная"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Дата начала практики <span className="text-destructive">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Icon name="Calendar" className="mr-2" size={16} />
                        {formData.practiceStartDate ? format(formData.practiceStartDate, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.practiceStartDate}
                        onSelect={(date) => handleInputChange('practiceStartDate', date)}
                        locale={ru}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Дата окончания практики</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Icon name="Calendar" className="mr-2" size={16} />
                        {formData.practiceEndDate ? format(formData.practiceEndDate, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.practiceEndDate}
                        onSelect={(date) => handleInputChange('practiceEndDate', date)}
                        locale={ru}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">2. Работа по организации практики</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Номер приказа</Label>
                  <Input
                    value={formData.orderNumber}
                    onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                    placeholder="03-3010.128-п"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Дата приказа</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Icon name="Calendar" className="mr-2" size={16} />
                        {formData.orderDate ? format(formData.orderDate, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.orderDate}
                        onSelect={(date) => handleInputChange('orderDate', date)}
                        locale={ru}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ФИО руководителя практики</Label>
                  <Input
                    value={formData.fio}
                    onChange={(e) => handleInputChange('fio', e.target.value)}
                    placeholder="Прокопов Г.В."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Должность</Label>
                  <Input
                    value={formData.supervisor}
                    onChange={(e) => handleInputChange('supervisor', e.target.value)}
                    placeholder="Доцент кафедры ИСТ"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Дата организационного собрания</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Icon name="Calendar" className="mr-2" size={16} />
                      {formData.meetingDate ? format(formData.meetingDate, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.meetingDate}
                      onSelect={(date) => handleInputChange('meetingDate', date)}
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">3. Ход прохождения практики</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Присутствовало студентов</Label>
                  <Input
                    type="number"
                    value={formData.studentsPresent}
                    onChange={(e) => handleInputChange('studentsPresent', e.target.value)}
                    placeholder="27"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Всего студентов</Label>
                  <Input
                    type="number"
                    value={formData.studentsTotal}
                    onChange={(e) => handleInputChange('studentsTotal', e.target.value)}
                    placeholder="27"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">4. Предприятия для практики</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Организация</Label>
                  <Select value={formData.organization} onValueChange={handleOrganizationChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите организацию" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.name} value={org.name}>{org.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Количество мест</Label>
                    <Input
                      type="number"
                      value={formData.orgCount}
                      onChange={(e) => handleInputChange('orgCount', e.target.value)}
                      placeholder="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Контактный телефон</Label>
                    <Input
                      value={formData.orgContact}
                      onChange={(e) => handleInputChange('orgContact', e.target.value)}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">6. Отзыв о качестве работы</h3>
              
              <div className="space-y-2">
                <Textarea
                  value={formData.qualityReview}
                  onChange={(e) => handleInputChange('qualityReview', e.target.value)}
                  placeholder="Практику прошли студенты в срок, установленные графиком учебного процесса..."
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">8. Замечания и предложения</h3>
              
              <div className="space-y-2">
                <Textarea
                  value={formData.recommendations}
                  onChange={(e) => handleInputChange('recommendations', e.target.value)}
                  placeholder="Обратить внимание на правильность оформления..."
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">10. Заключение и подписи</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Зам. директора по УМР</Label>
                  <Input
                    value={formData.directorName}
                    onChange={(e) => handleInputChange('directorName', e.target.value)}
                    placeholder="А.В. Быстрицкая"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Заведующий кафедрой</Label>
                  <Input
                    value={formData.departmentHead}
                    onChange={(e) => handleInputChange('departmentHead', e.target.value)}
                    placeholder="О.Ф. Данилов"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Дата отчёта</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Icon name="Calendar" className="mr-2" size={16} />
                      {formData.reportDate ? format(formData.reportDate, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.reportDate}
                      onSelect={(date) => handleInputChange('reportDate', date)}
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Button onClick={generateWordDocument} className="flex-1 h-12 text-base font-medium" size="lg">
                <Icon name="Download" className="mr-2" size={20} />
                Скачать Word документ
              </Button>
              <Button onClick={clearForm} variant="outline" className="h-12 px-8" size="lg">
                <Icon name="RotateCcw" className="mr-2" size={20} />
                Очистить
              </Button>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-muted">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Данные автоматически сохраняются в браузере. Поля со звёздочкой (<span className="text-destructive">*</span>) обязательны для заполнения.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
