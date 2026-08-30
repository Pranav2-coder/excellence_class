// ============================================================
// Mock Data — EduPay Pro Demo
// ============================================================

export const COURSES = [
  'JEE Foundation',
  'NEET Preparation',
  'Class 10 Board',
  'Class 12 PCM',
  'Class 12 PCB',
  'Foundation Batch',
  'Olympiad Training',
];

export const PAYMENT_MODES = ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Online'];

// Admin credential
export const ADMIN_CREDENTIAL = {
  email: 'admin@demo.com',
  password: 'admin123',
};

// Generate helper
const makeId = (n) => `STU${String(n).padStart(3, '0')}`;

const makeDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

// ============================================================
// Students with embedded payment history
// ============================================================
export const INITIAL_STUDENTS = [
  {
    id: makeId(1),
    name: 'Aarav Sharma',
    mobile: '9876543210',
    course: 'JEE Foundation',
    yearlyFee: 48000,
    password: 'stu001',
    joinDate: '2024-06-01',
    payments: [
      { id: 'P001', amount: 16000, date: makeDate(90), mode: 'UPI',   note: 'Q1 Installment' },
      { id: 'P002', amount: 12000, date: makeDate(45), mode: 'Cash',  note: 'Q2 Installment' },
    ],
  },
  {
    id: makeId(2),
    name: 'Priya Patel',
    mobile: '9823456789',
    course: 'NEET Preparation',
    yearlyFee: 52000,
    password: 'stu002',
    joinDate: '2024-06-10',
    payments: [
      { id: 'P003', amount: 20000, date: makeDate(80), mode: 'Bank Transfer', note: 'Advance Payment' },
      { id: 'P004', amount: 15000, date: makeDate(30), mode: 'UPI',           note: 'Mid-Year' },
    ],
  },
  {
    id: makeId(3),
    name: 'Rohan Mehta',
    mobile: '9012345678',
    course: 'Class 12 PCM',
    yearlyFee: 36000,
    password: 'stu003',
    joinDate: '2024-07-01',
    payments: [
      { id: 'P005', amount: 36000, date: makeDate(60), mode: 'Cheque', note: 'Full Payment' },
    ],
  },
  {
    id: makeId(4),
    name: 'Ananya Singh',
    mobile: '9654321098',
    course: 'Class 10 Board',
    yearlyFee: 28000,
    password: 'stu004',
    joinDate: '2024-07-15',
    payments: [
      { id: 'P006', amount: 10000, date: makeDate(50), mode: 'Cash', note: 'First Installment' },
    ],
  },
  {
    id: makeId(5),
    name: 'Karan Joshi',
    mobile: '9543210987',
    course: 'JEE Foundation',
    yearlyFee: 48000,
    password: 'stu005',
    joinDate: '2024-06-20',
    payments: [
      { id: 'P007', amount: 24000, date: makeDate(70), mode: 'UPI',  note: 'Half Year' },
      { id: 'P008', amount: 12000, date: makeDate(10), mode: 'Cash', note: 'Next Installment' },
    ],
  },
  {
    id: makeId(6),
    name: 'Sneha Gupta',
    mobile: '9432109876',
    course: 'NEET Preparation',
    yearlyFee: 52000,
    password: 'stu006',
    joinDate: '2024-08-01',
    payments: [],
  },
  {
    id: makeId(7),
    name: 'Vikram Rao',
    mobile: '9321098765',
    course: 'Foundation Batch',
    yearlyFee: 24000,
    password: 'stu007',
    joinDate: '2024-06-05',
    payments: [
      { id: 'P009', amount: 8000,  date: makeDate(85), mode: 'Bank Transfer', note: 'Q1' },
      { id: 'P010', amount: 8000,  date: makeDate(40), mode: 'UPI',           note: 'Q2' },
      { id: 'P011', amount: 8000,  date: makeDate(5),  mode: 'Cash',          note: 'Q3' },
    ],
  },
  {
    id: makeId(8),
    name: 'Meera Nair',
    mobile: '9210987654',
    course: 'Class 12 PCB',
    yearlyFee: 44000,
    password: 'stu008',
    joinDate: '2024-07-20',
    payments: [
      { id: 'P012', amount: 22000, date: makeDate(35), mode: 'UPI',  note: 'Half-Year Advance' },
    ],
  },
  {
    id: makeId(9),
    name: 'Arjun Kapoor',
    mobile: '9109876543',
    course: 'Olympiad Training',
    yearlyFee: 30000,
    password: 'stu009',
    joinDate: '2024-06-15',
    payments: [
      { id: 'P013', amount: 15000, date: makeDate(55), mode: 'Cash', note: 'First Half' },
      { id: 'P014', amount: 10000, date: makeDate(15), mode: 'UPI',  note: 'Partial' },
    ],
  },
  {
    id: makeId(10),
    name: 'Diya Verma',
    mobile: '9098765432',
    course: 'Class 10 Board',
    yearlyFee: 28000,
    password: 'stu010',
    joinDate: '2024-08-10',
    payments: [
      { id: 'P015', amount: 28000, date: makeDate(20), mode: 'Bank Transfer', note: 'Full Payment' },
    ],
  },
];

// ============================================================
// Dashboard chart data (monthly collections, last 6 months)
// ============================================================
export const MONTHLY_CHART_DATA = [
  { month: 'Mar', collected: 85000,  target: 120000 },
  { month: 'Apr', collected: 112000, target: 120000 },
  { month: 'May', collected: 98000,  target: 120000 },
  { month: 'Jun', collected: 135000, target: 150000 },
  { month: 'Jul', collected: 121000, target: 150000 },
  { month: 'Aug', collected: 94000,  target: 150000 },
];

export const COURSE_CHART_DATA = [
  { name: 'JEE',       value: 35 },
  { name: 'NEET',      value: 28 },
  { name: 'Class 10',  value: 17 },
  { name: 'Class 12',  value: 13 },
  { name: 'Others',    value: 7  },
];

// ============================================================
// Helpers
// ============================================================
export const calcPaid = (student) =>
  student.payments.reduce((sum, p) => sum + p.amount, 0);

export const calcRemaining = (student) =>
  student.yearlyFee - calcPaid(student);

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const generatePaymentId = () =>
  'P' + Date.now().toString().slice(-6);

export const generateStudentId = (existingStudents) => {
  const max = existingStudents.reduce((m, s) => {
    const n = parseInt(s.id.replace('STU', ''), 10);
    return n > m ? n : m;
  }, 0);
  return makeId(max + 1);
};
