export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    if (url.pathname === "/api/ecoles") {

      const reponse = await fetch(
        `https://grist.numerique.gouv.fr/api/docs/${env.GRIST_DOCUMENT_ID}/tables/ECOLES/records`,
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

    if (url.pathname === "/api/seances") {

      const reponse = await fetch(
        `https://grist.numerique.gouv.fr/api/docs/${env.GRIST_DOCUMENT_ID}/tables/SEANCES/records?expand=true`,
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
if (url.pathname === "/api/animations") {
  const reponse = await fetch(
    `https://grist.numerique.gouv.fr/api/docs/${env.GRIST_DOCUMENT_ID}/tables/ANIMATIONS/records`,
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
if (url.pathname === "/api/inscriptions") {

    const reponse = await fetch(
        `https://grist.numerique.gouv.fr/api/docs/${env.GRIST_DOCUMENT_ID}/tables/INSCRIPTIONS/records?sort=Ordre`,
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

    return env.ASSETS.fetch(request);

  }
};