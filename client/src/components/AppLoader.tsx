import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import waitImage from "../assets/wait_2.jpg";
import bgImage from "../assets/green1.jpg";

async function checkBackendReady(): Promise<{ status: string }> {
  const wURL = `${import.meta.env.VITE_BACKEND_URL}/test`;
  const res = await fetch(wURL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Backend not ready");
  return res.json();
}

interface AppLoaderProps {
  children: ReactNode;
}

export default function AppLoader({ children }: AppLoaderProps) {
  const maxWaitMs = 90_000; // 90 seconds
  const retryDelay = 2000; // 2 seconds

  const { data, error, isLoading } = useQuery<{ status: string }>({
    queryKey: ["backendReady"],
    queryFn: checkBackendReady,
    retry: (failureCount: number) => failureCount * retryDelay < maxWaitMs,
    retryDelay,
  });

  // Common outer container
  const Background = ({ children }: { children: ReactNode }) => (
    <div
      className="flex h-screen w-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {children}
    </div>
  );

  if (isLoading && !data) {
    return (
      <Background>
        <div className="bg-white rounded-2xl shadow-xl p-6 m-6 flex flex-col md:flex-row items-center md:items-start gap-6 min-h-[250px]">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to the MTBC website
            </div>
            <div className="text-gray-600 font-medium">Starting up…</div>
          </div>
          <img
            src={waitImage}
            alt="Loading…"
            className="max-w-[300px] md:max-w-[400px] object-contain"
          />
        </div>
      </Background>
    );
  }

  if (error instanceof Error) {
    return (
      <Background>
        <div className="bg-white rounded-2xl shadow-xl p-10 m-6 flex flex-col items-center justify-center space-y-6 min-h-[350px] max-w-lg">
          <div className="text-red-600 font-semibold text-lg text-center">
            Backend not available.  
            <br />Please try again later.
          </div>
        </div>
      </Background>
    );
  }

  return <>{children}</>;
}
