import { supabase } from '../../lib/supabaseClient'
// health page import fixed
export const dynamic='force-dynamic'
export default async function Health(){const {data,error}=await supabase.from('courses').select('slug,title').eq('is_active',true);return(<main className="p-6 max-w-3xl mx-auto"><h1 className="text-2xl font-bold mb-4">Health Check</h1>{error&&<p className="text-red-600">Supabase error: {error.message}</p>}{!error&&(<div><p className="mb-2">DB connected ✓</p><pre className="p-4 border rounded bg-gray-50 overflow-auto">{JSON.stringify(data,null,2)}</pre></div>)}</main>)}
