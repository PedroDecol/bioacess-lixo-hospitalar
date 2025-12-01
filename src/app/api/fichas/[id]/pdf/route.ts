import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getFichaByIdDecrypted } from "../../../../../../lib/fichas";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: fichaId } = await context.params;

  const ficha = getFichaByIdDecrypted(fichaId);
  if (!ficha) {
    return NextResponse.json(
      { error: "Ficha não encontrada" },
      { status: 404 }
    );
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const { width } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  function text(txt: string, x: number, y: number, size = 12) {
    page.drawText(txt, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  }

  let cursor = 800;

  text("Ficha de Coleta de Bombonas", 180, cursor, 18);
  cursor -= 40;

  text(`ID da ficha: ${ficha.id}`, 40, cursor);
  cursor -= 20;

  text(`Data: ${new Date(ficha.createdAt).toLocaleString()}`, 40, cursor);
  cursor -= 30;

  text(`Motorista: ${ficha.motoristaNome}`, 40, cursor);
  cursor -= 20;

  text(`Qtd bombonas: ${ficha.quantidadeBombonas}`, 40, cursor);
  cursor -= 30;

  text("Local da Coleta:", 40, cursor, 14);
  cursor -= 20;

  text(`Local: ${ficha.local.nomeLocal}`, 40, cursor);
  cursor -= 20;

  text(`Endereço: ${ficha.local.endereco}`, 40, cursor);
  cursor -= 20;

  text(
    `Cidade/Estado: ${ficha.local.cidade} - ${ficha.local.estado}`,
    40,
    cursor
  );
  cursor -= 20;

  text(`CEP: ${ficha.local.cep}`, 40, cursor);
  cursor -= 20;

  text(
    `Responsável: ${ficha.local.responsavelNome} (${ficha.local.responsavelTelefone})`,
    40,
    cursor
  );
  cursor -= 40;

  if (ficha.observacoes) {
    text("Observações:", 40, cursor, 14);
    cursor -= 20;

    const obsLines = ficha.observacoes.match(/.{1,80}/g) || [];
    obsLines.forEach((line) => {
      text(line, 40, cursor);
      cursor -= 18;
    });

    cursor -= 20;
  }

  if (ficha.assinaturaBase64) {
    text("Assinatura do responsável:", 40, cursor, 14);
    cursor -= 130;

    const signatureBase64 = ficha.assinaturaBase64.replace(
      /^data:image\/png;base64,/,
      ""
    );
    const signatureImage = await pdfDoc.embedPng(signatureBase64);

    const sigWidth = 300;
    const sigHeight = 100;

    page.drawImage(signatureImage, {
      x: 40,
      y: cursor,
      width: sigWidth,
      height: sigHeight,
    });

    cursor -= 40;
  }

  const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ficha_${fichaId}.pdf"`,
    },
    });
}
