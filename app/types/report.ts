export type ReportFileList = {
  files: string[];
};

export type ProcessReportRequest = {
  filename: string;
};

export type ProcessReportResponse = {
  processed_files: { filename: string; students_found: number }[];
  students_found: number;
  predictions: any[];
  summary: {
    total: number;
    alto: number;
    medio: number;
    baixo: number;
    avg_probability: number;
  };
};
