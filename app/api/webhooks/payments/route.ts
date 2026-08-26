export async function POST() {
  return Response.json(
    { message: "Payments webhook is not configured yet." },
    { status: 501 },
  );
}
