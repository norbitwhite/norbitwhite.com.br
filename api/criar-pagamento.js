export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { valor, descricao, email } = req.body;

    if (!valor) {
      return res.status(400).json({ error: "Valor é obrigatório" });
    }

    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        transaction_amount: Number(valor),
        description: descricao || "Inscrição Campeonato Warzone",
        payment_method_id: "pix",
        payer: {
          email: email || "comprador@email.com"
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({
      payment_id: data.id,
      status: data.status,
      qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
