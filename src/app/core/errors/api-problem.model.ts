export interface ApiProblem {
  type: string;
  title: string;
  status: number;
  code: string;
  detail: string;
  errors?: Record<string, string[]>;
}
