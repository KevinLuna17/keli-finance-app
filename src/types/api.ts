export type ApiErrorResponse = {
  error: {
    message: string;
    code: string;
  };
};

export type ApiSuccessResponse<T> = {
  data: T;
};

export type BackendUser = {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
};
