export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const getEnvVarsStatus = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return {
    hasUrl: !!url,
    hasKey: !!key,
    url: url ? `${url.substring(0, 20)}...` : 'NOT SET',
    key: key ? `${key.substring(0, 20)}...` : 'NOT SET',
    allSet: hasEnvVars
  };
};
