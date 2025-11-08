import { supabase } from "@/lib/supabaseClient";

export default async function Home() {
  const { data, error } = await supabase.from('test').select('*');
  console.log(data, error);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-blue-600">
        Supabase Connected ✅
      </h1>
      <p>Next.js + Supabase setup complete.</p>
    </main>
  );
}
