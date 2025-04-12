import axios from "axios";
import { getSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

// Клиентский экземпляр с интерцептором
const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

clientApi.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Серверный экземпляр
export async function serverApi() {
  const session = await getServerSession(authOptions);
  
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: session?.access_token ? `Bearer ${session.access_token}` : "",
    },
  });

  // Добавляем метод для отправки GET с body
  instance.getWithBody = async function (url, data, config = {}) {
    return instance.request({
      method: "GET",
      url,
      data, // Передаем тело запроса
      ...config,
    });
  };
  
  return instance;
}

// Экспортируем клиентский экземпляр по умолчанию
export default clientApi;