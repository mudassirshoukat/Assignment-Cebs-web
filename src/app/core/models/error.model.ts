export interface ValidationError {
  code: string;
  description: string;
  type: number;
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail?: string;
  isFriendly?: boolean;

  // Can be array OR object
  errors?: ValidationError[] | Record<string, string[]>;
}
