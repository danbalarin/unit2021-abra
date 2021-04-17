import * as dotenv from 'dotenv-flow';

export interface Config {
  http: {
    port: number,
  },
  flexibee: {
    proxyUrl: string,
    apiUrl: string,
    companyName: string,
    username: string,
    password: string,
    companyUrl: string,
  },
  sensors: {
    apiUrlHistory: string,
    apiUrlActual: string,
    interval: number,
  },
  notifications: {
    sendgrid: {
      apiKey?: string,
      emailFrom?: string,
    }
  }
}

function requireEnv(envName: string): string {
  if (!process.env[envName]) {
    throw new Error(`Variable '${envName}' is required!`);
  }

  return process.env[envName];
}

export function loadEnvConfig(): Config {
  dotenv.config();

  const config = {
    http: {
      port: Number.parseInt(requireEnv("HTTP_PORT")),
    },
    flexibee: {
      proxyUrl: requireEnv("FLEXIBEE_PROXY_URL"),
      apiUrl: requireEnv("FLEXIBEE_API_URL"),
      companyName: requireEnv("FLEXIBEE_COMPANY_NAME"),
      username: requireEnv("FLEXIBEE_USERNAME"),
      password: requireEnv("FLEXIBEE_PASSWORD"),
      companyUrl: requireEnv("FLEXIBEE_COMPANY_URL"),
    },
    sensors: {
      apiUrlHistory: requireEnv("SENSORS_HISTORY_API_URL"),
      apiUrlActual: requireEnv("SENSORS_ACTUAL_API_URL"),
      interval: Number.parseInt(requireEnv("SENSORS_INTERVAL")),
    },
    notifications: {
      sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY,
        emailFrom: process.env.SENDGRID_EMAIL_FROM,
      }
    }
  };

  if (!config.notifications.sendgrid.apiKey) {
    console.log("[SENDGRID] Is not activated, because you didn't specified 'SENDGRID_API_KEY'.");
  }

  if (config.notifications.sendgrid.apiKey && !config.notifications.sendgrid.emailFrom) {
    throw new Error("[SENDGRID] You set 'SENDGRID_API_KEY', but didn't set 'SENDGRID_EMAIL_FROM'. That's illegal...");
  }

  return config;
}