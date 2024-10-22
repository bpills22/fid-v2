"use server";

// pages/api/airports/[code].ts
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../api/index";

// export async function GET(req: NextApiRequest, res: NextApiResponse) {
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).json({ error: "Airport code is required" });
//   }

//   try {
//     // Make the external API call from your server
//     const response = await client.GET(`/airports/{id}`, {
//       params: {
//         path: {
//           id: code as string,
//         },
//       },
//     });

//     if (response.error) {
//       return res.status(500).json({ error: response.error });
//     }

//     // Respond to the client with the data
//     return res.status(200).json(response.data);
//   } catch (error) {
//     return res.status(500).json({ error: "Failed to fetch airport data" });
//   }
// }

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  if (!code) {
    return NextResponse.json(
      { error: "Airport code is required" },
      { status: 400 }
    );
  }

  // Mocked response or actual API call logic here
  const airportData = await client.GET(`/airports/{id}`, {
    params: {
      path: {
        id: code as string,
      },
    },
  });
  console.log("🚀 ~ airportData:", airportData);

  if (!airportData.response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch airport data" },
      { status: 500 }
    );
  }

  const data = airportData.data;
  return NextResponse.json(data);
}
