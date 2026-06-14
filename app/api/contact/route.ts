import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
    `

    try {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
          to: process.env.ADMIN_EMAIL || "paul@paullovell.uk",
          subject: `Contact: ${subject} from ${name}`,
          html: `<pre>${emailContent}</pre>`,
        }),
      })

      if (!emailResponse.ok) {
        const emailData = await emailResponse.json()
        console.error("Contact email failed:", emailData)
      }
    } catch (emailError) {
      console.error("Contact email error:", emailError)
      // Continue even if email fails, don't block the user
    }

    return NextResponse.json({ success: true, message: "Contact form submitted successfully" }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to process contact form" }, { status: 500 })
  }
}
