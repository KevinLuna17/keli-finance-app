import { ApiError } from "@/lib/api/client";
import { listCategories } from "@/services/categories/category.service";
import type { Category } from "@/services/categories/category.types";
import { useAuth } from "@clerk/expo";
import { useCallback, useEffect, useRef, useState } from "react";

type UseCategoriesOptions = {
  workspaceId: string | undefined;
};

type UseCategoriesResult = {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useCategories({
  workspaceId,
}: UseCategoriesOptions): UseCategoriesResult {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(workspaceId));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!workspaceId) {
      setCategories([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await listCategories(
        () => getTokenRef.current(),
        workspaceId,
      );
      setCategories(data);
    } catch (loadError) {
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "Could not load categories",
      );
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    categories,
    isLoading,
    error,
    refresh,
  };
}
