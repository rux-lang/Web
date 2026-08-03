export interface ApiValidationError {
  code: string;
  detail: string;
  pointer?: string;
}

export interface ApiProblem {
  type: string;
  title: string;
  status: number;
  code: string;
  detail?: string;
  instance?: string;
  errors?: ApiValidationError[];
}

export interface ApiFailure {
  title: string;
  detail: string;
  errors: string[];
  retryable: boolean;
  problem?: ApiProblem;
}
