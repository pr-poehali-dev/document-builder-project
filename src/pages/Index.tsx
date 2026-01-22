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

interface OrganizationEntry {
  id: string;
  name: string;
  phone: string;
  count: string;
}

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
  studentsAsInterns: string;
  paidWorkplace: string;
  withCertification: string;
  outsideCity: string;
  workMatchesProgram: string;
  studentsTotal: string;
  organizationsList: OrganizationEntry[];
  resultsSent: string;
  resultsExcellent: string;
  resultsGood: string;
  resultsSatisfactory: string;
  resultsUnsatisfactory: string;
  resultsNotes: string;
  qualityReview: string;
  kafedraDiscussion: string;
  recommendations: string;
  kafedraHeadConclusion: string;
  directorConclusion: string;
  directorDate: Date | undefined;
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
    studentsAsInterns: '',
    paidWorkplace: '',
    withCertification: '',
    outsideCity: '',
    workMatchesProgram: '',
    studentsTotal: '',
    organizationsList: [],
    resultsSent: '',
    resultsExcellent: '',
    resultsGood: '',
    resultsSatisfactory: '',
    resultsUnsatisfactory: '',
    resultsNotes: '',
    qualityReview: '',
    kafedraDiscussion: '',
    recommendations: '',
    kafedraHeadConclusion: '',
    directorConclusion: '',
    directorDate: undefined,
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
        organizationsList: Array.isArray(parsed.organizationsList) ? parsed.organizationsList : [],
        practiceStartDate: parsed.practiceStartDate ? new Date(parsed.practiceStartDate) : undefined,
        practiceEndDate: parsed.practiceEndDate ? new Date(parsed.practiceEndDate) : undefined,
        orderDate: parsed.orderDate ? new Date(parsed.orderDate) : undefined,
        meetingDate: parsed.meetingDate ? new Date(parsed.meetingDate) : undefined,
        directorDate: parsed.directorDate ? new Date(parsed.directorDate) : undefined,
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
      directorDate: newData.directorDate?.toISOString(),
      reportDate: newData.reportDate?.toISOString(),
    }));
  };

  const addOrganization = () => {
    const newOrg: OrganizationEntry = {
      id: Date.now().toString(),
      name: '',
      phone: '',
      count: '',
    };
    handleInputChange('organizationsList', [...formData.organizationsList, newOrg]);
  };

  const removeOrganization = (id: string) => {
    handleInputChange('organizationsList', formData.organizationsList.filter(org => org.id !== id));
  };

  const updateOrganization = (id: string, field: keyof OrganizationEntry, value: string) => {
    const updated = formData.organizationsList.map(org => {
      if (org.id === id) {
        const newOrg = { ...org, [field]: value };
        if (field === 'name') {
          const foundOrg = organizations.find(o => o.name === value);
          if (foundOrg) {
            newOrg.phone = foundOrg.phone;
          }
        }
        return newOrg;
      }
      return org;
    });
    handleInputChange('organizationsList', updated);
  };

  const generateWordDocument = async () => {
    if (!formData.studentGroup || !formData.practiceType || !formData.practiceStartDate) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    const borderStyle = {
      style: BorderStyle.SINGLE,
      size: 1,
      color: "000000",
    };

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
                text: 'ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ',
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
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: borderStyle,
              bottom: borderStyle,
              left: borderStyle,
              right: borderStyle,
              insideHorizontal: borderStyle,
              insideVertical: borderStyle,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Выпускающая кафедра', alignment: AlignmentType.LEFT })],
                    width: { size: 40, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'ИСТ', alignment: AlignmentType.CENTER })],
                    width: { size: 60, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Группа (ы)' })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.studentGroup, alignment: AlignmentType.CENTER })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Вид практики' })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.practiceType, alignment: AlignmentType.CENTER })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Тип практики' })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.practiceSubtype, alignment: AlignmentType.CENTER })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Количество обучающихся, чел.' })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.studentCount, alignment: AlignmentType.CENTER })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Продолжительность практики, количество недель' })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.duration, alignment: AlignmentType.CENTER })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Форма обучения' })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.educationForm, alignment: AlignmentType.CENTER })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Период проведения практики' })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      text: `${formData.practiceStartDate ? format(formData.practiceStartDate, 'dd.MM.yyyy', { locale: ru }) : ''} - ${formData.practiceEndDate ? format(formData.practiceEndDate, 'dd.MM.yyyy', { locale: ru }) : ''}`, 
                      alignment: AlignmentType.CENTER 
                    })],
                  }),
                ],
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
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: borderStyle,
              bottom: borderStyle,
              left: borderStyle,
              right: borderStyle,
              insideHorizontal: borderStyle,
              insideVertical: borderStyle,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Приказ об организации проведения практики' })],
                    width: { size: 30, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: '№', alignment: AlignmentType.CENTER })],
                    width: { size: 10, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.orderNumber, alignment: AlignmentType.CENTER })],
                    width: { size: 30, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Дата', alignment: AlignmentType.CENTER })],
                    width: { size: 10, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.orderDate ? format(formData.orderDate, 'dd.MM.yyyy', { locale: ru }) : '', alignment: AlignmentType.CENTER })],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'ФИО, должность руководителя практики от Университета' })],
                    columnSpan: 2,
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: `${formData.fio}, ${formData.supervisor}`, alignment: AlignmentType.CENTER })],
                    columnSpan: 3,
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Дата проведения организационного собрания перед началом практики (проведена инструктаж по технике безопасности)' })],
                    columnSpan: 4,
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.meetingDate ? format(formData.meetingDate, 'dd.MM.yyyy', { locale: ru }) : '', alignment: AlignmentType.CENTER })],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: '3. Ход проведения практики',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: borderStyle,
              bottom: borderStyle,
              left: borderStyle,
              right: borderStyle,
              insideHorizontal: borderStyle,
              insideVertical: borderStyle,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Группа', alignment: AlignmentType.CENTER })],
                    rowSpan: 2,
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Количество обучающихся, направленных на практику:', alignment: AlignmentType.CENTER })],
                    columnSpan: 6,
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'ВСЕГО', alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'в качестве практиканта на оплачиваемое рабочее место', alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'на которые имеют удостоверение по рабочим профессиям', alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'за пределы населенного пункта, в котором расположен Университет (филиал)', alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'выполняемая работа которых соответствует программе практики', alignment: AlignmentType.CENTER })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: formData.studentGroup, alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.studentsTotal, alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.studentsAsInterns, alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.paidWorkplace, alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.withCertification, alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.outsideCity, alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.workMatchesProgram, alignment: AlignmentType.CENTER })],
                  }),
                ],
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
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: borderStyle,
              bottom: borderStyle,
              left: borderStyle,
              right: borderStyle,
              insideHorizontal: borderStyle,
              insideVertical: borderStyle,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Наименование предприятия, город', alignment: AlignmentType.CENTER })],
                    width: { size: 60, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Кол-во мест', alignment: AlignmentType.CENTER })],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Контактный тел.', alignment: AlignmentType.CENTER })],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              ...formData.organizationsList.map(org => new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: org.name })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: org.count, alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: org.phone, alignment: AlignmentType.CENTER })],
                  }),
                ],
              })),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: '5. Итоги проведения практики',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: borderStyle,
              bottom: borderStyle,
              left: borderStyle,
              right: borderStyle,
              insideHorizontal: borderStyle,
              insideVertical: borderStyle,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Группа', alignment: AlignmentType.CENTER })],
                    rowSpan: 2,
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Кол-во обучающихся, направленных на практику', alignment: AlignmentType.CENTER })],
                    rowSpan: 2,
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Из них предоставили отчет по практике', alignment: AlignmentType.CENTER })],
                    rowSpan: 2,
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'из них защитили отчеты по практике', alignment: AlignmentType.CENTER })],
                    columnSpan: 4,
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Примечание', alignment: AlignmentType.CENTER })],
                    rowSpan: 2,
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: '91-100 (отлично)', alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: '76-90 (хорошо)', alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: '61-75 (удовлетворительно)', alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: '60 и менее (не удовлетворительно)', alignment: AlignmentType.CENTER })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: formData.studentGroup, alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.studentsTotal, alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.resultsSent, alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.resultsExcellent, alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.resultsGood, alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.resultsSatisfactory, alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.resultsUnsatisfactory, alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formData.resultsNotes })],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: '6. Отзыв руководителей практики от кафедры о качестве работы практикантов',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: formData.qualityReview || 'Практику прошли студенты в срок, установленные графиком учебного процесса, отчеты соответствуют предъявляемым требованиям',
                size: 22,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: '7. Отчет о практике заслушан на заседании кафедры',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: formData.kafedraDiscussion || '',
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
                text: formData.recommendations || 'Обратить внимание на правильность оформления в отчетах списка используемых источников',
                size: 22,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: '9. Заключение заведующего кафедрой о практике студентов и оценка работы руководителей практики от кафедры',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: formData.kafedraHeadConclusion || '',
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
          new Paragraph({
            children: [
              new TextRun({
                text: formData.directorConclusion || '',
                size: 22,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Зам. Директора по',
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Учебно-методической работе',
                size: 22,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: `«___» ___________ ${formData.directorDate ? format(formData.directorDate, 'yyyy', { locale: ru }) : '2024'} г.`,
                size: 22,
              }),
              new TextRun({
                text: '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t',
                size: 22,
              }),
              new TextRun({
                text: '__________ ',
                size: 22,
              }),
              new TextRun({
                text: formData.directorName,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t',
                size: 22,
              }),
              new TextRun({
                text: '(подпись)',
                size: 18,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Заведующий кафедрой',
                size: 22,
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: `«___» ___________ ${formData.reportDate ? format(formData.reportDate, 'yyyy', { locale: ru }) : '2024'} г.`,
                size: 22,
              }),
              new TextRun({
                text: '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t',
                size: 22,
              }),
              new TextRun({
                text: '__________ ',
                size: 22,
              }),
              new TextRun({
                text: formData.departmentHead,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t',
                size: 22,
              }),
              new TextRun({
                text: '(подпись)',
                size: 18,
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
      studentsAsInterns: '',
      paidWorkplace: '',
      withCertification: '',
      outsideCity: '',
      workMatchesProgram: '',
      studentsTotal: '',
      organizationsList: [],
      resultsSent: '',
      resultsExcellent: '',
      resultsGood: '',
      resultsSatisfactory: '',
      resultsUnsatisfactory: '',
      resultsNotes: '',
      qualityReview: '',
      kafedraDiscussion: '',
      recommendations: '',
      kafedraHeadConclusion: '',
      directorConclusion: '',
      directorDate: undefined,
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
              <h3 className="text-lg font-semibold border-b pb-2">3. Ход проведения практики</h3>
              
              <div className="space-y-2">
                <Label>Группа (автозаполнение)</Label>
                <Input
                  value={formData.studentGroup}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Всего студентов направлено</Label>
                  <Input
                    type="number"
                    value={formData.studentsTotal}
                    onChange={(e) => handleInputChange('studentsTotal', e.target.value)}
                    placeholder="27"
                  />
                </div>

                <div className="space-y-2">
                  <Label>В качестве практиканта</Label>
                  <Input
                    type="number"
                    value={formData.studentsAsInterns}
                    onChange={(e) => handleInputChange('studentsAsInterns', e.target.value)}
                    placeholder="27"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>На оплачиваемое рабочее место</Label>
                  <Input
                    type="number"
                    value={formData.paidWorkplace}
                    onChange={(e) => handleInputChange('paidWorkplace', e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Имеют удостоверение по рабочим профессиям</Label>
                  <Input
                    type="number"
                    value={formData.withCertification}
                    onChange={(e) => handleInputChange('withCertification', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>За пределы населенного пункта</Label>
                  <Input
                    type="number"
                    value={formData.outsideCity}
                    onChange={(e) => handleInputChange('outsideCity', e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Работа соответствует программе практики</Label>
                  <Input
                    type="number"
                    value={formData.workMatchesProgram}
                    onChange={(e) => handleInputChange('workMatchesProgram', e.target.value)}
                    placeholder="27"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold border-b pb-2 flex-1">4. Предприятия для практики</h3>
                <Button onClick={addOrganization} size="sm" variant="outline">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить организацию
                </Button>
              </div>
              
              {formData.organizationsList.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Building2" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Нажмите "Добавить организацию" для начала</p>
                </div>
              )}

              {formData.organizationsList.map((org, index) => (
                <Card key={org.id} className="p-4 border-2">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold">Организация {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOrganization(org.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Организация</Label>
                      <Select 
                        value={org.name} 
                        onValueChange={(value) => updateOrganization(org.id, 'name', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите организацию" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((o) => (
                            <SelectItem key={o.name} value={o.name}>{o.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Контактный телефон</Label>
                        <Input
                          value={org.phone}
                          disabled
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Количество мест</Label>
                        <Input
                          type="number"
                          value={org.count}
                          onChange={(e) => updateOrganization(org.id, 'count', e.target.value)}
                          placeholder="1"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">5. Итоги проведения практики</h3>
              
              <div className="space-y-2">
                <Label>Группа (автозаполнение)</Label>
                <Input
                  value={formData.studentGroup}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Направлено на практику</Label>
                  <Input
                    value={formData.studentsTotal}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Предоставили отчет</Label>
                  <Input
                    type="number"
                    value={formData.resultsSent}
                    onChange={(e) => handleInputChange('resultsSent', e.target.value)}
                    placeholder="27"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>91-100 (отлично)</Label>
                  <Input
                    type="number"
                    value={formData.resultsExcellent}
                    onChange={(e) => handleInputChange('resultsExcellent', e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>76-90 (хорошо)</Label>
                  <Input
                    type="number"
                    value={formData.resultsGood}
                    onChange={(e) => handleInputChange('resultsGood', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>61-75 (удовлетворительно)</Label>
                  <Input
                    type="number"
                    value={formData.resultsSatisfactory}
                    onChange={(e) => handleInputChange('resultsSatisfactory', e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>60 и менее (не удовлетворительно)</Label>
                  <Input
                    type="number"
                    value={formData.resultsUnsatisfactory}
                    onChange={(e) => handleInputChange('resultsUnsatisfactory', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Примечание</Label>
                <Textarea
                  value={formData.resultsNotes}
                  onChange={(e) => handleInputChange('resultsNotes', e.target.value)}
                  placeholder="Дополнительная информация..."
                  rows={3}
                />
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
              <h3 className="text-lg font-semibold border-b pb-2">7. Отчет о практике заслушан на заседании кафедры</h3>
              
              <div className="space-y-2">
                <Textarea
                  value={formData.kafedraDiscussion}
                  onChange={(e) => handleInputChange('kafedraDiscussion', e.target.value)}
                  placeholder="Протокол № ___ от ___________"
                  rows={3}
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
              <h3 className="text-lg font-semibold border-b pb-2">9. Заключение заведующего кафедрой</h3>
              
              <div className="space-y-2">
                <Textarea
                  value={formData.kafedraHeadConclusion}
                  onChange={(e) => handleInputChange('kafedraHeadConclusion', e.target.value)}
                  placeholder="Заключение о практике студентов и оценка работы руководителей..."
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">10. Заключение заместителя директора</h3>
              
              <div className="space-y-2">
                <Textarea
                  value={formData.directorConclusion}
                  onChange={(e) => handleInputChange('directorConclusion', e.target.value)}
                  placeholder="Считать результаты практики удовлетворительными..."
                  rows={4}
                />
              </div>

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
                  <Label>Дата подписи директора</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Icon name="Calendar" className="mr-2" size={16} />
                        {formData.directorDate ? format(formData.directorDate, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.directorDate}
                        onSelect={(date) => handleInputChange('directorDate', date)}
                        locale={ru}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Заведующий кафедрой</Label>
                  <Input
                    value={formData.departmentHead}
                    onChange={(e) => handleInputChange('departmentHead', e.target.value)}
                    placeholder="О.Ф. Данилов"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Дата подписи заведующего</Label>
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