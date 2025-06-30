export const TokenType = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN'
} as const

export type TokenType = (typeof TokenType)[keyof typeof TokenType]

export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD'
} as const

export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod]

export const DotNumber = {
  DOT_1: 1,
  DOT_2: 2,
  DOT_3: 3,
  DOT_4: 4
} as const

export type DotNumber = (typeof DotNumber)[keyof typeof DotNumber]

export const KiHoc = {
  KI_1: 1,
  KI_1_1: 1.1,
  KI_1_2: 1.2,
  KI_2: 2,
  KI_2_1: 2.1,
  KI_2_2: 2.2
} as const

export type KiHoc = (typeof KiHoc)[keyof typeof KiHoc]

/**
 * Enum cho phương pháp đánh giá
 */
export const AssessmentMethod = {
  WRITTEN_EXAM: 'Thi viết',
  ORAL_EXAM: 'Thi vấn đáp',
  PRACTICAL_EXAM: 'Thi thực hành',
  PROJECT: 'Đồ án',
  PRESENTATION: 'Thuyết trình',
  ASSIGNMENT: 'Bài tập',
  CONTINUOUS_ASSESSMENT: 'Đánh giá quá trình',
  REPORT: 'Báo cáo'
} as const

export type AssessmentMethod = (typeof AssessmentMethod)[keyof typeof AssessmentMethod]

/**
 * Enum cho thang điểm
 */
export const GradingScale = {
  SCALE_10: 'Thang điểm 10',
  SCALE_4: 'Thang điểm 4',
  LETTER_GRADE: 'Thang điểm chữ A,B,C,D,F',
  PASS_FAIL: 'Đạt/Không đạt'
} as const

export type GradingScale = (typeof GradingScale)[keyof typeof GradingScale]

/**
 * Enum cho loại môn học
 */
export const CourseType = {
  GENERAL: 'Đại cương',
  FOUNDATION: 'Cơ sở',
  SPECIALIZED: 'Chuyên ngành',
  ELECTIVE: 'Tự chọn',
  THESIS: 'Luận văn/Đồ án',
  INTERNSHIP: 'Thực tập',
  SELF_SELECTED: 'Tự chọn',
  REQUIRED: 'Bắt buộc'
} as const

export type CourseType = (typeof CourseType)[keyof typeof CourseType]

export const DepartmentType = {
  FACULTY: 'Khoa',
  SUB_DEPARTMENT: 'Bộ môn'
} as const

export type DepartmentType = (typeof DepartmentType)[keyof typeof DepartmentType]

/**
 * Enum cho các khoa chính
 */
export const FacultyType = {
  // Các khoa có thể có trong trường quân sự
  COMMAND_STAFF: 'Khoa Chỉ huy - Tham mưu',
  LOGISTICS: 'Khoa Hậu cần',
  TECHNICAL: 'Khoa Kỹ thuật',
  POLITICAL: 'Khoa Chính trị',
  BASIC_SCIENCE: 'Khoa Khoa học Cơ bản',
  FOREIGN_LANGUAGE: 'Khoa Ngoại ngữ'
} as const

export type FacultyType = (typeof FacultyType)[keyof typeof FacultyType]

export const ResearchType = {
  // === BÀI BÁO KHOA HỌC ===
  SCIENTIFIC_ARTICLE: 'Bài báo khoa học',

  // === BẰNG SÁNG CHẾ & GIẢI THƯỞNG ===
  PATENT_AWARD: 'Bằng sáng chế',

  // === BIÊN SOẠN GIÁO TRÌNH ===
  TEXTBOOK_COMPILATION: 'Biên soạn giáo trình',

  // === ĐỀ TÀI DỰ ÁN ===
  RESEARCH_PROJECT: 'Đề tài dự án',

  // === NCKH & HUẤN LUYỆN ĐỘI TUYỂN ===
  RESEARCH_TRAINING: 'NCKH & Huấn luyện đội tuyển',

  // === SÁCH & GIÁO TRÌNH ===
  BOOK_TEXTBOOK: 'Sách & Giáo trình',

  // === XÂY DỰNG CTĐT ===
  CURRICULUM_DEVELOPMENT: 'Xây dựng CTĐT',

  // === NHIỆM VỤ KHCN ===
  SCIENCE_TECHNOLOGY_TASK: 'Nhiệm vụ KHCN',

  // === SỐ TIẾT NCKH BẢO LƯU ===
  RESEARCH_HOURS_CARRYOVER: 'Số tiết NCKH bảo lưu'
} as const

export type ResearchType = (typeof ResearchType)[keyof typeof ResearchType]

export const ResearchLevel = {
  STATE: 'Nhà nước',
  MINISTRY: 'Bộ',
  PROVINCIAL: 'Tỉnh',
  INSTITUTIONAL: 'Cơ sở',
  FACULTY: 'Khoa',
  INTERNATIONAL: 'Quốc tế'
} as const

export type ResearchLevel = (typeof ResearchLevel)[keyof typeof ResearchLevel]

export const AcademicDegree = {
  BACHELOR: 'Cử nhân',
  ENGINEER: 'Kỹ sư',
  MASTER: 'Thạc sĩ',
  DOCTOR: 'Tiến sĩ',
  PROFESSOR: 'Giáo sư',
  ASSOCIATE_PROFESSOR: 'Phó giáo sư'
} as const

export type AcademicDegree = (typeof AcademicDegree)[keyof typeof AcademicDegree]

export const Gender = {
  MALE: 'Nam',
  FEMALE: 'Nữ'
} as const

export type Gender = (typeof Gender)[keyof typeof Gender]

export const Role: Record<string, string[]> = {
  Department: ['Thường', 'Duyệt'],
  Faculty: ['Giảng viên', 'Giáo vụ - Chủ nhiệm bộ môn', 'Lãnh đạo khoa']
}

/**
 * Enum cho các loại file được phép upload
 */
export const FileType = {
  // Images
  IMAGE: 'image/*',

  // Documents
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

  // Spreadsheets
  XLS: 'application/vnd.ms-excel',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

  // Text files
  TEXT: 'text/plain',

  // Presentations
  PPT: 'application/vnd.ms-powerpoint',
  PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  // Archives
  ZIP: 'application/zip',
  RAR: 'application/x-rar-compressed'
} as const

export type FileType = (typeof FileType)[keyof typeof FileType]

/**
 * Predefined file type groups for common use cases
 */
export const FileTypeGroups = {
  DOCUMENTS: [FileType.PDF, FileType.DOC, FileType.DOCX] as FileType[],
  IMAGES: [FileType.IMAGE] as FileType[],
  SPREADSHEETS: [FileType.XLS, FileType.XLSX] as FileType[],
  PRESENTATIONS: [FileType.PPT, FileType.PPTX] as FileType[],
  PROFILE_FILES: [FileType.IMAGE, FileType.PDF, FileType.DOC, FileType.DOCX] as FileType[],
  ALL_OFFICE: [FileType.DOC, FileType.DOCX, FileType.XLS, FileType.XLSX, FileType.PPT, FileType.PPTX] as FileType[],
  ARCHIVES: [FileType.ZIP, FileType.RAR] as FileType[]
} as const

export type FileTypeGroups = (typeof FileTypeGroups)[keyof typeof FileTypeGroups]
