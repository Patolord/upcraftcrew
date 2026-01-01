"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

export async function sendInvitationEmail(
	email: string,
	name: string,
	token: string,
) {
	try {
		const registerUrl = `${SITE_URL}/auth/register?token=${token}&email=${encodeURIComponent(email)}`;

		const { data, error } = await resend.emails.send({
			from: "UpCraftCrew <onboarding@resend.dev>",
			to: [email],
			subject: "Você foi convidado para se juntar à UpCraftCrew",
			html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Olá ${name}!</h2>
          <p>Você foi convidado para se juntar à equipe UpCraftCrew.</p>
          <p>Clique no link abaixo para criar sua conta e começar:</p>
          <p style="margin: 30px 0;">
            <a href="${registerUrl}" 
               style="background-color: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Criar minha conta
            </a>
          </p>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="color: #666; word-break: break-all;">${registerUrl}</p>
          <p style="margin-top: 30px; color: #666; font-size: 12px;">
            Este link é válido apenas para o email ${email}. Se você não esperava este convite, pode ignorar este email.
          </p>
        </div>
      `,
		});

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erro desconhecido",
		};
	}
}

