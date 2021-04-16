export type Config = {
  http: {
    port: number,
  },
  flexibee: {
    apiUrl: string,
    companyName: string,
    username: string,
    password: string,
    companyUrl: string,
  }
};

function requireEnv(envName: string): string {
  if (!process.env[envName]) {
    throw new Error(`Variable '${envName}' is required!`);
  }

  return process.env[envName];
}

export function loadEnvConfig(): Config {
  return {
    http: {
      port: Number.parseInt(requireEnv("HTTP_PORT")),
    },
    flexibee: {
      apiUrl: requireEnv("FLEXIBEE_API_URL"),
      companyName: requireEnv("FLEXIBEE_COMPANY_NAME"),
      username: requireEnv("FLEXIBEE_USERNAME"),
      password: requireEnv("FLEXIBEE_PASSWORD"),
      companyUrl: requireEnv("FLEXIBEE_COMPANY_URL"),
    }
  };
}