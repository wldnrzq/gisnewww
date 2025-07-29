import { Resend } from "resend";
import type { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validasi input
    if (!name || !email || !subject || !message) {
      return Response.json(
        { success: false, message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // 🆕 1. SAVE TO DATABASE FIRST
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message,
        status: "UNREAD",
      },
    });

    console.log("✅ Contact saved to database:", contact.id);

    // 2. Kirim email ke admin (dengan Contact ID)
    await resend.emails.send({
      from: "noreply@rs-gis.web.id",
      to: "admin@rs-gis.web.id", // Ganti dengan email admin Anda
      subject: `[WebGIS RS] ${subject} - dari ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📧 Pesan Baru dari Website</h1>
            <p style="color: #f0f0f0; margin: 5px 0 0 0;">WebGIS Rumah Sakit Surabaya</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                Detail Pesan
              </h2>
              
              <div style="margin: 20px 0;">
                <div style="display: flex; margin-bottom: 15px;">
                  <strong style="color: #667eea; width: 100px; display: inline-block;">Nama:</strong>
                  <span style="color: #333;">${name}</span>
                </div>
                
                <div style="display: flex; margin-bottom: 15px;">
                  <strong style="color: #667eea; width: 100px; display: inline-block;">Email:</strong>
                  <span style="color: #333;">${email}</span>
                </div>
                
                <div style="display: flex; margin-bottom: 15px;">
                  <strong style="color: #667eea; width: 100px; display: inline-block;">Subjek:</strong>
                  <span style="color: #333;">${subject}</span>
                </div>

                <div style="display: flex; margin-bottom: 15px;">
                  <strong style="color: #667eea; width: 100px; display: inline-block;">ID:</strong>
                  <span style="color: #666; font-family: monospace; font-size: 12px;">${contact.id}</span>
                </div>
              </div>
              
              <div style="margin-top: 25px;">
                <strong style="color: #667eea; display: block; margin-bottom: 10px;">Pesan:</strong>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #667eea; line-height: 1.6;">
                  ${message.replace(/\n/g, "<br>")}
                </div>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #666; font-size: 14px; margin: 0;">
                  Pesan ini dikirim melalui formulir kontak di 
                  <a href="https://rs-gis.web.id" style="color: #667eea; text-decoration: none;">
                    rs-gis.web.id
                  </a>
                </p>
                <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
                  Dikirim pada: ${new Date().toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })} WIB | Contact ID: ${contact.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      `,
    });

    // 3. Kirim email konfirmasi ke pengirim (dengan Contact ID)
    await resend.emails.send({
      from: "noreply@rs-gis.web.id",
      to: email,
      subject: "✅ Konfirmasi - Pesan Anda telah diterima",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ Terima Kasih!</h1>
            <p style="color: #f0f0f0; margin: 5px 0 0 0;">WebGIS Rumah Sakit Surabaya</p>
          </div>
          
          <div style="background: #f0fff4; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Halo <strong>${name}</strong>,
              </p>
              
              <p style="color: #333; line-height: 1.6;">
                Terima kasih telah menghubungi kami melalui website WebGIS Rumah Sakit Surabaya. 
                Pesan Anda dengan subjek "<strong>${subject}</strong>" telah kami terima dan akan 
                segera ditindaklanjuti oleh tim kami.
              </p>
              
              <div style="background: #e3f2fd; padding: 20px; border-radius: 6px; border-left: 4px solid #2196f3; margin: 20px 0;">
                <p style="color: #1976d2; margin: 0 0 10px 0; font-weight: 500;">
                  📧 Kami akan merespons pesan Anda dalam waktu 1x24 jam pada hari kerja.
                </p>
                <p style="color: #1976d2; margin: 0; font-size: 14px;">
                  <strong>Reference ID:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${contact.id}</code>
                </p>
              </div>
              
              <p style="color: #333; line-height: 1.6;">
                Jika Anda memiliki pertanyaan mendesak, Anda dapat menghubungi kami melalui:
              </p>
              
              <ul style="color: #333; line-height: 1.8;">
                <li>📞 Telepon: (031) 1234-5678</li>
                <li>📧 Email: info@webgisrs.com</li>
              </ul>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #666; font-size: 14px; margin: 0;">
                  Salam hangat,<br>
                  <strong>Tim WebGIS Rumah Sakit Surabaya</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      `,
    });

    // 🆕 4. RETURN SUCCESS WITH CONTACT ID
    return Response.json({
      success: true,
      message: "Pesan berhasil dikirim! Kami akan segera merespons.",
      contactId: contact.id, // Include contact ID in response
    });
  } catch (error) {
    console.error("❌ Contact API Error:", error);

    return Response.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 🆕 GET METHOD FOR ADMIN (Optional)
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 10, // Latest 10 contacts
    });

    return Response.json({
      success: true,
      data: contacts,
      count: contacts.length,
    });
  } catch (error) {
    console.error("❌ GET Contacts Error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch contacts" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
