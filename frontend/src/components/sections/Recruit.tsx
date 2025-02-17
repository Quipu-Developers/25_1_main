import { useRouter } from "next/navigation";

export default function Recruit() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl">Recruit Section</h2>
      <button onClick={() => router.push("/recruit")}>
        퀴푸 가입하러 가기
      </button>
    </div>
  );
}
