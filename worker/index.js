export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    if (url.pathname === "/api/ecoles") {
      return proxy(env, "ECOLES");
    }

    if (url.pathname === "/api/seances") {
      return proxy(env, "SEANCES");
    }

    if (url.pathname === "/api/inscriptions") {
      return proxy(env, "INSCRIPTIONS");
    }

    return env.ASSETS.fetch(request);
  }
};

async function proxy(env, table) {

  const reponse = await fetch(
    `https://grist.numerique.gouv.fr/api/docs/${env.GRIST_DOCUMENT_ID}/tables/${table}/records`,
    {
      headers: {
        Authorization: `Bearer ${env.GRIST_API_KEY}`
      }
    }
  );

  return new Response(await reponse.text(), {
    status: reponse.status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });

}