import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";

export interface User {
  _id: string;
  fullName: string;
  avatar?: string;
  // Thêm các trường khác nếu cần
}

export interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetchUser: (retry?: number) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (retry = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/user/me`, {
        withCredentials: true,
      });
      setUser(response.data);
      setError(null);
    } catch (err: unknown) {
      const error = err as { response?: { status: number } };
      // Nếu lỗi 401 và còn lượt retry thì thử lại sau 500ms
      if (error.response?.status === 401 && retry > 0) {
        setTimeout(() => fetchUser(retry - 1), 500);
        return;
      }
      setError("Không thể lấy thông tin người dùng");
      setUser(null);
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser(2); // Cho phép thử lại 2 lần nếu lỗi
  }, [fetchUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      refetchUser: fetchUser,
    }),
    [user, loading, error, fetchUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
