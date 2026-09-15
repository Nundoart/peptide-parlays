const origin="https://peptide-parlayscom.nundo-com.chatgpt.site";
export async function GET(request:Request){
  const peptide=new URL(request.url).searchParams.get("peptide")||"BPC-157";
  try{
    const res=await fetch(origin+"/api/comments?peptide="+encodeURIComponent(peptide),{cache:"no-store",signal:AbortSignal.timeout(12000)});
    if(!res.ok)throw new Error("Upstream error");
    return Response.json(await res.json());
  }catch{return Response.json({error:"Comments unavailable. Please try again."},{status:503});}
}
export async function POST(request:Request){
  try{
    const payload=await request.json() as {peptide?:unknown;body?:unknown};
    if(typeof payload.body!=="string"||!payload.body.trim()||payload.body.trim().length>600||typeof payload.peptide!=="string")return Response.json({error:"Invalid comment."},{status:400});
    const res=await fetch(origin+"/api/comments",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({peptide:payload.peptide,body:payload.body.trim()}),signal:AbortSignal.timeout(12000)});
    if(!res.ok)return Response.json({error:"Comment could not be saved."},{status:res.status});
    return Response.json(await res.json(),{status:201});
  }catch{return Response.json({error:"Comment could not be saved. Please try again."},{status:503});}
}
