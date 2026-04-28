/**
 * Discord Integration Helper
 * Envia mensagens para o Discord via webhook
 */

interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: DiscordEmbedField[];
  thumbnail?: {
    url: string;
  };
  footer?: {
    text: string;
  };
  timestamp?: string;
}

interface DiscordMessage {
  content?: string;
  embeds?: DiscordEmbed[];
  username?: string;
  avatar_url?: string;
}

/**
 * Envia uma mensagem para o Discord via webhook
 * @param message - Mensagem a ser enviada
 * @returns Promise que resolve quando a mensagem é enviada
 */
export async function sendDiscordMessage(
  message: DiscordMessage,
): Promise<Response> {
  const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error(
        `Discord webhook returned ${response.status}: ${response.statusText}`,
      );
    }

    return response;
  } catch (error) {
    console.error("Failed to send Discord message:", error);
  }

  return new Response("OK");
}

/**
 * Cria uma mensagem formatada para contato via Discord
 * @param email - Email do contato
 * @param name - Nome do contato
 * @param message - Mensagem do contato
 * @returns Mensagem formatada para Discord
 */
export function createContactMessage(
  email: string,
  name: string,
  message: string,
): DiscordMessage {
  return {
    username: "🎯 Portfolio Contact",
    avatar_url: "https://cdn-icons-png.flaticon.com/512/681/681494.png",
    embeds: [
      {
        title: "📬 Novo Contato Recebido",
        description: `> ${message}`,
        color: 5793266, // Blue color (#5865f2)
        fields: [
          {
            name: "👤 Nome",
            value: name || "Não informado",
            inline: true,
          },
          {
            name: "📧 Email",
            value: email,
            inline: true,
          },
          {
            name: "⏰ Data/Hora",
            value: new Date().toLocaleString("pt-BR", {
              timeZone: "America/Sao_Paulo",
            }),
            inline: false,
          },
        ],
        footer: {
          text: "Enviado pelo seu portfólio",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

/**
 * Cria uma mensagem de DM aberta
 */
export function createDMOpenedMessage(): DiscordMessage {
  return {
    username: "💬 Portfolio Notifier",
    avatar_url: "https://cdn-icons-png.flaticon.com/512/681/681494.png",
    embeds: [
      {
        title: "👁️ Alguém Abriu o Chat",
        description:
          "Visitante abriu a janela de mensagens do seu portfólio. Pode ser um potencial contato!",
        color: 10181046, // Purple color
        fields: [
          {
            name: "🌐 URL",
            value: typeof window !== "undefined" ? window.location.href : "N/A",
            inline: false,
          },
          {
            name: "🕐 Horário",
            value: new Date().toLocaleString("pt-BR", {
              timeZone: "America/Sao_Paulo",
            }),
            inline: true,
          },
        ],
        footer: {
          text: "Notificação automática do portfólio",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

/**
 * Cria uma mensagem quando email é copiado
 */
export function createEmailCopiedMessage(): DiscordMessage {
  return {
    username: "✉️ Portfolio Email Copied",
    avatar_url: "https://cdn-icons-png.flaticon.com/512/681/681494.png",
    embeds: [
      {
        title: "📋 Email Copiado",
        description:
          "Visitante copiou seu email - demonstra interesse em contato!",
        color: 65280, // Green color
        fields: [
          {
            name: "📍 Localização",
            value:
              typeof window !== "undefined" ? window.location.pathname : "N/A",
            inline: true,
          },
          {
            name: "🕐 Horário",
            value: new Date().toLocaleString("pt-BR", {
              timeZone: "America/Sao_Paulo",
            }),
            inline: true,
          },
        ],
        footer: {
          text: "Notificação do portfólio",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}
